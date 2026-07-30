import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { ApiStatus, ApiStatusSkeleton } from './_components/api-status';

/**
 * Landing pública. Conteúdo herdado do site anterior (Wix).
 *
 * Deliberadamente NÃO inclui os nomes reais dos oficiais, que o site antigo
 * publicava — este repositório é público. Ver a seção de segredos no CLAUDE.md.
 *
 * Progresso de raid e roster ao vivo são TIT-12.
 */
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-14 px-6 py-16">
      <header>
        <Image
          src="/titan-inc-logo.png"
          alt="Titan Inc"
          width={264}
          height={109}
          priority
          className="h-auto w-[264px] max-w-full"
        />

        <p className="text-accent mt-8 font-mono text-xs tracking-widest uppercase">
          Ghosts of K&apos;aresh
        </p>

        <h1 className="text-fg mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Endgame sem abrir mão da vida real
        </h1>

        <p className="text-fg-muted mt-5 max-w-xl text-lg">
          Guilda de raid e Mythic+ desde 2009. Cinco horas de raid por semana, para gente com
          trabalho, família e faculdade — e ainda assim progredindo.
        </p>
      </header>

      <section aria-labelledby="raid-heading" className="grid gap-6 sm:grid-cols-2">
        <div className="border-border bg-surface rounded-lg border p-5">
          <h2
            id="raid-heading"
            className="text-fg-subtle font-mono text-xs tracking-widest uppercase"
          >
            Horário de raid
          </h2>
          <p className="text-fg mt-3 text-2xl font-medium">21:00 — 23:30</p>
          <p className="text-fg-muted mt-1">Terças e quintas</p>
        </div>

        <div className="border-border bg-surface rounded-lg border p-5">
          <h2 className="text-fg-subtle font-mono text-xs tracking-widest uppercase">
            O que esperamos
          </h2>
          <ul className="text-fg-muted mt-3 space-y-1.5">
            <li>Presença nos horários marcados</li>
            <li>
              Performance <span className="text-highlight font-medium">purple+</span> de parse
            </li>
          </ul>
        </div>
      </section>

      <section className="border-border border-t pt-8">
        <p className="text-fg-muted max-w-xl">
          Ambiente seguro e divertido, com gente de perfis bem diferentes. Se o horário bate com o
          seu, vale conversar.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <span className="border-accent-soft bg-accent-soft text-accent inline-block rounded-full border px-3 py-1 font-mono text-xs">
            formulário de apply em breve
          </span>
          <Link href="/entrar" className="text-fg-muted hover:text-fg text-sm underline">
            Já é membro? Entrar
          </Link>
        </div>
      </section>

      {/* Painel temporário de desenvolvimento — sai quando a landing estiver pronta. */}
      <section
        aria-labelledby="stack-heading"
        className="border-border bg-surface/50 mt-4 rounded-lg border border-dashed p-5"
      >
        <h2
          id="stack-heading"
          className="text-fg-subtle font-mono text-xs tracking-widest uppercase"
        >
          Verificação da stack (temporário)
        </h2>
        <div className="mt-4">
          <Suspense fallback={<ApiStatusSkeleton />}>
            <ApiStatus />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
