import { Injectable, Logger } from '@nestjs/common';

/** O que interessa do perfil. Nulo em cada campo é normal, não erro. */
export interface CharacterProgress {
  itemLevel: number | null;
  mythicPlusScore: number | null;
}

const VAZIO: CharacterProgress = { itemLevel: null, mythicPlusScore: null };

/** TTL do cache. Gear e score não mudam de minuto em minuto. */
const PROFILE_TTL_MS = 60 * 60 * 1000;

/**
 * Cliente do Raider.IO. Chamado só pelo Nest — ver Regra 6 do CLAUDE.md.
 *
 * A API é gratuita e sem autenticação, o que é justamente o motivo de ser
 * educado: cachear por personagem e não disparar 22 requests a cada visita.
 */
@Injectable()
export class RaiderIoService {
  private readonly logger = new Logger(RaiderIoService.name);
  private static readonly BASE = 'https://raider.io/api/v1/characters/profile';

  private readonly cache = new Map<string, { data: CharacterProgress; fetchedAt: number }>();

  /**
   * Perfil de um personagem. A chave do cache é **nome + realm** — ver Regra 6.
   *
   * Devolve tudo nulo quando o personagem não tem perfil (nunca fez M+): é caso
   * normal e não pode virar erro na tela.
   */
  async getProgress(name: string, realm: string, region: string): Promise<CharacterProgress> {
    const chave = `${realm}/${name}`.toLowerCase();

    const hit = this.cache.get(chave);
    if (hit && Date.now() - hit.fetchedAt < PROFILE_TTL_MS) return hit.data;

    const url =
      `${RaiderIoService.BASE}?region=${encodeURIComponent(region)}` +
      `&realm=${encodeURIComponent(realm)}` +
      `&name=${encodeURIComponent(name)}` +
      '&fields=gear,mythic_plus_scores_by_season:current';

    let res: Response;
    try {
      res = await fetch(url);
    } catch (err: unknown) {
      const motivo = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Raider.IO falhou para ${chave}: ${motivo}`);
      // Cache velho é melhor que nada; sem cache, devolve vazio e a tela mostra "—".
      return hit?.data ?? VAZIO;
    }

    if (!res.ok) {
      // 400 é "personagem não encontrado" — esperado, não vale poluir o log.
      if (res.status !== 400) this.logger.warn(`Raider.IO HTTP ${res.status} para ${chave}`);
      this.cache.set(chave, { data: VAZIO, fetchedAt: Date.now() });
      return VAZIO;
    }

    const body = (await res.json()) as {
      gear?: { item_level_equipped?: number };
      mythic_plus_scores_by_season?: Array<{ scores?: { all?: number } }>;
    };

    const data: CharacterProgress = {
      // `item_level_total` vem 0 na resposta; o campo útil é o equipado.
      itemLevel: body.gear?.item_level_equipped ?? null,
      mythicPlusScore: body.mythic_plus_scores_by_season?.[0]?.scores?.all ?? null,
    };

    this.cache.set(chave, { data, fetchedAt: Date.now() });
    return data;
  }
}
