function hash(texto: string) {
  return [...texto].reduce((valor, caractere) => (valor * 31 + caractere.charCodeAt(0)) | 0, 7);
}

export function RetratoEditorial({
  name,
  realm,
  className = '',
}: {
  name: string;
  realm: string;
  className?: string;
}) {
  const variacao = hash(`${realm}/${name}`) % 12;
  return (
    <svg
      viewBox="0 0 300 400"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`retrato-${variacao}`} cx="38%" cy="28%">
          <stop offset="0" stopColor="var(--color-deep-lit)" />
          <stop offset="80%" stopColor="var(--color-deep)" />
        </radialGradient>
      </defs>
      <rect width="300" height="400" fill={`url(#retrato-${variacao})`} />
      <path
        d={`M ${-30 + variacao} 340 Q 150 ${210 + variacao} ${330 - variacao} 340`}
        fill="none"
        stroke="var(--color-accent)"
        strokeOpacity=".42"
      />
      <text
        x="150"
        y="205"
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--color-fg-subtle)"
        fillOpacity=".4"
        fontSize="74"
        fontWeight="800"
      >
        {name.slice(0, 1).toLocaleUpperCase('pt-BR')}
      </text>
    </svg>
  );
}
