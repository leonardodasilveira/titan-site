import Image from 'next/image';
import { CampoProfundo } from './campo-profundo';
import { Instrumento } from './instrumento/instrumento';
import { Acao } from './ui/acao';
import { Rotulo } from './ui/rotulo';

async function progressaoDeDesenvolvimento() {
  if (process.env.NODE_ENV === 'production') return null;
  const { PROGRESSAO_MOCK_PARCIAL } = await import('../../lib/mock/progressao.mock');
  return PROGRESSAO_MOCK_PARCIAL;
}

export async function Hero() {
  const progressao = await progressaoDeDesenvolvimento();
  return (
    <section
      id="topo"
      aria-labelledby="hero-titulo"
      className="border-border bg-deep relative isolate min-h-[calc(100svh-3.5rem)] overflow-hidden border-b lg:max-h-[900px] lg:min-h-[calc(100svh-4rem)]"
    >
      <CampoProfundo variante="paisagem" className="hidden lg:block" />
      <CampoProfundo variante="retrato" className="lg:hidden" />
      <div className="relative mx-auto grid w-full max-w-[1440px] gap-10 px-5 pt-16 pb-10 md:px-8 md:pt-20 lg:max-h-[900px] lg:min-h-[calc(100svh-4rem)] lg:grid-cols-12 lg:items-center lg:gap-6 xl:px-12">
        <div className="relative z-10 lg:col-span-5 lg:col-start-1">
          <Image
            src="/titan-inc-logo.png"
            alt=""
            width={264}
            height={109}
            priority
            className="mb-12 hidden h-auto w-[180px] lg:block"
          />
          <Rotulo>{progressao ? 'Season 1 · 12.0' : 'Titan Inc · Desde 2009'}</Rotulo>
          <h1
            id="hero-titulo"
            className="text-fg mt-6 text-[clamp(2rem,9vw,2.5rem)] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance md:text-[40px] lg:text-[54px] xl:text-[72px]"
          >
            Endgame sem abrir mão da vida real
          </h1>
          <p className="text-fg-muted mt-6 max-w-[46ch] text-[17px] leading-[1.6] text-pretty">
            Guilda de raid e Mythic+ desde 2009. Cinco horas por semana, para gente com trabalho,
            família e faculdade — e ainda assim progredindo.
          </p>
          <Acao href="#candidatura" variante="solida" className="mt-8 w-full md:w-auto">
            Candidatar-se
          </Acao>
        </div>
        <div className="relative z-20 row-start-1 mx-auto w-[240px] max-w-full min-[360px]:w-[260px] min-[390px]:w-[280px] min-[430px]:w-[300px] md:w-[340px] lg:col-span-6 lg:col-start-7 lg:row-auto lg:w-[380px] xl:w-[440px] xl:translate-x-14">
          {progressao && (
            <div
              role="note"
              className="text-highlight absolute -top-7 left-0 font-mono text-[10px] tracking-[0.14em] uppercase"
            >
              Dados de desenvolvimento
            </div>
          )}
          <Instrumento report={progressao} />
        </div>
        <p className="text-fg-subtle text-[13px] lg:absolute lg:bottom-8 lg:left-12">
          Aferição pública preparada para Warcraft Logs · fonte pendente
        </p>
      </div>
    </section>
  );
}
