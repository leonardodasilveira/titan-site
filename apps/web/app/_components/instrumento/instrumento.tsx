import type { RaidProgressReport } from '@titan/shared';
import { Detentes } from './detentes';
import { Disco } from './disco';
import { escolherDificuldade, escolherRaid, lerBoss } from './geometria';

export function Instrumento({ report }: { report: RaidProgressReport | null }) {
  const dificuldade = report ? escolherDificuldade(report) : -1;
  const raid = report && dificuldade >= 0 ? escolherRaid(report, dificuldade) : null;
  const bosses = raid?.bosses ?? [];
  const mortos = bosses.filter((boss) => lerBoss(boss, dificuldade).morto).length;
  const padrao = Math.max(0, mortos - 1);
  if (!raid || !bosses.length)
    return (
      <div className="relative aspect-square w-full">
        <Disco bosses={[]} dificuldade={-1} selecionado={-1} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-fg text-[54px] font-extrabold tabular-nums">—/—</p>
          <p className="text-accent font-mono text-[11px] tracking-[0.14em] uppercase">
            Sem leitura
          </p>
        </div>
      </div>
    );
  return (
    <div className="relative aspect-square w-full pb-[108px] md:pb-32">
      <div className="relative aspect-square">
        <Disco bosses={bosses} dificuldade={dificuldade} selecionado={padrao} />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-16">
          <p className="text-fg text-[54px] font-extrabold tabular-nums">
            {mortos}/{bosses.length}
          </p>
          <p className="text-accent font-mono text-[11px] tracking-[0.14em] uppercase">Mítico</p>
        </div>
        <Detentes bosses={bosses} dificuldade={dificuldade} padrao={padrao} />
      </div>
      <p className="sr-only">
        Progressão da guilda em {raid.name}, dificuldade Mítico: {mortos} de {bosses.length} bosses
        vencidos.
      </p>
    </div>
  );
}
