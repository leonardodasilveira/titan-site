import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SeasonInput {
  id: number;
  name: string;
  patch: string | null;
  firstPeriod: number;
  periodCount: number;
  startedAt: Date;
}

export interface SnapshotInput {
  period: number;
  seasonId: number;
  nameKey: string;
  realmSlug: string;
  name: string;
  itemLevel: number | null;
  mythicPlusScore: number | null;
  keysDone: number | null;
  highestKey: number | null;
}

/**
 * Único lugar do módulo snapshots que fala com o Prisma — ver Regra 3.
 */
@Injectable()
export class SnapshotsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Grava ou atualiza a season. O id é o da Blizzard, não nosso. */
  async upsertSeason(input: SeasonInput): Promise<void> {
    const { id, ...resto } = input;
    await this.prisma.gameSeason.upsert({
      where: { id },
      create: { id, ...resto },
      update: resto,
    });
  }

  /**
   * Grava a foto da semana.
   *
   * Upsert pela chave (period, realm, nome): rodar o job duas vezes na mesma
   * semana **atualiza** a linha em vez de duplicar. Semanas passadas nunca são
   * reescritas, porque cada rodada só mexe no period corrente.
   *
   * @returns quantos personagens foram gravados
   */
  async saveSnapshots(entradas: SnapshotInput[]): Promise<number> {
    for (const e of entradas) {
      const { period, realmSlug, nameKey, ...resto } = e;
      await this.prisma.characterSnapshot.upsert({
        where: { period_realmSlug_nameKey: { period, realmSlug, nameKey } },
        create: { period, realmSlug, nameKey, ...resto },
        update: { ...resto, recordedAt: new Date() },
      });
    }

    return entradas.length;
  }
}
