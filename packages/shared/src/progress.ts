import { z } from 'zod';

/**
 * Relatório de progressão: chaves feitas e evolução de item level.
 *
 * VALIDADE LIMITADA POR DESIGN. Ele vale nas primeiras semanas de uma season e
 * perde sentido conforme ela avança: no fim de season quem faz chave está
 * empurrando IO, não se gearando. O mesmo número significa coisas opostas
 * dependendo da semana — por isso a tela sempre mostra em que semana está.
 *
 * O dado real da season 17 mostra a curva: 198 chaves na semana 6, 56 na 11,
 * 19 na 16.
 */
export const progressRowSchema = z.object({
  name: z.string(),
  realm: z.string(),

  /** Item level na semana. Nulo = não medido; nunca zero. */
  itemLevel: z.number().nullable(),

  /** Variação em relação à semana anterior. Nulo se falta uma das pontas. */
  itemLevelDelta: z.number().nullable(),

  /** Distância para a média do time nesta semana. */
  itemLevelVsAverage: z.number().nullable(),

  /** Chaves fechadas na semana. */
  keysDone: z.number().nullable(),

  /** Distância para a média de chaves do time. */
  keysVsAverage: z.number().nullable(),

  /** Total acumulado na season. */
  keysInSeason: z.number(),

  /** Maior nível de chave na semana. Separa 3 chaves +10 de 3 chaves +2. */
  highestKey: z.number().nullable(),
});
export type ProgressRow = z.infer<typeof progressRowSchema>;

/** Season como aparece no seletor. O patch é o que a pessoa reconhece. */
export const seasonOptionSchema = z.object({
  id: z.number().int(),
  /** "12.0". Nulo se a fonte do rótulo falhou quando a season foi gravada. */
  patch: z.string().nullable(),
  name: z.string(),
});
export type SeasonOption = z.infer<typeof seasonOptionSchema>;

export const progressReportSchema = z.object({
  season: seasonOptionSchema,

  /** Últimas seasons gravadas, para o seletor. */
  availableSeasons: seasonOptionSchema.array(),

  /** Semana do jogo mostrada. */
  period: z.number().int(),

  /** 1 na primeira semana da season. */
  weekInSeason: z.number().int(),

  /** Quantas semanas a season tem até agora. */
  periodCount: z.number().int(),

  /** Médias do time na semana. Nulas quando ninguém tem o dado. */
  average: z.object({
    itemLevel: z.number().nullable(),
    keysDone: z.number().nullable(),
  }),

  rows: progressRowSchema.array(),
});
export type ProgressReport = z.infer<typeof progressReportSchema>;

/**
 * Rótulo da season para humano: patch primeiro.
 *
 * "Season 17" não diz nada para jogador; "12.0" diz. Em WoW o **12** é a
 * expansão e o **.1** é season nova, com raid nova.
 */
export function seasonLabel(season: SeasonOption): string {
  return season.patch ? `${season.patch} — ${season.name}` : season.name;
}
