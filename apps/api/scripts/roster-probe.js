/**
 * Sonda de roster — testa a lógica de membership SEM precisar de credencial
 * da Blizzard nem do fluxo de login.
 *
 * Uso:
 *   node scripts/roster-probe.js "<Nome da Guilda>" <realm> [personagem...]
 *
 * Exemplo:
 *   node scripts/roster-probe.js "Titan Inc" Azralon Zenithus
 *
 * Fonte: Raider.IO (pública, sem auth). Serve para validar a lógica hoje.
 * ATENÇÃO: o Raider.IO é crawleado, então o roster pode estar atrasado em
 * relação ao jogo. A fonte da verdade para membership em produção é a Game
 * Data API da Blizzard (TIT-19) — esta sonda é ferramenta de desenvolvimento.
 */

const { toSlug } = require('@titan/shared');

const REGION = 'us'; // a guilda é US-only, ver guild.config.ts

async function main() {
  const [guildName, realm, ...characters] = process.argv.slice(2);

  if (!guildName || !realm) {
    console.error('Uso: node scripts/roster-probe.js "<Nome da Guilda>" <realm> [personagem...]');
    process.exit(2);
  }

  const url =
    `https://raider.io/api/v1/guilds/profile` +
    `?region=${REGION}` +
    `&realm=${encodeURIComponent(toSlug(realm))}` +
    `&name=${encodeURIComponent(guildName)}` +
    `&fields=members,raid_progression`;

  console.log(`Consultando ${REGION}/${toSlug(realm)}/${guildName}...\n`);

  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(`Falhou: HTTP ${res.status}`);
    if (res.status === 400) {
      console.error(
        '\n400 normalmente significa guilda ou realm não encontrado.\n' +
          'Confira: o nome tem que ser exatamente como no jogo (com espaços e acentos),\n' +
          'e o realm tem que ser da região US.',
      );
    }
    console.error(body.slice(0, 300));
    process.exit(1);
  }

  const guild = await res.json();
  const members = guild.members ?? [];

  console.log(`Guilda:   ${guild.name}`);
  console.log(`Realm:    ${guild.realm} (${guild.region})`);
  console.log(`Facção:   ${guild.faction}`);
  console.log(`Membros:  ${members.length}`);
  console.log(`Crawl:    ${guild.last_crawled_at}`);

  const progression = guild.raid_progression ?? {};
  const tiers = Object.entries(progression);
  if (tiers.length > 0) {
    console.log('\nProgresso de raid:');
    for (const [tier, data] of tiers) {
      console.log(`  ${tier.padEnd(28)} ${data.summary}`);
    }
  }

  // Distribuição de rank — é isso que vira role no site (rank 0 = GM).
  const byRank = new Map();
  for (const m of members) {
    byRank.set(m.rank, (byRank.get(m.rank) ?? 0) + 1);
  }
  console.log('\nDistribuição de rank (rank 0 = GM):');
  for (const rank of [...byRank.keys()].sort((a, b) => a - b)) {
    console.log(`  rank ${String(rank).padEnd(3)} ${byRank.get(rank)} membro(s)`);
  }

  // O teste que importa: a interseção por slug encontra a pessoa?
  if (characters.length > 0) {
    console.log('\nTeste de interseção (é o que decide acesso à área interna):');

    // Índice por slug, exatamente como a verificação real vai fazer.
    const index = new Map();
    for (const m of members) {
      index.set(toSlug(m.character.name), m);
    }

    for (const name of characters) {
      const hit = index.get(toSlug(name));
      if (hit) {
        console.log(
          `  MEMBRO      ${name} → "${hit.character.name}" ` +
            `(rank ${hit.rank}, ${hit.character.class} ${hit.character.active_spec_name})`,
        );
      } else {
        console.log(`  NÃO ACHADO  ${name}  (slug testado: "${toSlug(name)}")`);
      }
    }
  }

  // Prova concreta de por que toSlug existe: nomes que só casam normalizados.
  const acentuados = members
    .map((m) => m.character.name)
    .filter((n) => toSlug(n) !== n.toLowerCase())
    .slice(0, 5);

  if (acentuados.length > 0) {
    console.log('\nNomes que quebrariam comparação por string crua:');
    for (const nome of acentuados) {
      console.log(`  "${nome}" → "${toSlug(nome)}"`);
    }
  }
}

main().catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
