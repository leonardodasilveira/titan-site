import type { TripulanteMock } from '../../../lib/mock/roster.mock';
import { RetratoEditorial } from './retrato-editorial';

function numero(valor: number | null, casas: number) {
  return valor === null
    ? '—'
    : valor.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
}

export function PlacaTripulante({ tripulante }: { tripulante: TripulanteMock }) {
  return (
    <article className="chapa group border-l-accent bg-surface flex h-[340px] flex-col overflow-hidden border-l-2 md:h-[300px] lg:h-[320px] xl:h-[340px]">
      <div className="bg-deep min-h-0 flex-1 overflow-hidden">
        <RetratoEditorial
          name={tripulante.name}
          realm={tripulante.realm}
          className="size-full object-cover"
        />
      </div>
      <div className="border-border border-t px-4 py-3">
        <p title={tripulante.name} className="text-fg truncate text-[17px] font-bold">
          {tripulante.name}
        </p>
        <p className="text-fg-subtle font-mono text-[11px]">{tripulante.realm}</p>
        <p className="text-fg-muted mt-1 truncate font-mono text-[11px]">
          {tripulante.wowClass} · {tripulante.spec}
        </p>
      </div>
      <div className="border-border text-fg-muted group-hover:text-fg grid grid-cols-2 border-t px-4 py-2 font-mono text-[11px] tabular-nums">
        <span>{numero(tripulante.itemLevel, 2)}</span>
        <span className="text-right">{numero(tripulante.mythicPlusScore, 1)}</span>
      </div>
    </article>
  );
}
