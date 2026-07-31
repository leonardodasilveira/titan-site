/**
 * Dispara uma rodada do snapshot semanal à mão, contra as APIs reais.
 *
 * Uso:
 *   pnpm --filter api probe:snapshot
 *
 * O job de verdade é o `@Cron` do SnapshotsService. Esta sonda existe porque a
 * rodada só acontece uma vez por dia, e esperar não é jeito de verificar que a
 * coleta funciona — ela grava exatamente a mesma coisa, com o mesmo código.
 *
 * Exige o `dist` compilado (`pnpm --filter api build`) e o banco de pé.
 */

// Antes de qualquer import que leia process.env — o main.ts faz o mesmo.
require('../dist/load-env');

const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { SnapshotsService } = require('../dist/snapshots/snapshots.service');

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'warn', 'error'],
  });

  try {
    const result = await app.get(SnapshotsService).takeSnapshot();
    console.log('\n=== RESULTADO ===');
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await app.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
