import { Rotulo } from './_components/ui/rotulo';

const secoes = [
  {
    id: 'topo',
    tituloId: 'hero-titulo',
    rotulo: 'Titan Inc',
    titulo: 'Endgame sem abrir mão da vida real',
  },
  {
    id: 'sobre',
    tituloId: 'sobre-titulo',
    rotulo: 'Sobre',
    titulo: 'Cinco horas por semana, desde 2009',
  },
  {
    id: 'tripulacao',
    tituloId: 'tripulacao-titulo',
    rotulo: 'Tripulação',
    titulo: 'O time de raid',
  },
  {
    id: 'candidatura',
    tituloId: 'candidatura-titulo',
    rotulo: 'Candidatura',
    titulo: 'Entrar para o registro',
  },
] as const;

export default function Home() {
  return (
    <>
      {secoes.map((secao, indice) => (
        <section
          key={secao.id}
          id={secao.id}
          aria-labelledby={secao.tituloId}
          className="mx-auto flex min-h-[40svh] w-full max-w-[1120px] flex-col justify-center px-6 py-24 md:px-8 lg:py-40 xl:px-12"
        >
          <Rotulo>{secao.rotulo}</Rotulo>
          <h1
            id={secao.tituloId}
            className={`${indice === 0 ? 'text-[40px] lg:text-[54px] xl:text-[72px]' : 'text-[30px] lg:text-[40px]'} text-fg mt-6 max-w-[18ch] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance`}
          >
            {secao.titulo}
          </h1>
          <p className="text-fg-muted mt-6 max-w-[48ch] text-[17px] leading-[1.6] text-pretty">
            A estrutura está aferida e pronta para receber a leitura completa desta seção.
          </p>
        </section>
      ))}
    </>
  );
}
