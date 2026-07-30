import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

/**
 * Config do Prisma 7.
 *
 * A partir da v7, `url` não é mais aceito no bloco `datasource` do
 * schema.prisma — a connection string vive aqui.
 *
 * O Prisma 7 também não carrega o `.env` automaticamente, e o nosso fica na
 * raiz do monorepo, não em apps/api. Por isso o caminho explícito: rodar
 * `prisma migrate` de dentro de apps/api não encontraria o arquivo.
 */
// fileURLToPath, e não .pathname: no Windows o pathname vem como "/C:/..."
// com barra inicial, que o dotenv interpreta como caminho relativo.
loadEnv({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
