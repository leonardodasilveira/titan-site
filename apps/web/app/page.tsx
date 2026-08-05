import { Hero } from './_components/hero';
import { Roster } from './_components/roster/roster';
import { Sobre } from './_components/sobre';
import { Rotulo } from './_components/ui/rotulo';

export default function Home() {
  return (
    <>
      <Hero />
      <Sobre />
      <Roster />
      <section
        id="candidatura"
        aria-labelledby="candidatura-titulo"
        className="mx-auto flex min-h-[40svh] w-full max-w-[1120px] flex-col justify-center px-6 py-24 md:px-8 lg:py-40 xl:px-12"
      >
        <Rotulo>Candidatura</Rotulo>
        <h2
          id="candidatura-titulo"
          className="text-fg mt-6 text-[30px] font-extrabold lg:text-[40px]"
        >
          Entrar para o registro
        </h2>
        <p className="text-fg-muted mt-6">A entrada no registro será aferida na próxima etapa.</p>
      </section>
    </>
  );
}
