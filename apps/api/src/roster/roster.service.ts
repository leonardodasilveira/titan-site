import { Injectable, Logger } from '@nestjs/common';
import type { Roster } from '@titan/shared';
import { loadGuildConfig, type GuildConfig } from '../config/guild.config';
import { RaiderIoService } from '../raiderio/raiderio.service';
import { WowAuditService } from '../wowaudit/wowaudit.service';

/**
 * Roster do time de raid, juntando as duas fontes.
 *
 * Quem está no time: WoWAudit (curadoria manual do raid leader).
 * Como está cada um: Raider.IO (item level e score de M+).
 *
 * O WoWAudit não expõe ilvl nem score — conferido: `/v1/characters` não traz,
 * `/v1/characters/{id}` não existe como GET, e `historical_data` só tem
 * atividade de vault. Por isso as duas fontes.
 */
@Injectable()
export class RosterService {
  private readonly logger = new Logger(RosterService.name);
  private readonly guild: GuildConfig;

  constructor(
    private readonly wowaudit: WowAuditService,
    private readonly raiderio: RaiderIoService,
  ) {
    this.guild = loadGuildConfig();
  }

  async getRaidTeam(): Promise<Roster> {
    const team = await this.wowaudit.getTeamCharacters();

    // A região vem da config da guilda e de nenhum outro lugar — Regra 6. O
    // time atravessa realms, mas todos dentro da mesma região.
    const progresso = await Promise.allSettled(
      team.map((c) => this.raiderio.getProgress(c.name, c.realm, this.guild.region)),
    );

    const falhas = progresso.filter((p) => p.status === 'rejected').length;
    if (falhas > 0) {
      this.logger.warn(`Raider.IO falhou para ${falhas} de ${team.length} personagens`);
    }

    const characters = team.map((c, i) => {
      // `allSettled` preserva a ordem, então progresso[i] é sempre deste
      // personagem. O acesso indexado ainda é opcional para o TypeScript, e
      // aqui o fallback é o mesmo de uma promessa rejeitada: sem número.
      const p = progresso[i];
      const dados =
        p?.status === 'fulfilled' ? p.value : { itemLevel: null, mythicPlusScore: null };

      return {
        name: c.name,
        realm: c.realm,
        wowClass: c.wowClass,
        role: c.role,
        itemLevel: dados.itemLevel,
        mythicPlusScore: dados.mythicPlusScore,
      };
    });

    // Maior ilvl primeiro. Quem não tem número vai para o fim, em vez de ser
    // tratado como ilvl 0 — "sem dado" e "gear ruim" são coisas diferentes.
    characters.sort((a, b) => (b.itemLevel ?? -1) - (a.itemLevel ?? -1));

    return {
      characters,
      fetchedAt: new Date().toISOString(),
      // Só marca degradado se TODO mundo ficou sem dado: um personagem sem
      // perfil no Raider.IO é normal e não deve acender aviso na tela.
      enrichmentFailed: characters.length > 0 && characters.every((c) => c.itemLevel === null),
    };
  }
}
