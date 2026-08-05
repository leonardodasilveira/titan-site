import { Hero } from './_components/hero';
import { Sobre } from './_components/sobre';
import { Rotulo } from './_components/ui/rotulo';

const secoes = [
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
      <Hero />
      <Sobre />
      {secoes.map((secao) => (
        <section
          key={secao.id}
          id={secao.id}
          aria-labelledby={secao.tituloId}
          className="mx-auto flex min-h-[40svh] w-full max-w-[1120px] flex-col justify-center px-6 py-24 md:px-8 lg:py-40 xl:px-12"
        >
          <Rotulo>{secao.rotulo}</Rotulo>
          <h2
            id={secao.tituloId}
            className="text-fg mt-6 max-w-[18ch] text-[30px] leading-[1.15] font-extrabold tracking-[-0.02em] text-balance lg:text-[40px]"
          >
            {secao.titulo}
          </h2>
          <p className="text-fg-muted mt-6 max-w-[48ch] text-[17px] leading-[1.6] text-pretty">
            A estrutura está aferida e pronta para receber a leitura completa desta seção.
          </p>
        </section>
      ))}
    </>
  );
}
