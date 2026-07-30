import { describe, expect, it } from 'vitest';
import { toSlug } from './wow.js';

describe('toSlug', () => {
  it('normaliza caixa e espaços', () => {
    expect(toSlug('Burning Legion')).toBe('burning-legion');
    expect(toSlug('  Nome_Com Espaco ')).toBe('nome-com-espaco');
  });

  it('remove apóstrofos', () => {
    expect(toSlug("Cho'gall")).toBe('chogall');
    expect(toSlug('Cho’gall')).toBe('chogall');
  });

  it('remove acentos combinantes', () => {
    expect(toSlug('Área 52')).toBe('area-52');
    expect(toSlug('Ázràlon')).toBe('azralon');
  });

  /**
   * Casos tirados do roster real da Titan Inc (Azralon). É o cenário que
   * importa: quem digita o nome sem os caracteres especiais tem que casar com
   * o nome como está no roster.
   */
  describe('nomes reais do roster', () => {
    const casos: ReadonlyArray<readonly [rosterName: string, digitado: string]> = [
      ['Zécolmeia', 'Zecolmeia'],
      ['Åzurra', 'Azurra'],
      ['Dhärmä', 'Dharma'],
      ['Jöci', 'Joci'],
      // Este é o que estava quebrado: o ø não é decomposto pelo NFD.
      ['Håøkåh', 'Haokah'],
    ];

    for (const [rosterName, digitado] of casos) {
      it(`"${rosterName}" casa com "${digitado}"`, () => {
        expect(toSlug(rosterName)).toBe(toSlug(digitado));
      });
    }
  });

  it('transliteral letras latinas que o NFD não decompõe', () => {
    expect(toSlug('Håøkåh')).toBe('haokah');
    expect(toSlug('Æther')).toBe('aether');
    expect(toSlug('Strauß')).toBe('strauss');
    expect(toSlug('Øystein')).toBe('oystein');
    expect(toSlug('Þor')).toBe('thor');
  });

  it('é idempotente — aplicar duas vezes não muda o resultado', () => {
    // Importa porque o valor pode ser normalizado ao gravar e de novo ao ler.
    for (const nome of ['Håøkåh', 'Zécolmeia', "Cho'gall", 'Área 52']) {
      expect(toSlug(toSlug(nome))).toBe(toSlug(nome));
    }
  });
});
