import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { toSlug } from '@titan/shared';
import { BlizzardService } from '../blizzard/blizzard.service';
import { MembershipRepository } from './membership.repository';

/**
 * Resultado de uma rodada. Existe como valor de retorno (e não só como log)
 * para o teste poder afirmar "não revogou ninguém" sem inspecionar log.
 */
export type RevalidationResult =
  | { status: 'aborted'; reason: string }
  | {
      status: 'ok';
      checked: number;
      revoked: number;
      sessionsDeleted: number;
      ranksUpdated: number;
      unverifiable: number;
    };

/**
 * Revalidação periódica de membership.
 *
 * A membership é confirmada no login e a sessão dura 12h, então sem isto quem
 * sai da guilda continua vendo a área interna até a sessão expirar — e, se não
 * deslogar, para sempre.
 *
 * Não precisa de token do usuário: o `matchedCharacterSlug` gravado no login
 * permite conferir contra o roster com a credencial da própria aplicação. É por
 * isso que não guardamos refresh token de ninguém.
 */
@Injectable()
export class MembershipService {
  private readonly logger = new Logger(MembershipService.name);

  constructor(
    private readonly blizzard: BlizzardService,
    private readonly repo: MembershipRepository,
  ) {}

  /**
   * A cada 6h, alinhado com o TTL do cache do roster.
   *
   * Mais frequente que isso não melhora nada — o dado da Blizzard não muda mais
   * rápido — e só gasta rate limit.
   */
  @Cron(CronExpression.EVERY_6_HOURS, { name: 'revalidate-membership' })
  async revalidateScheduled(): Promise<void> {
    try {
      await this.revalidateAll();
    } catch (err: unknown) {
      // Exceção aqui não pode subir: no @nestjs/schedule ela viraria unhandled
      // rejection e derrubaria o processo por causa de uma API de terceiro fora
      // do ar. Falhar a rodada é aceitável; a próxima corrige.
      this.logger.error(`Revalidação falhou: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  async revalidateAll(): Promise<RevalidationResult> {
    const startedAt = Date.now();

    // force: a rodada existe justamente para trazer dado novo. Reaproveitar o
    // cache faria o job revalidar contra a mesma foto que já usou na rodada
    // anterior.
    const roster = await this.blizzard.getGuildRosterSnapshot(true);

    // Estes dois abortos são o coração da issue: ausência do roster só significa
    // "saiu da guilda" se o roster for confiável. Roster velho ou vazio revogaria
    // a guilda inteira de uma vez.
    if (roster.stale) {
      return this.abort('a Blizzard falhou e o roster veio do cache');
    }
    if (roster.members.length === 0) {
      return this.abort('roster vazio (guilda renomeada ou config errada?)');
    }

    const members = await this.repo.findMembers();
    const byKey = new Map(roster.members.map((m) => [`${m.realmSlug}/${m.slug}`, m]));

    const toRevoke: string[] = [];
    const rankChanges: Array<{ id: string; rank: number }> = [];
    const unchanged: string[] = [];
    let unverifiable = 0;

    for (const user of members) {
      if (!user.matchedCharacterSlug || !user.matchedCharacterRealm) {
        // Membro sem personagem casado não deveria existir pelo fluxo de login.
        // Se existir (edição manual no banco), não dá para verificar — e revogar
        // sem verificar é o mesmo erro que revogar com roster quebrado.
        unverifiable++;
        this.logger.warn(`user=${user.id} é membro sem personagem casado; não dá para revalidar`);
        continue;
      }

      // toSlug dos dois lados, sempre — ver Regra 6 do CLAUDE.md. Os campos já
      // são gravados normalizados; isto protege de linha escrita à mão.
      const hit = byKey.get(
        `${toSlug(user.matchedCharacterRealm)}/${toSlug(user.matchedCharacterSlug)}`,
      );

      if (!hit) {
        toRevoke.push(user.id);
      } else if (hit.rank !== user.guildRank) {
        rankChanges.push({ id: user.id, rank: hit.rank });
      } else {
        unchanged.push(user.id);
      }
    }

    const sessionsDeleted = await this.repo.revokeMembership(toRevoke);
    for (const change of rankChanges) {
      await this.repo.updateRank(change.id, change.rank);
    }
    await this.repo.touchVerified(unchanged);

    // Log identifica por id interno, nunca por battletag: battletag é dado
    // pessoal e log costuma ir para serviço de terceiro.
    for (const id of toRevoke) {
      this.logger.warn(`Membership revogada user=${id}: personagem não está mais no roster`);
    }
    this.logger.log(
      `Revalidação: ${members.length} membros conferidos contra ${roster.members.length} do roster — ` +
        `${toRevoke.length} revogados (${sessionsDeleted} sessões apagadas), ` +
        `${rankChanges.length} ranks atualizados, ${unverifiable} sem como verificar ` +
        `(${Date.now() - startedAt}ms)`,
    );

    return {
      status: 'ok',
      checked: members.length,
      revoked: toRevoke.length,
      sessionsDeleted,
      ranksUpdated: rankChanges.length,
      unverifiable,
    };
  }

  private abort(reason: string): RevalidationResult {
    this.logger.warn(`Revalidação abortada sem revogar ninguém: ${reason}`);
    return { status: 'aborted', reason };
  }
}
