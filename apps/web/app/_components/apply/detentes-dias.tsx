'use client';
const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export function DetentesDias() {
  return (
    <fieldset>
      <legend className="text-fg-subtle font-mono text-[11px] tracking-[0.14em] uppercase">
        Dias disponíveis
      </legend>
      <div className="mt-3 grid grid-cols-7 gap-2">
        {dias.map((dia, indice) => (
          <label
            key={dia}
            className="text-fg-muted relative flex min-h-11 cursor-pointer flex-col items-center justify-center font-mono text-[11px]"
          >
            <input
              type="checkbox"
              name="availableDays"
              value={indice}
              aria-label={dia}
              className="peer focus-visible:outline-accent absolute inset-0 appearance-none rounded-[3px] focus-visible:outline-2"
            />
            <span
              aria-hidden
              className="bg-border peer-checked:bg-accent h-2 w-px transition-all peer-checked:h-4"
            />
            <span aria-hidden className="mt-1">
              {dia.slice(0, 1)}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
