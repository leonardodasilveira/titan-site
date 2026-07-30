import path from 'node:path';
import { config } from 'dotenv';

/**
 * Carrega o `.env` da raiz do monorepo.
 *
 * Precisa ser o **primeiro** import do main.ts: imports são hoisted, e o
 * PrismaClient lê DATABASE_URL no momento em que é construído. Se este módulo
 * carregar depois, o Prisma sobe sem connection string.
 *
 * O caminho é explícito porque o `nest start` roda com cwd em apps/api, e o
 * `.env` fica dois níveis acima.
 */
config({ path: path.resolve(__dirname, '../../../.env'), quiet: true });
