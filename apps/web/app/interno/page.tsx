import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getInternalSummary, getSessionUser } from '../../lib/api';
import { API_URL } from '../../lib/config';
import { LogoutButton } from './_components/logout-button';

export const metadata = { title: 'Área de membros — Titan Inc' };

/**
 * Área interna.
 *
 * Três estados, não dois. O do meio — logado mas sem personagem no roster — é o
 * mais comum na vida real (candidato que acabou de aplicar, ou pessoa que logou
 * com a conta Battle.net errada) e é o que costuma ser esquecido.
 */
export default async function InternoPage() {
  const user = await getSessionUser();

  // Estado 1: sem sessão.
  if (!user) redirect('/entrar');

  // Estado 2: logado, mas não é da guilda.
  if (user.membership !== 'member') {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-6 py-16">
        <div>
          <p className="text-highlight font-mono text-xs tracking-widest uppercase">
            Acesso não liberado
          </p>
          <h1 className="text-fg mt-3 text-3xl font-semibold tracking-tight">
            Você entrou, mas não achamos seu personagem
          </h1>
        </div>

        <p className="text-fg-muted">
          Sua conta Battle.net (<span className="font-mono">{user.battletag}</span>) não tem nenhum
          personagem no roster da <strong>Titan Inc</strong>.
        </p>

        <div className="border-border bg-surface space-y-3 rounded-lg border p-5 text-sm">
          <p className="text-fg font-medium">Se você acha que isso está errado:</p>
          <ul className="text-fg-muted list-disc space-y-1.5 pl-5">
            <li>Entrou na guilda agora? O roster da Blizzard leva algumas horas para atualizar.</li>
            <li>Tem mais de uma conta Battle.net? Talvez tenha entrado com a outra.</li>
            <li>Seu personagem está em outra região? A guilda é da região US.</li>
          </ul>
        </div>

        <p className="text-fg-muted">
          Ainda não é membro?{' '}
          <Link href="/" className="text-accent underline">
            Veja como se candidatar
          </Link>
          .
        </p>

        <div className="border-border flex flex-wrap items-center gap-4 border-t pt-5">
          {/* trocar=1 força a Blizzard a pedir credenciais. Sem isso, sair daqui
              e entrar de novo reusa a MESMA conta em silêncio, porque nosso
              logout não encerra a sessão da Blizzard. */}
          <a
            href={`${API_URL}/auth/battlenet?trocar=1`}
            className="bg-accent hover:bg-accent/90 rounded-md px-4 py-2 text-sm font-medium text-[#0b0d12] transition-colors"
          >
            Entrar com outra conta Battle.net
          </a>
          <LogoutButton />
        </div>
      </main>
    );
  }

  // Estado 3: membro verificado.
  const summary = await getInternalSummary();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-14">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-accent font-mono text-xs tracking-widest uppercase">Área de membros</p>
          <h1 className="text-fg mt-2 text-3xl font-semibold tracking-tight">
            {summary?.greeting ?? `Bem-vindo, ${user.battletag}`}
          </h1>
        </div>
        <LogoutButton />
      </header>

      <section className="border-border bg-surface rounded-lg border p-5">
        <h2 className="text-fg-subtle font-mono text-xs tracking-widest uppercase">
          Sua verificação
        </h2>
        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-fg-subtle">Conta</dt>
            <dd className="text-fg font-mono">{user.battletag}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-subtle">Personagem no roster</dt>
            <dd className="text-fg font-mono">
              {user.matchedCharacter
                ? `${user.matchedCharacter.name}-${user.matchedCharacter.realm}`
                : '—'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-subtle">Rank na guilda</dt>
            <dd className="text-fg font-mono">{user.guildRank ?? '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-subtle">Verificado em</dt>
            <dd className="text-fg-muted font-mono">
              {user.verifiedAt ? new Date(user.verifiedAt).toLocaleString('pt-BR') : '—'}
            </dd>
          </div>
        </dl>

        <p className="text-fg-subtle border-border mt-4 border-t pt-4 text-xs">
          O rank é registrado mas não define permissão — acesso é igual para todo membro. Ver
          TIT-19.
        </p>
      </section>

      <section className="border-border rounded-lg border border-dashed p-5">
        <h2 className="text-fg-subtle font-mono text-xs tracking-widest uppercase">A definir</h2>
        <p className="text-fg-muted mt-3">
          As ferramentas de guild management ainda não foram escolhidas. O levantamento é a TIT-21 —
          a ideia é construir o que hoje é manual ou se perde, não o que um addon já resolve bem.
        </p>
        {summary?.canReviewApplications && (
          <p className="text-accent mt-3 text-sm">
            Sua conta tem permissão de oficial: o painel de candidaturas aparecerá aqui.
          </p>
        )}
      </section>
    </main>
  );
}
