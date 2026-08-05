import { Rotulo } from '../ui/rotulo';
import { ApplyForm } from './apply-form';
export function Apply() {
  return (
    <section
      id="candidatura"
      aria-labelledby="candidatura-titulo"
      className="px-6 py-24 md:px-8 lg:py-40 xl:px-12"
    >
      <div className="mx-auto max-w-[1120px]">
        <div className="max-w-[560px]">
          <Rotulo>Candidatura</Rotulo>
          <h2
            id="candidatura-titulo"
            className="text-fg mt-6 text-[30px] leading-[1.15] font-extrabold text-balance lg:text-[40px]"
          >
            Entrar para o registro
          </h2>
          <p className="text-fg-muted mt-6 text-[17px] leading-[1.6] text-pretty">
            Se o horário bate com o seu, vale conversar. Isto é o que perguntamos — responda com
            calma.
          </p>
          <ApplyForm />
        </div>
      </div>
    </section>
  );
}
