import { z } from 'zod';

/**
 * Vocabulário do domínio WoW, compartilhado entre front e back.
 *
 * Manter aqui (e não duplicado em cada app) porque esses valores aparecem em
 * validação de formulário, filtros de roster e mapeamento das APIs da Blizzard.
 */

export const REGIONS = ['us', 'eu', 'kr', 'tw', 'cn'] as const;
export const regionSchema = z.enum(REGIONS);
export type Region = z.infer<typeof regionSchema>;

export const CLASSES = [
  'death-knight',
  'demon-hunter',
  'druid',
  'evoker',
  'hunter',
  'mage',
  'monk',
  'paladin',
  'priest',
  'rogue',
  'shaman',
  'warlock',
  'warrior',
] as const;
export const wowClassSchema = z.enum(CLASSES);
export type WowClass = z.infer<typeof wowClassSchema>;

export const ROLES = ['tank', 'healer', 'melee-dps', 'ranged-dps'] as const;
export const roleSchema = z.enum(ROLES);
export type Role = z.infer<typeof roleSchema>;

/** Marcas diacríticas combinantes (Unicode Combining Diacritical Marks). */
const COMBINING_MARKS = /[̀-ͯ]/g;
const APOSTROPHES = /['’]/g;

/**
 * Normaliza nome de personagem ou realm para comparação.
 *
 * Necessário porque a Blizzard devolve realm como slug (`area-52`) em alguns
 * endpoints e como nome exibido (`Area 52`) em outros, e nomes de personagem
 * vêm com acentos e capitalização variável. Comparar string crua faz a
 * verificação de membership falhar silenciosamente — ver TIT-19.
 */
export function toSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .trim()
    .replace(APOSTROPHES, '')
    .replace(/[\s_]+/g, '-');
}

/** Identidade de um personagem, do jeito que as APIs da Blizzard esperam. */
export const characterRefSchema = z.object({
  name: z.string().min(2).max(12),
  realm: z.string().min(2).max(64),
  region: regionSchema,
});
export type CharacterRef = z.infer<typeof characterRefSchema>;
