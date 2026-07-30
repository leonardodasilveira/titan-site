# Site da Guilda

Landing pública com formulário de apply + área interna para guild management.

Planejamento: projeto **Site da Guilda** no Linear (time `TIT`).
Convenções de arquitetura e fluxo de git: [`CLAUDE.md`](./CLAUDE.md).

> Repositório **público**. Nenhuma credencial ou dado de membro pode ser versionado —
> ver a seção de segredos no `CLAUDE.md`.

## Stack

- **Front:** Next.js 16 (App Router) + React 19 + Tailwind 4
- **Back:** NestJS 11 + Prisma
- **Banco:** PostgreSQL
- **Compartilhado:** `packages/shared` — tipos e schemas Zod usados pelos dois lados
- **Auth:** Battle.net OAuth2

## Subindo o ambiente

Requer Node 22+ e pnpm 11+.

```bash
pnpm install
cp .env.example .env    # preencher os valores
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001

`pnpm dev` compila o `packages/shared` e sobe web, api e o watch do shared juntos.

## Estado atual

Scaffold pronto e verificado: os três workspaces buildam, `pnpm typecheck` passa, e o
`packages/shared` foi confirmado consumível dos dois lados (ESM no Next, CJS no Nest).

**Ainda não configurado:**

- Banco de dados e Prisma — TIT-7. Docker não está disponível nesta máquina ainda;
  a alternativa é um Postgres gerenciado para dev.
- Credenciais do Battle.net — TIT-8. Bloqueia todo o milestone de auth.
- ESLint compartilhado na raiz — TIT-9. Hoje cada app usa a config do seu scaffold.

## Comandos

| Comando          | O que faz                              |
| ---------------- | -------------------------------------- |
| `pnpm dev`       | shared (watch) + web + api             |
| `pnpm dev:web`   | só o Next                              |
| `pnpm dev:api`   | só o Nest                              |
| `pnpm typecheck` | todos os workspaces                    |
| `pnpm build`     | build de tudo, na ordem de dependência |
| `pnpm lint`      | ESLint                                 |
| `pnpm test`      | testes                                 |
| `pnpm format`    | Prettier                               |
