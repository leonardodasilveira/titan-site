import { z } from 'zod';
import { characterRefSchema, roleSchema, wowClassSchema } from './wow.js';

/**
 * Contrato da candidatura (apply).
 *
 * PROVISÓRIO — os campos precisam ser revisados por quem realmente recruta na
 * guilda antes de virar migration definitiva. Ver TIT-13.
 *
 * Este schema é a única fonte de verdade: o Nest valida com ele no
 * ZodValidationPipe e o form do Next infere os tipos dele. Não redeclarar
 * esses campos em nenhum dos apps.
 */
export const createApplicationSchema = z.object({
  character: characterRefSchema,
  class: wowClassSchema,
  mainRole: roleSchema,
  offRole: roleSchema.optional(),

  discordTag: z.string().min(2).max(37),
  battleTag: z
    .string()
    .regex(/^.{2,12}#\d{4,5}$/, 'Formato esperado: Nome#1234')
    .optional(),

  /** Progresso anterior, guildas anteriores, o que a pessoa já matou. */
  experience: z.string().min(1).max(4000),

  /** Quais dias da semana a pessoa consegue raidar (0 = domingo). */
  availableDays: z.array(z.number().int().min(0).max(6)).min(1),

  motivation: z.string().min(1).max(4000),

  warcraftLogsUrl: z.string().url().optional(),

  /**
   * Honeypot anti-spam: campo escondido no form. Humano deixa vazio; bot que
   * preenche tudo cai aqui. Ver TIT-14.
   */
  website: z.string().max(0).optional(),
});
export type CreateApplication = z.infer<typeof createApplicationSchema>;

export const APPLICATION_STATUSES = ['pending', 'reviewing', 'accepted', 'rejected'] as const;
export const applicationStatusSchema = z.enum(APPLICATION_STATUSES);
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;
