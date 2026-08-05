import type { CSSProperties, ElementType } from 'react';

interface WordmarkProps {
  as?: ElementType;
  className?: string;
  tamanho?: 'mobile' | 'nav' | 'footer';
}

const TAMANHOS = {
  mobile: 'text-[18px]',
  nav: 'text-[22px]',
  footer: 'text-[34px]',
} as const;

/** Ponto único de troca do wordmark provisório pelo SVG final A3. */
export function Wordmark({
  as: Componente = 'span',
  className = '',
  tamanho = 'nav',
}: WordmarkProps) {
  const estilo = { fontStretch: '112%' } as CSSProperties;

  return (
    <Componente
      aria-label="Titan Inc"
      className={`after:bg-edge relative inline-flex pb-1 font-sans font-extrabold tracking-[-0.02em] text-current after:absolute after:inset-x-0 after:bottom-0 after:h-px ${TAMANHOS[tamanho]} ${className}`}
      style={estilo}
    >
      <span aria-hidden="true">TITAN</span>
      <span aria-hidden="true" className="text-accent ml-[0.06em]">
        INC
      </span>
    </Componente>
  );
}
