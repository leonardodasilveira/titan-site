/**
 * Sonda de credenciais da Blizzard.
 *
 * Verifica, sem precisar de login de usuário nem de código do site:
 *   1. As credenciais do cliente OAuth são válidas (grant client_credentials)
 *   2. A config da guilda encontra o roster na Game Data API
 *
 * Uso:
 *   pnpm --filter api probe:oauth
 *
 * NUNCA imprime client_id, client_secret nem access token.
 *
 * NOTA — o que esta sonda NÃO faz: descobrir qual redirect URI está registrada
 * no cliente. A Blizzard redireciona para o login ANTES de validar a
 * redirect_uri, e a resposta é idêntica para uma URI válida e uma inválida.
 * Ela só valida depois da autenticação. Por isso a redirect URI é configurável
 * via BLIZZARD_REDIRECT_URI, e tem que casar exatamente com a registrada.
 */

const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env'), quiet: true });

const { toSlug } = require('@titan/shared');

const TOKEN_URL = 'https://oauth.battle.net/token';

async function getClientToken(clientId, clientSecret) {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`token HTTP ${res.status} — ${body.slice(0, 200)}`);
  }

  return res.json();
}

async function getRoster(token, region, guildName, realm) {
  const url =
    `https://${region}.api.blizzard.com/data/wow/guild/` +
    `${encodeURIComponent(toSlug(realm))}/${encodeURIComponent(toSlug(guildName))}/roster` +
    `?namespace=profile-${region}&locale=en_US`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(25000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    return { ok: false, status: res.status, body: body.slice(0, 300), url };
  }

  return { ok: true, data: await res.json(), url };
}

async function main() {
  const clientId = process.env.BLIZZARD_CLIENT_ID;
  const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;
  const region = process.env.BLIZZARD_REGION ?? 'us';
  const guildName = process.env.GUILD_NAME;
  const realm = process.env.GUILD_REALM;

  const missing = [];
  if (!clientId) missing.push('BLIZZARD_CLIENT_ID');
  if (!clientSecret) missing.push('BLIZZARD_CLIENT_SECRET');
  if (!guildName) missing.push('GUILD_NAME');
  if (!realm) missing.push('GUILD_REALM');

  if (missing.length > 0) {
    console.error(`Faltando no .env: ${missing.join(', ')}`);
    console.error('Ver .env.example.');
    process.exit(2);
  }

  console.log('--- 1. credenciais do cliente OAuth ---');
  let token;
  try {
    const result = await getClientToken(clientId, clientSecret);
    token = result.access_token;
    console.log(`OK    token obtido (expira em ${result.expires_in}s, valor não exibido)`);
    console.log(
      `      escopo do token: ${result.scope ?? '(nenhum — normal em client_credentials)'}`,
    );
  } catch (err) {
    console.error(`FALHA ${err.message}`);
    console.error('\nCausas comuns: client_id/secret trocados, ou cliente removido no portal.');
    process.exit(1);
  }

  console.log('');
  console.log('--- 2. roster da guilda na Game Data API ---');
  console.log(`      guilda: "${guildName}" / realm: "${realm}" / região: ${region}`);
  console.log(`      slug:   ${toSlug(realm)}/${toSlug(guildName)}`);

  const roster = await getRoster(token, region, guildName, realm);

  if (!roster.ok) {
    console.error(`FALHA HTTP ${roster.status}`);
    if (roster.status === 404) {
      console.error('\n404 = guilda não encontrada nessa região/realm.');
      console.error('Confira GUILD_NAME e GUILD_REALM — têm que ser como aparecem no jogo.');
    }
    console.error(roster.body);
    process.exit(1);
  }

  const members = roster.data.members ?? [];
  console.log(`OK    ${members.length} membros`);

  const faction = roster.data.guild?.faction?.name ?? '(não informada)';
  console.log(`      facção: ${faction}`);

  const byRank = new Map();
  for (const m of members) byRank.set(m.rank, (byRank.get(m.rank) ?? 0) + 1);
  const ranks = [...byRank.keys()].sort((a, b) => a - b);
  console.log(`      ranks:  ${ranks.map((r) => `${r}:${byRank.get(r)}`).join('  ')}`);

  // Teste de interseção com os personagens passados na linha de comando.
  const wanted = process.argv.slice(2);
  if (wanted.length > 0) {
    console.log('');
    console.log('--- 3. interseção (decide acesso à área interna) ---');
    const index = new Map();
    for (const m of members) index.set(toSlug(m.character.name), m);

    for (const name of wanted) {
      const hit = index.get(toSlug(name));
      if (hit) {
        console.log(`MEMBRO      ${name} → "${hit.character.name}" (rank ${hit.rank})`);
      } else {
        console.log(`NÃO ACHADO  ${name} (slug: "${toSlug(name)}")`);
      }
    }
  }

  console.log('');
  console.log('Credenciais e config da guilda validadas contra a Blizzard.');
}

main().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
