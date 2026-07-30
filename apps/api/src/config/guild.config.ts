import { regionSchema, type Region } from '@titan/shared';

/**
 * Identidade da guilda, vinda do ambiente.
 *
 * A guilda é **exclusivamente US**. A região não é escolha de usuário em
 * nenhum ponto do sistema — é este valor, e só.
 *
 * Nada disso é segredo (nome e realm de guilda são públicos no jogo), mas fica
 * em env porque muda por ambiente e porque hardcodar amarraria o código a uma
 * guilda só.
 */
export interface GuildConfig {
  region: Region;
  name: string;
  realm: string;

  /**
   * Corte de rank para a área interna — ver Regra 4 do CLAUDE.md.
   *
   * Rank 0 é o guild master, então o teste é `rank <= corte`. Fica em
   * configuração, e não em constante no código, porque `rank` é a **posição**
   * do rank na lista da guilda: reordenar ranks no jogo muda o significado do
   * número sem gerar erro nenhum.
   */
  rankAccessMax: number;
}

/** Corte usado quando `GUILD_RANK_ACCESS_MAX` não está definida. */
const DEFAULT_RANK_ACCESS_MAX = 4;

/**
 * Lê e valida a config da guilda.
 *
 * Lança em vez de cair em default silencioso: guilda errada não dá erro, dá
 * roster vazio — e roster vazio faz *todo mundo* ser recusado como não-membro.
 * Falha de config tem que ser barulhenta.
 */
export function loadGuildConfig(env: NodeJS.ProcessEnv = process.env): GuildConfig {
  const region = regionSchema.safeParse(env.BLIZZARD_REGION ?? 'us');
  if (!region.success) {
    throw new Error(
      `BLIZZARD_REGION inválida: "${env.BLIZZARD_REGION}". Valores aceitos: us, eu, kr, tw, cn.`,
    );
  }

  if (region.data !== 'us') {
    throw new Error(
      `BLIZZARD_REGION está "${region.data}", mas a guilda é US-only. ` +
        'Se isso mudou de verdade, ajuste esta validação junto — não só o .env.',
    );
  }

  const name = env.GUILD_NAME?.trim();
  const realm = env.GUILD_REALM?.trim();

  if (!name || !realm) {
    throw new Error(
      'GUILD_NAME e GUILD_REALM são obrigatórios para consultar o roster. Ver .env.example.',
    );
  }

  return { region: region.data, name, realm, rankAccessMax: parseRankAccessMax(env) };
}

/**
 * Corte de rank, com default seguro.
 *
 * Ausente cai no default de propósito: um `.env` antigo (de antes da Regra 4
 * mudar) não pode derrubar a API no boot. O default é o corte real da guilda,
 * então errar aqui restringe, não libera.
 *
 * Valor inválido **lança**, porque `Number('raider')` é `NaN` e toda comparação
 * com `NaN` é falsa — a área interna ficaria inacessível para todo mundo, sem
 * nenhuma mensagem de erro.
 */
function parseRankAccessMax(env: NodeJS.ProcessEnv): number {
  const raw = env.GUILD_RANK_ACCESS_MAX?.trim();
  if (!raw) return DEFAULT_RANK_ACCESS_MAX;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(
      `GUILD_RANK_ACCESS_MAX inválido: "${raw}". Esperado um inteiro >= 0 ` +
        '(rank 0 é o guild master; o número cresce descendo a hierarquia).',
    );
  }

  return parsed;
}
