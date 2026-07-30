import { loadGuildConfig } from './guild.config';

const valid = {
  BLIZZARD_REGION: 'us',
  GUILD_NAME: 'Titan Inc',
  GUILD_REALM: 'Azralon',
} satisfies NodeJS.ProcessEnv;

describe('loadGuildConfig', () => {
  it('aceita config válida', () => {
    expect(loadGuildConfig(valid)).toEqual({
      region: 'us',
      name: 'Titan Inc',
      realm: 'Azralon',
    });
  });

  it('assume us quando BLIZZARD_REGION não está definida', () => {
    expect(
      loadGuildConfig({ GUILD_NAME: valid.GUILD_NAME, GUILD_REALM: valid.GUILD_REALM }).region,
    ).toBe('us');
  });

  it('rejeita região que não é us, mesmo sendo válida na Blizzard', () => {
    // A guilda é US-only. Trocar isso no .env sem trocar no código seria um
    // jeito silencioso de esvaziar o roster.
    expect(() => loadGuildConfig({ ...valid, BLIZZARD_REGION: 'eu' })).toThrow(/US-only/);
  });

  it('rejeita região inexistente', () => {
    expect(() => loadGuildConfig({ ...valid, BLIZZARD_REGION: 'br' })).toThrow(/inválida/);
  });

  it('exige GUILD_NAME e GUILD_REALM', () => {
    expect(() => loadGuildConfig({ ...valid, GUILD_NAME: '' })).toThrow(/obrigatórios/);
    expect(() => loadGuildConfig({ ...valid, GUILD_REALM: '   ' })).toThrow(/obrigatórios/);
  });

  it('remove espaços em volta do nome e do realm', () => {
    const cfg = loadGuildConfig({
      ...valid,
      GUILD_NAME: '  Titan Inc  ',
      GUILD_REALM: ' Azralon ',
    });
    expect(cfg).toMatchObject({ name: 'Titan Inc', realm: 'Azralon' });
  });
});
