import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface RaidNightInput {
  id: number;
  date: string;
  title: string;
  instance: string;
  difficulty: string;
  optional: boolean;
  seasonId: number | null;
  reportCodes: string[];
  bossPulls: number | null;
  hasSignups: boolean;
}

export interface AttendanceInput {
  nameKey: string;
  realmKey: string;
  name: string;
  realm: string;
  signup: string | null;
  raided: boolean | null;
  firstPull: number | null;
  pulls: number | null;
}

/** Único lugar do módulo attendance que fala com o Prisma — ver Regra 3. */
@Injectable()
export class AttendanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Grava a noite e a presença de todo mundo nela.
   *
   * **Nunca toca em `note`, `noteBy` e `noteAt`.** Essa é a anotação do raid
   * leader, e reprocessar a noite não pode apagar o motivo que ele escreveu —
   * o que fica no banco é a correção do humano, nunca a inferência.
   *
   * Numa transação porque uma noite gravada pela metade é pior que uma noite
   * não gravada: a tela mostraria meia raid faltando.
   */
  async saveNight(night: RaidNightInput, entries: AttendanceInput[]): Promise<number> {
    const { id, ...resto } = night;

    await this.prisma.$transaction([
      this.prisma.raidNight.upsert({
        where: { id },
        create: { id, ...resto },
        update: resto,
      }),

      ...entries.map((e) => {
        const { nameKey, realmKey, ...campos } = e;
        return this.prisma.raidAttendance.upsert({
          where: {
            raidNightId_realmKey_nameKey: { raidNightId: id, realmKey, nameKey },
          },
          create: { raidNightId: id, nameKey, realmKey, ...campos },
          update: campos,
        });
      }),
    ]);

    return entries.length;
  }

  /** Noites já gravadas, para o job saber o que pular. */
  async listRecordedNightIds(): Promise<Set<number>> {
    const linhas = await this.prisma.raidNight.findMany({ select: { id: true } });
    return new Set(linhas.map((l) => l.id));
  }

  /** Noites com presença, da mais recente para a mais antiga. */
  listNights(limite: number, seasonId?: number) {
    return this.prisma.raidNight.findMany({
      where: seasonId === undefined ? {} : { seasonId },
      orderBy: { date: 'desc' },
      take: limite,
      include: {
        attendance: {
          orderBy: [{ name: 'asc' }],
        },
      },
    });
  }

  /**
   * Histórico de um personagem.
   *
   * Existe separado de `listNights` porque a Regra 7 é explícita: membro vê o
   * PRÓPRIO histórico inteiro, e não o de outro membro. Filtrar no banco em vez
   * de na tela é o que impede que o dado dos outros trafegue.
   */
  listForCharacter(realmKey: string, nameKey: string, limite: number) {
    return this.prisma.raidAttendance.findMany({
      where: { realmKey, nameKey },
      orderBy: { raidNight: { date: 'desc' } },
      take: limite,
      include: { raidNight: true },
    });
  }
}
