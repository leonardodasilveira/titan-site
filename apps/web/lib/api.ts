import 'server-only';

import { sessionUserSchema, type SessionUser } from '@titan/shared';
import { cookies } from 'next/headers';
import { API_URL, SESSION_COOKIE } from './config';

/**
 * Chamadas à API que dependem do cookie de sessão.
 *
 * `server-only` no topo: se um client component importar isto, o build falha com
 * mensagem clara em vez do erro confuso de `next/headers` no bundle do browser.
 * Valores seguros no cliente ficam em ./config.
 */

/**
 * Repassa o cookie de sessão para a API.
 *
 * Necessário porque o fetch de Server Component não herda os cookies do browser
 * automaticamente — sem isso a API vê todo request como deslogado.
 */
async function sessionHeader(): Promise<HeadersInit> {
  const store = await cookies();
  const session = store.get(SESSION_COOKIE)?.value;
  return session ? { Cookie: `${SESSION_COOKIE}=${session}` } : {};
}

/**
 * Usuário da sessão atual, ou null se não houver.
 *
 * Não lança em 401: "deslogado" é estado esperado, não erro.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: await sessionHeader(),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;

    const parsed = sessionUserSchema.safeParse(await res.json());
    return parsed.success ? parsed.data : null;
  } catch {
    // API fora do ar. Tratar como deslogado é melhor que quebrar a página.
    return null;
  }
}

export interface InternalSummary {
  greeting: string;
  matchedCharacter: SessionUser['matchedCharacter'];
  guildRank: number | null;
  canReviewApplications: boolean;
}

/** Dados da área interna. Null se a API recusar (401/403). */
export async function getInternalSummary(): Promise<InternalSummary | null> {
  try {
    const res = await fetch(`${API_URL}/internal/summary`, {
      headers: await sessionHeader(),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;
    return (await res.json()) as InternalSummary;
  } catch {
    return null;
  }
}
