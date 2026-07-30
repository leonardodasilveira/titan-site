import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  // Dupla saída: o Next consome ESM, o Nest compilado consome CJS.
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  // zod é dependência dos dois apps — não embutir, senão duas instâncias
  // do zod quebram `instanceof ZodError` no Nest.
  external: ['zod'],
});
