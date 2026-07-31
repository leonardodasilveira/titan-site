'use client';

import { useMemo, useState } from 'react';
import type { RosterEntry } from '@titan/shared';

type Coluna = 'personagem' | 'wowClass' | 'role' | 'itemLevel' | 'mythicPlusScore';
type Direcao = 'asc' | 'desc';

const COLUNAS: Array<{
  chave: Coluna;
  rotulo: string;
  numerica: boolean;
  /** Direção ao clicar pela primeira vez: número começa do maior. */
  inicial: Direcao;
}> = [
  { chave: 'personagem', rotulo: 'Personagem', numerica: false, inicial: 'asc' },
  { chave: 'wowClass', rotulo: 'Classe', numerica: false, inicial: 'asc' },
  { chave: 'role', rotulo: 'Função', numerica: false, inicial: 'asc' },
  { chave: 'itemLevel', rotulo: 'ilvl', numerica: true, inicial: 'desc' },
  { chave: 'mythicPlusScore', rotulo: 'M+', numerica: true, inicial: 'desc' },
];

/**
 * Score sempre com **uma casa decimal**.
 *
 * Sem o mínimo, `toLocaleString` omite a casa de quem tem score inteiro e a
 * coluna fica torta: "3.412,1" ao lado de "3.314". Como os números são
 * comparados de bater o olho, alinhamento importa mais que economizar dígito.
 */
function formatarScore(valor: number | null): string {
  if (valor === null) return '—';
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function formatarIlvl(valor: number | null): string {
  return valor === null ? '—' : String(valor);
}

/** Texto de ordenação de uma linha, por coluna. */
function textoDe(c: RosterEntry, chave: Coluna): string {
  if (chave === 'personagem') return `${c.name}-${c.realm}`;
  if (chave === 'wowClass') return c.wowClass;
  return c.role;
}

export function RosterTable({ characters }: { characters: RosterEntry[] }) {
  const [coluna, setColuna] = useState<Coluna>('itemLevel');
  const [direcao, setDirecao] = useState<Direcao>('desc');

  const ordenados = useMemo(() => {
    const def = COLUNAS.find((c) => c.chave === coluna);
    const fator = direcao === 'asc' ? 1 : -1;

    return [...characters].sort((a, b) => {
      if (def?.numerica) {
        const va = a[coluna as 'itemLevel' | 'mythicPlusScore'];
        const vb = b[coluna as 'itemLevel' | 'mythicPlusScore'];

        // Sem dado vai SEMPRE para o fim, nos dois sentidos. Tratar null como
        // zero colocaria quem não tem perfil no Raider.IO em último como se
        // tivesse gear ruim — e é com essa lista que se decide rotação.
        if (va === null && vb === null) return 0;
        if (va === null) return 1;
        if (vb === null) return -1;

        return (va - vb) * fator;
      }

      return textoDe(a, coluna).localeCompare(textoDe(b, coluna), 'pt-BR') * fator;
    });
  }, [characters, coluna, direcao]);

  function ordenarPor(chave: Coluna) {
    if (chave === coluna) {
      setDirecao((d) => (d === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setColuna(chave);
    setDirecao(COLUNAS.find((c) => c.chave === chave)?.inicial ?? 'asc');
  }

  return (
    <div className="border-border overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[34rem] text-sm">
        <thead className="border-border text-fg-subtle border-b">
          <tr>
            {COLUNAS.map((c) => {
              const ativa = c.chave === coluna;

              return (
                <th
                  key={c.chave}
                  scope="col"
                  // aria-sort é o que faz leitor de tela anunciar a ordenação.
                  aria-sort={ativa ? (direcao === 'asc' ? 'ascending' : 'descending') : 'none'}
                  className={c.numerica ? 'text-right' : 'text-left'}
                >
                  <button
                    type="button"
                    onClick={() => ordenarPor(c.chave)}
                    className={`hover:text-fg w-full px-4 py-3 font-medium transition-colors ${
                      c.numerica ? 'text-right' : 'text-left'
                    } ${ativa ? 'text-fg' : ''}`}
                  >
                    {c.rotulo}
                    <span aria-hidden="true" className="text-fg-subtle ml-1.5 font-mono text-xs">
                      {ativa ? (direcao === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {ordenados.map((c) => (
            // Nome + realm é a identidade — nome sozinho colide. Ver Regra 6.
            <tr key={`${c.realm}/${c.name}`} className="border-border/60 border-b last:border-0">
              <td className="text-fg px-4 py-2.5 font-mono">
                {c.name}
                <span className="text-fg-subtle">-{c.realm}</span>
              </td>
              <td className="text-fg-muted px-4 py-2.5">{c.wowClass}</td>
              <td className="text-fg-muted px-4 py-2.5">{c.role}</td>
              <td className="text-fg px-4 py-2.5 text-right font-mono tabular-nums">
                {formatarIlvl(c.itemLevel)}
              </td>
              <td className="text-fg px-4 py-2.5 text-right font-mono tabular-nums">
                {formatarScore(c.mythicPlusScore)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
