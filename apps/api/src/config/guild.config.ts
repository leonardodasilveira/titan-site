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
}

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

  return { region: region.data, name, realm };
}
