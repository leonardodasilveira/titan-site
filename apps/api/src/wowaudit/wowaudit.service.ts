import { Injectable, Logger } from '@nestjs/common';

/** Personagem do time, já traduzido do formato do WoWAudit. */
export interface TeamCharacter {
  name: string;
  realm: string;
  wowClass: string;
  role: string;
}

/** TTL do cache. O raid leader mexe no time raramente. */
const TEAM_TTL_MS = 60 * 60 * 1000;

/**
 * Cliente do WoWAudit. Chamado só pelo Nest — ver Regra 6 do CLAUDE.md.
 *
 * ARMADILHA: `https://wowaudit.com/api/v1/...` **não** é a API. É a página de
 * marketing em HTML, e responde 200 para qualquer caminho, inclusive sem chave
 * nenhuma. Quem sondar por status code conclui que autenticou. A API real é
 * `/v1` e devolve `application/json`.
 */
@Injectable()
export class WowAuditService {
  private readonly logger = new Logger(WowAuditService.name);
  private static readonly BASE = 'https://wowaudit.com/v1';

  private cache: { characters: TeamCharacter[]; fetchedAt: number } | null = null;

  /**
   * Time de raid, com cache. Devolve o último dado bom se a chamada falhar.
   *
   * Lista curada à mão pelo raid leader — é a resposta para "quem está no time
   * hoje", que o rank da guilda não responde.
   */
  async getTeamCharacters(force = false): Promise<TeamCharacter[]> {
    if (!force && this.cache && Date.now() - this.cache.fetchedAt < TEAM_TTL_MS) {
      return this.cache.characters;
    }

    const key = process.env.WOW_AUDIT_KEY;
    if (!key) {
      throw new Error('WOW_AUDIT_KEY não configurada. Ver .env.example.');
    }

    let res: Response;
    try {
      res = await fetch(`${WowAuditService.BASE}/characters`, {
        headers: { Authorization: `Bearer ${key}` },
      });
    } catch (err: unknown) {
      return this.fallback(err instanceof Error ? err.message : String(err));
    }

    if (!res.ok) return this.fallback(`HTTP ${res.status}`);

    const body = (await res.json()) as Array<{
      name: string;
      realm: string;
      class: string;
      role: string;
    }>;

    const characters = body.map((c) => ({
      name: c.name,
      realm: c.realm,
      wowClass: c.class,
      role: c.role,
    }));

    this.cache = { characters, fetchedAt: Date.now() };
    this.logger.log(`Time do WoWAudit atualizado: ${characters.length} personagens`);
    return characters;
  }

  private fallback(reason: string): TeamCharacter[] {
    if (this.cache) {
      const desde = new Date(this.cache.fetchedAt).toISOString();
      this.logger.warn(`WoWAudit falhou (${reason}); usando cache de ${desde}`);
      return this.cache.characters;
    }
    throw new Error(`WoWAudit falhou e não há cache anterior: ${reason}`);
  }
}
