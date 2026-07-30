import { Injectable } from '@nestjs/common';
import type { Membership, Session, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface UpsertUserInput {
  battlenetId: string;
  battletag: string;
  membership: Membership;
  guildRank: number | null;
  matchedCharacterSlug: string | null;
  matchedCharacterName: string | null;
  matchedCharacterRealm: string | null;
}

/**
 * Único lugar do módulo auth que fala com o Prisma — ver Regra 3 do CLAUDE.md.
 */
@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertUser(input: UpsertUserInput): Promise<User> {
    const data = {
      battletag: input.battletag,
      membership: input.membership,
      guildRank: input.guildRank,
      matchedCharacterSlug: input.matchedCharacterSlug,
      matchedCharacterName: input.matchedCharacterName,
      matchedCharacterRealm: input.matchedCharacterRealm,
      verifiedAt: new Date(),
    };

    return this.prisma.user.upsert({
      where: { battlenetId: input.battlenetId },
      // isOfficer NÃO entra aqui de propósito: é atribuído à mão e um novo
      // login não pode zerar nem conceder essa permissão.
      create: { battlenetId: input.battlenetId, ...data },
      update: data,
    });
  }

  async createSession(id: string, userId: string, expiresAt: Date): Promise<Session> {
    return this.prisma.session.create({ data: { id, userId, expiresAt } });
  }

  async findSessionWithUser(id: string): Promise<(Session & { user: User }) | null> {
    return this.prisma.session.findUnique({ where: { id }, include: { user: true } });
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
