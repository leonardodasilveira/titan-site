import { redirect } from 'next/navigation';
import { getRoster, getSessionUser } from '../../../lib/api';

export const metadata = { title: 'Roster — Titan Inc' };

/** Número grande fica legível; ausência de dado nunca vira zero. */
function num(valor: number | null, casas = 0): string {
  return valor === null ? '—' : valor.toLocaleString('pt-BR', { maximumFractionDigits: casas });
}

/**
 * Roster do time de raid.
 *
 * A lista vem do WoWAudit, curada à mão pelo raid leader — não do rank da
 * guilda. Rank alto não quer dizer que a pessoa está raidando, e o time
 * atravessa 6 realms, então filtrar o roster da guilda nunca daria esta lista.
 */
export default async function RosterPage() {
  const user = await getSessionUser();
  if (!user) redirect('/entrar');
  if (!user.hasInternalAccess) redirect('/interno');

  const roster = await getRoster();

  return (
    <main className="flex flex-1 flex-col gap-6">
      <div>
        <p className="text-highlight font-mono text-xs tracking-widest uppercase">Time de raid</p>
        <h1 className="text-fg mt-2 text-2xl font-semibold tracking-tight">Roster</h1>
        <p className="text-fg-muted mt-2 text-sm">
          Quem está no time hoje, segundo o WoWAudit. Item level e score de M+ vêm do Raider.IO.
        </p>
      </div>

      {roster === null ? (
        <p className="border-border text-fg-muted rounded-lg border border-dashed p-5 text-sm">
          Não foi possível carregar o roster agora. Tente recarregar em alguns instantes.
        </p>
      ) : (
        <>
          {roster.enrichmentFailed && (
            <p className="border-border bg-surface text-fg-muted rounded-lg border p-4 text-sm">
              O Raider.IO não respondeu, então item level e score estão faltando. O time abaixo está
              correto.
            </p>
          )}

          <div className="border-border overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[34rem] text-sm">
              <thead className="border-border text-fg-subtle border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Personagem</th>
                  <th className="px-4 py-3 text-left font-medium">Classe</th>
                  <th className="px-4 py-3 text-left font-medium">Função</th>
                  <th className="px-4 py-3 text-right font-medium">ilvl</th>
                  <th className="px-4 py-3 text-right font-medium">M+</th>
                </tr>
              </thead>
              <tbody>
                {roster.characters.map((c) => (
                  // Nome + realm é a identidade — nome sozinho colide. Ver Regra 6.
                  <tr
                    key={`${c.realm}/${c.name}`}
                    className="border-border/60 border-b last:border-0"
                  >
                    <td className="text-fg px-4 py-2.5 font-mono">
                      {c.name}
                      <span className="text-fg-subtle">-{c.realm}</span>
                    </td>
                    <td className="text-fg-muted px-4 py-2.5">{c.wowClass}</td>
                    <td className="text-fg-muted px-4 py-2.5">{c.role}</td>
                    <td className="text-fg px-4 py-2.5 text-right font-mono">{num(c.itemLevel)}</td>
                    <td className="text-fg px-4 py-2.5 text-right font-mono">
                      {num(c.mythicPlusScore, 1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-fg-subtle text-xs">
            {roster.characters.length} personagens · atualizado em{' '}
            {new Date(roster.fetchedAt).toLocaleString('pt-BR')}
          </p>
        </>
      )}
    </main>
  );
}
