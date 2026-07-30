import { z } from 'zod';

/**
 * Contrato do endpoint de health da API.
 *
 * Serve dois propósitos: prova que a cadeia front → API → schema compartilhado
 * funciona, e vira o healthcheck do container quando o deploy existir.
 */
export const healthSchema = z.object({
  status: z.literal('ok'),
  service: z.string(),
  /** Segundos desde que o processo subiu. */
  uptimeSeconds: z.number().nonnegative(),
  timestamp: z.string().datetime(),
});
export type Health = z.infer<typeof healthSchema>;
