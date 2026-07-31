import { Injectable } from '@nestjs/common';
import type { GuildCharacter, Membership, Session, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/** Personagem da conta que está no roster, como o login acabou de ver. */
export interface MatchedCharacterInput {
  /** Identidade via toCharacterKey() — COM acento. Ver Regra 6. */
  nameKey: string;
  /** Realm via toSlug() — aqui remover acento é correto. */
  realmSlug: string;
  /** Nome exibido, com acento e capitalização da Blizzard. */
  name: string;
  rank: number;
}

export interface UpsertUserInput {
  battlenetId: string;
  battletag: string;
  membership: Membership;
  /** Melhor rank (menor número) entre `characters`. Nulo quando a lista é vazia. */
  guildRank: number | null;
  characters: MatchedCharacterInput[];
}

/** User com os personagens carregados. É sempre assim que auth precisa dele. */
export type UserWithCharacters = User & { characters: GuildCharacter[] };

/**
 * Único lugar do módulo auth que fala com o Prisma — ver Regra 3 do CLAUDE.md.
 */
@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Grava a conta e **substitui** a lista de personagens.
   *
   * Substitui em vez de mesclar porque o login acabou de ver a verdade
   * completa: com o token do usuário, `characters` é a lista inteira da conta
   * cruzada com o roster de agora. Mesclar deixaria para sempre um personagem
   * que a pessoa deletou ou transferiu de realm.
   *
   * Tudo numa transação: entre apagar e recriar, um crash deixaria a conta sem
   * personagem nenhum — estado que o job de revalidação lê como "não dá para
   * verificar" e que exigiria login manual para consertar.
   */
  async upsertUser(input: UpsertUserInput): Promise<UserWithCharacters> {
    const data = {
      battletag: input.battletag,
      membership: input.membership,
      guildRank: input.guildRank,
      verifiedAt: new Date(),
    };

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { battlenetId: input.battlenetId },
        // isOfficer NÃO entra aqui de propósito: é atribuído à mão e um novo
        // login não pode zerar nem conceder essa permissão.
        create: { battlenetId: input.battlenetId, ...data },
        update: data,
      });

      await tx.guildCharacter.deleteMany({ where: { userId: user.id } });

      if (input.characters.length > 0) {
        await tx.guildCharacter.createMany({
          data: input.characters.map((c) => ({ ...c, userId: user.id })),
        });
      }

      return tx.user.findUniqueOrThrow({
        where: { id: user.id },
        include: { characters: true },
      });
    });
  }

  async createSession(id: string, userId: string, expiresAt: Date): Promise<Session> {
    return this.prisma.session.create({ data: { id, userId, expiresAt } });
  }

  async findSessionWithUser(id: string): Promise<(Session & { user: UserWithCharacters }) | null> {
    return this.prisma.session.findUnique({
      where: { id },
      include: { user: { include: { characters: true } } },
    });
  }

  async deleteSession(id: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { id } });
  }

  /** Remove sessões expiradas. Chamado oportunisticamente, não é job. */
  async deleteExpiredSessions(): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return result.count;
  }
}
