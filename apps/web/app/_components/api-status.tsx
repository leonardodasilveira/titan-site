import { connection } from 'next/server';
import { healthSchema, type Health } from '@titan/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type Result = { ok: true; health: Health } | { ok: false; reason: string };

async function loadHealth(): Promise<Result> {
  // Interrompe o prerender: sem isso o Next executa este fetch durante o
  // `next build` (quando a API não está rodando) e assa "API offline" no HTML
  // estático — o painel mentiria para sempre em produção.
  await connection();

  try {
    // No Next 16, fetch NÃO é cacheado por padrão e bloqueia o render — por
    // isso este componente vive dentro de um <Suspense> na página. Status de
    // saúde tem que ser sempre fresco, então nada de `use cache` aqui.
    const res = await fetch(`${API_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return { ok: false, reason: `A API respondeu ${res.status}` };
    }

    // Valida com o MESMO schema que o Nest usa para tipar a resposta.
    // Se o back mudar o contrato, quebra aqui em vez de renderizar undefined.
    const parsed = healthSchema.safeParse(await res.json());
    if (!parsed.success) {
      return { ok: false, reason: 'A resposta não bate com o contrato do shared' };
    }

    return { ok: true, health: parsed.data };
  } catch {
    return { ok: false, reason: `Sem resposta em ${API_URL} — a API está rodando?` };
  }
}

export async function ApiStatus() {
  const result = await loadHealth();

  if (!result.ok) {
    return (
      <div className="flex items-start gap-3">
        <span aria-hidden className="bg-danger mt-1.5 size-2 shrink-0 rounded-full" />
        <div>
          <p className="text-fg font-medium">API offline</p>
          <p className="text-fg-muted mt-0.5 text-sm">{result.reason}</p>
          <p className="text-fg-subtle mt-2 font-mono text-xs">pnpm dev:api</p>
        </div>
      </div>
    );
  }

  const { health } = result;

  return (
    <div className="flex items-start gap-3">
      <span aria-hidden className="bg-ok mt-1.5 size-2 shrink-0 rounded-full" />
      <div>
        <p className="text-fg font-medium">API conectada</p>
        <dl className="text-fg-muted mt-1 space-y-0.5 font-mono text-sm">
          <div className="flex gap-2">
            <dt className="text-fg-subtle">serviço</dt>
            <dd>{health.service}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-fg-subtle">uptime</dt>
            <dd>{health.uptimeSeconds}s</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function ApiStatusSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className="bg-fg-subtle mt-1.5 size-2 shrink-0 animate-pulse rounded-full"
      />
      <p className="text-fg-muted">Consultando a API…</p>
    </div>
  );
}
