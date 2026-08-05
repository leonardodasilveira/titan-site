'use client';

import type { BossProgress } from '@titan/shared';
import { useState } from 'react';
import { Chapa } from '../ui/chapa';
import { anguloDetente, lerBoss, polar } from './geometria';

export function Detentes({
  bosses,
  dificuldade,
  padrao,
}: {
  bosses: BossProgress[];
  dificuldade: number;
  padrao: number;
}) {
  const [fixo, setFixo] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const indice = fixo ?? hover ?? padrao;
  const boss = bosses[indice];
  const leitura = boss ? lerBoss(boss, dificuldade) : null;
  function teclado(evento: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    if (evento.key === 'Escape') {
      setFixo(null);
      setHover(padrao);
      return;
    }
    if (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowRight') return;
    evento.preventDefault();
    const proximo = (i + (evento.key === 'ArrowRight' ? 1 : -1) + bosses.length) % bosses.length;
    evento.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('button')
      [proximo]?.focus();
  }
  return (
    <>
      <div role="group" aria-label="Bosses da raid" className="absolute inset-0">
        {bosses.map((item, i) => {
          const ponto = polar(anguloDetente(i, bosses.length), 158);
          const linha = lerBoss(item, dificuldade);
          const estado = linha.morto
            ? `Vencido${linha.primeiraKill ? ` em ${new Date(linha.primeiraKill).toLocaleDateString('pt-BR')}` : ''}, ${linha.pulls} pulls.`
            : `Não vencido. ${linha.melhorPercentual === null ? 'Sem wipe registrado' : `Melhor tentativa: ${linha.melhorPercentual.toLocaleString('pt-BR')}% de vida restante`}, ${linha.pulls} pulls.`;
          return (
            <button
              key={item.encounterId}
              type="button"
              aria-label={`Boss ${i + 1} de ${bosses.length}: ${item.name}. ${estado}`}
              aria-pressed={fixo === i}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setFixo((atual) => (atual === i ? null : i))}
              onKeyDown={(evento) => teclado(evento, i)}
              className="focus-visible:outline-accent absolute size-11 -translate-1/2 rounded-full focus-visible:outline-2"
              style={{ left: `${ponto.x / 4}%`, top: `${ponto.y / 4}%` }}
            />
          );
        })}
      </div>
      <Chapa className="absolute right-0 bottom-0 left-0 h-[108px] p-4 md:h-32 md:p-5">
        <div aria-live="polite">
          {boss && leitura ? (
            <>
              <p className="text-fg line-clamp-2 text-[22px] font-bold">{boss.name}</p>
              <p
                className={`mt-2 font-mono text-[11px] tracking-[0.14em] uppercase ${leitura.morto ? 'text-accent' : 'text-highlight'}`}
              >
                {leitura.morto
                  ? leitura.primeiraKill
                    ? `Morto em ${new Date(leitura.primeiraKill).toLocaleDateString('pt-BR')}`
                    : 'Morto'
                  : leitura.melhorPercentual === null
                    ? 'Sem wipe registrado'
                    : `Melhor ${leitura.melhorPercentual.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%`}
              </p>
              <p className="text-fg-subtle mt-1 font-mono text-[11px]">{leitura.pulls} pulls</p>
            </>
          ) : (
            <p className="text-fg-muted">A aferição não respondeu.</p>
          )}
        </div>
      </Chapa>
    </>
  );
}
