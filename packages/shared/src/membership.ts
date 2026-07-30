import { z } from 'zod';
import { characterRefSchema } from './wow.js';

/**
 * Modelo de acesso.
 *
 * DECISÃO (2026-07-30): acesso é **binário** — membro da guilda ou não.
 *
 * Não existe hierarquia de permissão por rank do jogo. O roster da guilda tem
 * ranks que misturam alts, raiders e social, e a liderança ainda não decidiu
 * onde termina "oficial". Modelar hierarquia agora significaria escolher errado
 * e depois migrar.
 *
 * O `guildRank` é **gravado mas não usado** para permissão. Custa nada guardar,
 * e quando a hierarquia existir o histórico já estará aqui — sem migration.
 */

export const membershipSchema = z.enum([
  /** Tem personagem no roster da guilda. Acessa a área interna. */
  'member',
  /** Conta Battle.net válida, mas sem personagem no roster. Só pode dar apply. */
  'not-member',
]);
export type Membership = z.infer<typeof membershipSchema>;

/**
 * Usuário da sessão, como o front recebe de `GET /auth/me`.
 *
 * Nunca inclui token da Blizzard nem refresh token — esses ficam no servidor.
 */
export const sessionUserSchema = z.object({
  battletag: z.string(),
  membership: membershipSchema,

  /**
   * Acesso a dado pessoal de candidatos (painel de recrutamento).
   *
   * Flag **manual**, atribuída à mão, deliberadamente não derivada do rank do
   * jogo. Motivo: candidatura contém Discord tag, Battle.tag e texto que a
   * pessoa escreveu esperando que só a liderança lesse. Errar o mapeamento de
   * rank para cima vazaria isso para centenas de membros.
   *
   * Um oficial é sempre membro; a recíproca não vale.
   */
  isOfficer: z.boolean(),

  /**
   * Rank no roster no momento da verificação. Registro histórico — **não** use
   * para decidir permissão. Ver a decisão no topo deste arquivo.
   */
  guildRank: z.number().int().nonnegative().nullable(),

  /** Personagem que casou com o roster, se houver. */
  matchedCharacter: characterRefSchema.nullable(),

  /**
   * Quando a membership foi confirmada contra o roster pela última vez.
   *
   * Sem revalidação periódica, quem sai da guilda mantém acesso para sempre.
   * Ver TIT-19.
   */
  verifiedAt: z.string().datetime().nullable(),
});
export type SessionUser = z.infer<typeof sessionUserSchema>;

/** Acesso à área interna. Deliberadamente trivial — é o ponto da decisão. */
export function canAccessInternalArea(user: Pick<SessionUser, 'membership'>): boolean {
  return user.membership === 'member';
}

/** Acesso a dado pessoal de candidatos. Nunca inferido de rank. */
export function canReviewApplications(
  user: Pick<SessionUser, 'membership' | 'isOfficer'>,
): boolean {
  return user.membership === 'member' && user.isOfficer;
}
