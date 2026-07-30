import { randomBytes } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import type { User } from '@prisma/client';
import { canAccessInternalArea, type SessionUser } from '@titan/shared';
import { BlizzardService } from '../blizzard/blizzard.service';
import { loadGuildConfig, type GuildConfig } from '../config/guild.config';
import { AuthRepository } from './auth.repository';

/** Duração da sessão. Curta o suficiente para revalidar membership com frequência. */
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly guild: GuildConfig;

  constructor(
    private readonly blizzard: BlizzardService,
    private readonly repo: AuthRepository,
  ) {
    this.guild = loadGuildConfig();
  }

  /** Token opaco de 256 bits. Não é previsível, então não precisa ser assinado. */
  createOpaqueToken(): string {
    return randomBytes(32).toString('hex');
  }

  buildAuthorizeUrl(state: string, redirectUri: string, forceLogin = false): string {
    return this.blizzard.buildAuthorizeUrl(state, redirectUri, forceLogin);
  }

  /**
   * Fluxo completo do callback: code → conta → membership → sessão.
   *
   * Retorna o id da sessão para o controller pôr no cookie.
   */
  async completeLogin(
    code: string,
    redirectUri: string,
  ): Promise<{ sessionId: string; user: User }> {
    const startedAt = Date.now();

    const userToken = await this.blizzard.exchangeCodeForUserToken(code, redirectUri);
    const afterToken = Date.now();

    // As três em paralelo: só a troca do code é sequencial (as outras dependem
    // do token). Antes o userinfo rodava sozinho antes das outras duas, somando
    // uma ida e volta à Blizzard sem motivo.
    //
    // O roster normalmente vem do cache aquecido no boot; só a primeira chamada
    // depois de 6h paga a rede.
    const [account, characters, roster] = await Promise.all([
      this.blizzard.getAccountInfo(userToken),
      this.blizzard.getAccountCharacters(userToken),
      this.blizzard.getGuildRoster(),
    ]);
    const afterProfile = Date.now();

    // Interseção por slug normalizado. Comparar string crua falharia
    // silenciosamente com nomes acentuados — ver toSlug no shared.
    const rosterBySlug = new Map(roster.map((m) => [`${m.realmSlug}/${m.slug}`, m]));

    let matched = null;
    for (const char of characters) {
      const hit = rosterBySlug.get(`${char.realmSlug}/${char.slug}`);
      if (hit) {
        // Se a conta tem vários personagens na guilda, o de menor rank
        // (mais alto na hierarquia) é o mais representativo.
        if (!matched || hit.rank < matched.member.rank) {
          matched = { character: char, member: hit };
        }
      }
    }

    const user = await this.repo.upsertUser({
      battlenetId: account.battlenetId,
      battletag: account.battletag,
      membership: matched ? 'member' : 'not_member',
      guildRank: matched?.member.rank ?? null,
      matchedCharacterSlug: matched?.character.slug ?? null,
      matchedCharacterName: matched?.member.name ?? null,
      matchedCharacterRealm: matched?.character.realmSlug ?? null,
    });

    const sessionId = this.createOpaqueToken();
    await this.repo.createSession(sessionId, user.id, new Date(Date.now() + SESSION_TTL_MS));

    // Loga o id interno, NÃO o battletag: battletag é dado pessoal, e em
    // produção log costuma ir para serviço de terceiro.
    //
    // Os tempos existem porque o callback é a única parte do fluxo que a pessoa
    // espera olhando tela em branco. Sem medição, "está lento" vira chute.
    this.logger.log(
      `Login user=${user.id} ${matched ? `membro rank=${matched.member.rank}` : 'não-membro'} ` +
        `chars=${characters.length} ` +
        `(token ${afterToken - startedAt}ms, perfil+roster ${afterProfile - afterToken}ms, ` +
        `total ${Date.now() - startedAt}ms)`,
    );

    // Oportunístico: evita a tabela crescer sem limite sem precisar de job.
    void this.repo.deleteExpiredSessions().catch(() => undefined);

    return { sessionId, user };
  }

  /** Resolve a sessão do cookie. Null = sem sessão válida. */
  async resolveSession(sessionId: string | undefined): Promise<User | null> {
    if (!sessionId) return null;

    const session = await this.repo.findSessionWithUser(sessionId);
    if (!session) return null;

    if (session.expiresAt.getTime() < Date.now()) {
      await this.repo.deleteSession(sessionId);
      return null;
    }

    return session.user;
  }

  async logout(sessionId: string | undefined): Promise<void> {
    if (sessionId) await this.repo.deleteSession(sessionId);
  }

  /**
   * Projeção do User para o front. Nunca inclui token da Blizzard.
   *
   * `hasInternalAccess` é resolvido aqui porque o corte de rank é configuração
   * do servidor e o front não tem acesso a ela. A regra em si mora no shared —
   * aqui só se aplica o corte a ela.
   */
  toSessionUser(user: User): SessionUser {
    const membership = user.membership === 'member' ? ('member' as const) : ('not-member' as const);

    return {
      battletag: user.battletag,
      membership,
      isOfficer: user.isOfficer,
      guildRank: user.guildRank,
      hasInternalAccess: canAccessInternalArea(
        { membership, guildRank: user.guildRank },
        this.guild.rankAccessMax,
      ),
      matchedCharacter:
        user.matchedCharacterName && user.matchedCharacterRealm
          ? {
              name: user.matchedCharacterName,
              realm: user.matchedCharacterRealm,
              region: 'us',
            }
          : null,
      verifiedAt: user.verifiedAt?.toISOString() ?? null,
    };
  }

  get sessionTtlMs(): number {
    return SESSION_TTL_MS;
  }
}
