import { z } from 'zod';

/**
 * Roster do **time de raid**, não da guilda.
 *
 * A lista vem do WoWAudit, que é curadoria manual do raid leader. Rank da
 * guilda não serve aqui: existe gente de rank alto que não raida há tempo, e o
 * time atravessa 6 realms — filtrar o roster da guilda por rank nunca daria a
 * lista certa.
 *
 * Ver Regra 4: rank decide quem **entra** na área interna; esta lista é quem
 * **aparece** nela. São conjuntos diferentes de propósito.
 */
export const rosterEntrySchema = z.object({
  /** Nome como a Blizzard exibe, com acento. */
  name: z.string(),
  /** Realm exibido. A identidade é sempre nome + realm — ver Regra 6. */
  realm: z.string(),

  /**
   * Classe e role como o WoWAudit devolve ("Priest", "Ranged").
   *
   * String crua de propósito, e não o enum `wowClassSchema`: mapear exigiria
   * adivinhar a grafia de cada classe ("Death Knight" → `death-knight`) e
   * quebraria calado quando uma mudasse. Aqui o valor é só exibição.
   */
  wowClass: z.string(),
  role: z.string(),

  /** `gear.item_level_equipped` do Raider.IO. Nulo quando o perfil não veio. */
  itemLevel: z.number().nullable(),

  /** Score de M+ da season corrente. Nulo quando a pessoa não fez key nenhuma. */
  mythicPlusScore: z.number().nullable(),
});
export type RosterEntry = z.infer<typeof rosterEntrySchema>;

export const rosterSchema = z.object({
  characters: rosterEntrySchema.array(),
  fetchedAt: z.string().datetime(),

  /**
   * true = o Raider.IO falhou e os números vieram nulos.
   *
   * A página mostra o time mesmo assim, avisando que falta dado — Regra 6:
   * degradar é melhor que derrubar a tela.
   */
  enrichmentFailed: z.boolean(),
});
export type Roster = z.infer<typeof rosterSchema>;
