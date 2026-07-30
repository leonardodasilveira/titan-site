import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  // Dupla saída: o Next consome ESM, o Nest compilado consome CJS.
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,

  /**
   * NÃO limpar em watch.
   *
   * O build de JS leva ~25ms e o de .d.ts ~950ms. Se o dist/ é apagado a cada
   * rebuild, existe uma janela onde index.js já está lá mas index.d.ts não —
   * e o tsc do Nest, compilando em paralelo, falha com TS7016
   * ("Could not find a declaration file for module '@titan/shared'") e a API
   * não sobe.
   *
   * Em watch, .d.ts velho por 900ms é inofensivo; .d.ts ausente derruba o dev.
   */
  clean: !options.watch,

  // zod é dependência dos dois apps — não embutir, senão duas instâncias
  // do zod quebram `instanceof ZodError` no Nest.
  external: ['zod'],

  // Ignora os arquivos de teste: o vitest roda direto do src.
  ignoreWatch: ['**/*.spec.ts'],
}));
