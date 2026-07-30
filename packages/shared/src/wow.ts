import { z } from 'zod';

/**
 * Vocabulário do domínio WoW, compartilhado entre front e back.
 *
 * Manter aqui (e não duplicado em cada app) porque esses valores aparecem em
 * validação de formulário, filtros de roster e mapeamento das APIs da Blizzard.
 */

/**
 * Regiões da Blizzard. O enum completo existe porque os endpoints são por
 * região e o valor precisa ser tipado — não porque o site atenda todas.
 *
 * A guilda é **exclusivamente US**, então a região é configuração fixa do
 * servidor (`BLIZZARD_REGION`), nunca escolha de quem preenche formulário.
 *
 * Cuidado: região US ≠ jogadores americanos. Realms brasileiros (Azralon,
 * Goldrinn, Nemesis, Tol Barad…) são região US. Nunca inferir região a partir
 * de IP, idioma do navegador ou nacionalidade — só do realm do personagem.
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
 * Letras latinas que o NFD **não** decompõe, porque não são letra base +
 * acento — são caracteres próprios.
 *
 * Encontrado em dado real: o roster tinha "Håøkåh". O `å` foi normalizado
 * (é a + anel combinante), mas o `ø` sobreviveu, gerando "haøkah". Quem
 * digitasse "Haokah" no formulário de apply não casaria com o roster.
 */
const LATIN_SPECIALS: Record<string, string> = {
  ø: 'o',
  æ: 'ae',
  œ: 'oe',
  ß: 'ss',
  ð: 'd',
  þ: 'th',
  đ: 'd',
  ł: 'l',
  ħ: 'h',
  ŋ: 'n',
  ı: 'i',
};
const LATIN_SPECIALS_RE = new RegExp(`[${Object.keys(LATIN_SPECIALS).join('')}]`, 'g');

/**
 * Normaliza nome de personagem ou realm para comparação.
 *
 * Necessário porque a Blizzard devolve realm como slug (`area-52`) em alguns
 * endpoints e como nome exibido (`Area 52`) em outros, e nomes de personagem
 * vêm com acentos e capitalização variável. Comparar string crua faz a
 * verificação de membership falhar silenciosamente — ver TIT-19.
 *
 * A meta é ser tolerante com quem **digita** o nome: "Zecolmeia" tem que casar
 * com "Zécolmeia" do roster.
 */
export function toSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .trim()
    .replace(LATIN_SPECIALS_RE, (c) => LATIN_SPECIALS[c] ?? c)
    .replace(APOSTROPHES, '')
    .replace(/[\s_]+/g, '-');
}

/**
 * Identidade de um personagem, do jeito que as APIs da Blizzard esperam
 * (região inclusa, porque o endpoint depende dela).
 *
 * Para entrada de usuário, use `characterInputSchema` — quem preenche
 * formulário não escolhe região.
 */
export const characterRefSchema = z.object({
  name: z.string().min(2).max(12),
  realm: z.string().min(2).max(64),
  region: regionSchema,
});
export type CharacterRef = z.infer<typeof characterRefSchema>;

/**
 * Identidade de personagem vinda de formulário: sem região.
 *
 * A região é preenchida pelo servidor a partir da config da guilda. Deixar o
 * candidato escolher entre 5 regiões só cria um jeito de errar: ele marca "eu",
 * a busca do personagem falha, e a mensagem de erro não explica o porquê.
 */
export const characterInputSchema = characterRefSchema.omit({ region: true });
export type CharacterInput = z.infer<typeof characterInputSchema>;
