import type { BossProgress } from '@titan/shared';
import { anguloDetente, lerBoss, polar } from './geometria';

export function Disco({
  bosses,
  dificuldade,
  selecionado,
}: {
  bosses: BossProgress[];
  dificuldade: number;
  selecionado: number;
}) {
  const leituras = bosses.map((boss) => lerBoss(boss, dificuldade));
  const mortos = leituras.filter((leitura) => leitura.morto).length;
  const anguloAgulha = mortos ? anguloDetente(Math.max(0, mortos - 1), bosses.length) : -143;
  const ponta = polar(anguloAgulha, 118);
  return (
    <svg viewBox="0 0 400 400" className="size-full" aria-hidden="true">
      <defs>
        <radialGradient id="mostrador" cx="38%" cy="28%">
          <stop offset="0" stopColor="var(--color-deep-lit)" />
          <stop offset="72%" stopColor="var(--color-deep)" />
        </radialGradient>
        <path id="arco-texto" d="M 58 200 A 142 142 0 0 1 342 200" />
      </defs>
      <circle cx="200" cy="200" r="190" fill="none" stroke="var(--color-border)" />
      <circle cx="200" cy="200" r="176" fill="url(#mostrador)" stroke="var(--color-edge)" />
      {bosses.map((boss, indice) => {
        const leitura = leituras[indice];
        const angulo = anguloDetente(indice, bosses.length);
        const de = polar(angulo, leitura.morto ? 138 : 148);
        const ate = polar(angulo, 160);
        const lampada = polar(angulo, 168);
        return (
          <g key={boss.encounterId}>
            <line
              x1={de.x}
              y1={de.y}
              x2={ate.x}
              y2={ate.y}
              stroke={leitura.morto ? 'var(--color-accent)' : 'var(--color-border)'}
              strokeWidth={leitura.morto ? 2 : 1}
            />
            {leitura.morto && (
              <circle cx={lampada.x} cy={lampada.y} r="4" fill="var(--color-accent)" />
            )}
            {selecionado === indice && (
              <circle cx={lampada.x} cy={lampada.y} r="7" fill="none" stroke="var(--color-fg)" />
            )}
          </g>
        );
      })}
      <line
        data-assentamento="agulha"
        x1="200"
        y1="200"
        x2={ponta.x}
        y2={ponta.y}
        stroke="var(--color-accent)"
        strokeWidth="2"
        className="origin-[200px_200px]"
      />
      <circle cx="200" cy="200" r="16" fill="var(--color-surface)" stroke="var(--color-edge)" />
    </svg>
  );
}
