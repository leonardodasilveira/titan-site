'use client';
import { CLASSES, ROLES, createApplicationSchema } from '@titan/shared';
import { useState } from 'react';
import { Acao } from '../ui/acao';
import { Chapa } from '../ui/chapa';
import { Campo } from './campo';
import { DetentesDias } from './detentes-dias';

const classePt: Record<string, string> = {
  warrior: 'Guerreiro',
  paladin: 'Paladino',
  hunter: 'Caçador',
  rogue: 'Ladino',
  priest: 'Sacerdote',
  'death-knight': 'Cavaleiro da Morte',
  shaman: 'Xamã',
  mage: 'Mago',
  warlock: 'Bruxo',
  monk: 'Monge',
  druid: 'Druida',
  'demon-hunter': 'Caçador de Demônios',
  evoker: 'Conjurante',
};
export function ApplyForm() {
  const [erros, setErros] = useState<Record<string, string>>({});
  function dados(form: FormData) {
    return {
      character: { name: form.get('character.name'), realm: form.get('character.realm') },
      class: form.get('class'),
      mainRole: form.get('mainRole'),
      offRole: form.get('offRole') || undefined,
      discordTag: form.get('discordTag'),
      battleTag: form.get('battleTag') || undefined,
      experience: form.get('experience'),
      availableDays: form.getAll('availableDays').map(Number),
      motivation: form.get('motivation'),
      warcraftLogsUrl: form.get('warcraftLogsUrl') || undefined,
      website: form.get('website') || undefined,
    };
  }
  function mensagem(texto: string) {
    return texto === 'Required' ? 'Este campo é obrigatório.' : texto;
  }
  function validarAoSair(evento: React.FocusEvent<HTMLFormElement>) {
    const nome = (evento.target as unknown as HTMLInputElement | HTMLTextAreaElement).name;
    if (!nome || nome === 'website') return;
    const resultado = createApplicationSchema.safeParse(dados(new FormData(evento.currentTarget)));
    const issue = resultado.success
      ? undefined
      : resultado.error.issues.find((item) => item.path.join('.') === nome);
    setErros((atuais) => {
      const novos = { ...atuais };
      if (issue) novos[nome] = mensagem(issue.message);
      else delete novos[nome];
      return novos;
    });
  }
  function submeter(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const form = new FormData(evento.currentTarget);
    const resultado = createApplicationSchema.safeParse(dados(form));
    if (resultado.success) {
      setErros({
        envio: 'O envio pelo site ainda não está aberto. Seus dados não foram enviados.',
      });
      return;
    }
    const novos: Record<string, string> = {};
    for (const issue of resultado.error.issues)
      novos[issue.path.join('.')] ??= mensagem(issue.message);
    setErros(novos);
    const primeiro = resultado.error.issues[0]?.path.join('.');
    if (primeiro) document.getElementById(primeiro)?.focus();
  }
  return (
    <form noValidate onSubmit={submeter} onBlur={validarAoSair} className="mt-10 space-y-8">
      {Object.keys(erros).length > 0 && (
        <Chapa className="p-5">
          <div role="alert">
            <p className="text-fg font-bold">Revise a entrada</p>
            <ul className="text-highlight mt-2 list-inside list-disc text-sm">
              {Object.values(erros).map((erro, i) => (
                <li key={`${erro}-${i}`}>{erro}</li>
              ))}
            </ul>
          </div>
        </Chapa>
      )}
      <div className="grid gap-8 md:grid-cols-2">
        <Campo
          id="character.name"
          label="Personagem"
          ajuda="Como aparece no jogo. Acento não atrapalha."
          erro={erros['character.name']}
          input={{
            name: 'character.name',
            required: true,
            minLength: 2,
            maxLength: 12,
            autoComplete: 'off',
          }}
        />
        <Campo
          id="character.realm"
          label="Realm"
          ajuda="Azralon, Goldrinn, Area 52…"
          erro={erros['character.realm']}
          input={{
            name: 'character.realm',
            required: true,
            minLength: 2,
            maxLength: 64,
            autoComplete: 'off',
          }}
        />
      </div>
      <fieldset>
        <legend className="text-fg-subtle font-mono text-[11px] tracking-[0.14em] uppercase">
          Classe
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-3">
          {CLASSES.map((classe) => (
            <label key={classe} className="text-fg-muted flex min-h-11 items-center gap-3 text-sm">
              <input required type="radio" name="class" value={classe} className="accent-accent" />
              {classePt[classe] ?? classe}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-fg-subtle font-mono text-[11px] tracking-[0.14em] uppercase">
          Função secundária
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="text-fg-muted flex min-h-11 items-center gap-3 text-sm">
            <input defaultChecked type="radio" name="offRole" value="" className="accent-accent" />
            Nenhuma
          </label>
          {ROLES.map((role) => (
            <label key={role} className="text-fg-muted flex min-h-11 items-center gap-3 text-sm">
              <input type="radio" name="offRole" value={role} className="accent-accent" />
              {role}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-fg-subtle font-mono text-[11px] tracking-[0.14em] uppercase">
          Função principal
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {ROLES.map((role) => (
            <label key={role} className="text-fg-muted flex min-h-11 items-center gap-3 text-sm">
              <input required type="radio" name="mainRole" value={role} className="accent-accent" />
              {role}
            </label>
          ))}
        </div>
      </fieldset>
      <Campo
        id="discordTag"
        label="Discord"
        erro={erros.discordTag}
        input={{ name: 'discordTag', required: true, minLength: 2, maxLength: 37 }}
      />
      <Campo
        id="battleTag"
        label="BattleTag"
        ajuda="Formato: Nome#1234"
        erro={erros.battleTag}
        input={{ name: 'battleTag', pattern: '.{2,12}#\\d{4,5}' }}
      />
      <DetentesDias />
      <Campo
        id="experience"
        label="Experiência"
        erro={erros.experience}
        textarea
        area={{ name: 'experience', required: true, maxLength: 4000 }}
      />
      <Campo
        id="motivation"
        label="Por que a Titan Inc"
        erro={erros.motivation}
        textarea
        area={{ name: 'motivation', required: true, maxLength: 4000 }}
      />
      <Campo
        id="warcraftLogsUrl"
        label="Logs"
        erro={erros.warcraftLogsUrl}
        input={{ name: 'warcraftLogsUrl', type: 'url', inputMode: 'url' }}
      />
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <Chapa className="p-5">
        <p id="envio-fechado" role="note" className="text-fg-muted text-sm leading-relaxed">
          O envio pelo site ainda não está aberto. O canal de candidatura será informado aqui quando
          estiver disponível.
        </p>
      </Chapa>
      <Acao
        variante="solida"
        type="submit"
        disabled
        aria-describedby="envio-fechado"
        className="w-full md:w-auto"
      >
        Registrar candidatura
      </Acao>
    </form>
  );
}
