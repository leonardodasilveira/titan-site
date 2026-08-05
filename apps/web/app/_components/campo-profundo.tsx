interface CampoProfundoProps {
  className?: string;
  variante?: 'paisagem' | 'retrato';
}

/**
 * A1/A2 provisórios. O campo continua sob a fotografia final para preservar
 * atmosfera, contraste e dimensões quando o asset for substituído.
 */
export function CampoProfundo({ className = '', variante = 'paisagem' }: CampoProfundoProps) {
  const retrato = variante === 'retrato';

  return (
    <div
      aria-hidden="true"
      className={`bg-deep pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className={`absolute inset-0 ${
          retrato
            ? 'bg-[radial-gradient(ellipse_at_50%_72%,var(--color-deep-lit),transparent_62%)]'
            : 'bg-[radial-gradient(ellipse_at_72%_42%,var(--color-deep-lit),transparent_70%)]'
        }`}
      />
      <svg
        className="text-border absolute inset-0 size-full opacity-30"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id={`sondagem-${variante}`}
            width={retrato ? 150 : 210}
            height={retrato ? 130 : 170}
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M-30 128C30 48 95 36 188 82S278 190 185 218"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M-48 105C28 15 112 5 212 57S298 178 202 244"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M-70 84C18-20 128-31 235 31S322 174 216 267"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#sondagem-${variante})`} />
      </svg>
      <div
        className={`absolute inset-0 ${retrato ? 'bg-[linear-gradient(180deg,var(--color-bg)_82%,transparent_74%)]' : 'bg-[linear-gradient(100deg,var(--color-bg)_88%,color-mix(in_srgb,var(--color-bg)_55%,transparent)_42%,transparent_78%)]'}`}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_42%,transparent_0%,color-mix(in_srgb,var(--color-bg)_40%,transparent)_100%)]" />
    </div>
  );
}
