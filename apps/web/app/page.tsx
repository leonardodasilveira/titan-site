import { Suspense } from 'react';
import { CLASSES, ROLES } from '@titan/shared';
import { ApiStatus, ApiStatusSkeleton } from './_components/api-status';

/**
 * Placeholder da landing. Existe para validar a cadeia
 * front → API → schema compartilhado rodando de verdade no browser.
 *
 * O conteúdo real (hero, progresso de raid, roster) é TIT-11 e TIT-12.
 */
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-12 px-6 py-16">
      <header>
        <p className="text-accent font-mono text-xs tracking-widest uppercase">World of Warcraft</p>
        <h1 className="text-fg mt-3 text-5xl font-semibold tracking-tight">Titan Inc</h1>
        <p className="text-fg-muted mt-4 max-w-xl text-lg">
          Guilda de raid e Mythic+. Este site está em construção — a apresentação da guilda e o
          formulário de apply vêm nos próximos milestones.
        </p>

        <span className="border-accent-soft bg-accent-soft text-accent mt-6 inline-block rounded-full border px-3 py-1 font-mono text-xs">
          recrutamento em breve
        </span>
      </header>

      <section
        aria-labelledby="stack-heading"
        className="border-border bg-surface rounded-lg border p-6"
      >
        <h2
          id="stack-heading"
          className="text-fg-subtle font-mono text-xs tracking-widest uppercase"
        >
          Verificação da stack
        </h2>

        <div className="mt-5 space-y-5">
          <Suspense fallback={<ApiStatusSkeleton />}>
            <ApiStatus />
          </Suspense>

          <div className="border-border border-t pt-5">
            <div className="flex items-start gap-3">
              <span aria-hidden className="bg-ok mt-1.5 size-2 shrink-0 rounded-full" />
              <div>
                <p className="text-fg font-medium">Pacote compartilhado carregado</p>
                <p className="text-fg-muted mt-1 font-mono text-sm">
                  {CLASSES.length} classes · {ROLES.length} roles
                </p>
                <p className="text-fg-subtle mt-1 text-sm">
                  Estes valores vêm de <code className="font-mono">@titan/shared</code>, o mesmo
                  módulo que o Nest usa para validar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-fg-subtle text-sm">
        <p>
          Planejamento no Linear · projeto <span className="font-mono">Site da Guilda</span>
        </p>
      </footer>
    </main>
  );
}
