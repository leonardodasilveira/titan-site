# Site da Guilda

Site da guilda de World of Warcraft: landing pública com formulário de apply, e área interna para guild management.

Projeto de dois devs, desenvolvido com Claude. **As regras abaixo existem para que as duas pessoas e as duas sessões de Claude produzam a mesma arquitetura.** Se uma decisão contradiz este arquivo, o arquivo ganha — ou o arquivo é atualizado explicitamente.

Planejamento no Linear: projeto **Site da Guilda**, time `TIT`.

## Estrutura

```
titan-site/
├─ apps/
│  ├─ web/          Next.js 16 (App Router) + React 19 + Tailwind 4
│  └─ api/          NestJS 11 + Prisma
├─ packages/
│  └─ shared/       contrato: tipos + schemas Zod
└─ tsconfig.base.json
```

## Regra 1 — A fronteira Next ↔ Nest

**Toda regra de negócio e todo acesso a banco vivem no Nest.** O Next renderiza e consome a API.

Route handlers do Next são permitidos **apenas** para o que é genuinamente do browser:

- cookie de sessão
- recebimento de webhook
- upload de arquivo

Qualquer outra coisa (query no banco, chamada às APIs da Blizzard, validação de negócio, envio de notificação) é endpoint no Nest.

Por quê: sem essa linha, em duas semanas metade da lógica está duplicada nos dois lados e não existe fonte da verdade. Com dois devs trabalhando em paralelo, isso acontece rápido.

## Regra 2 — O contrato mora no shared

Todo DTO de request e response nasce como schema Zod em `packages/shared`.

```ts
// packages/shared/src/application.ts
export const createApplicationSchema = z.object({ ... });
export type CreateApplication = z.infer<typeof createApplicationSchema>;
```

- O Nest valida com esse schema (ZodValidationPipe).
- O form do Next usa **o mesmo** schema no resolver.
- **Nunca** redeclarar o mesmo campo nos dois apps.

Se o back mudar um campo e o front não souber, é o typecheck que tem que quebrar — não o usuário.

### Como o shared chega nos apps

`packages/shared` é compilado com `tsup` (ESM + CJS + `.d.ts`), não consumido como TS cru. O `pnpm dev` da raiz já sobe o watch antes dos apps — não precisa rodar nada à mão.

Se mexer no shared e o app não ver a mudança, o watch morreu: `pnpm --filter @titan/shared build`.

`zod` é `external` no tsup de propósito. Embutir criaria duas instâncias do zod e `instanceof ZodError` pararia de funcionar no Nest.

## Regra 3 — Estrutura de módulo no Nest

Um módulo por domínio (`applications`, `guild`, `auth`), cada um com:

```
src/applications/
├─ applications.module.ts
├─ applications.controller.ts    ← só HTTP: rota, status, serialização
├─ applications.service.ts       ← regra de negócio
└─ applications.repository.ts    ← único lugar que toca o Prisma
```

- Regra de negócio no **service**, nunca no controller.
- `PrismaClient` só no **repository**. Nenhum service importa Prisma direto.

## Regra 4 — Autorização é no Nest, sempre

O middleware do Next que protege `/interno/*` é **UX, não segurança**. Ele evita tela quebrada.

Todo endpoint interno precisa do seu próprio guard no Nest. Um endpoint que depende só do middleware do Next é chamável com `curl` por qualquer pessoa.

Ao criar endpoint interno, o teste não é "a UI esconde?" — é "chamado sem cookie devolve 401?".

## Regra 5 — Chamadas a APIs externas

Blizzard, Raider.IO e WarcraftLogs são chamadas **só pelo Nest**, nunca pelo browser.

- As credenciais da Blizzard não podem ir para o bundle do front.
- O cache tem que ficar em um lugar só. Sem cache, cada visita na home queima rate limit — e o dado muda no máximo uma vez por semana.
- Falha de API externa não pode derrubar página: degradar para o último dado bom ou esconder a seção.

### Normalização de nomes

Realm e nome de personagem **sempre** comparados via `toSlug()` do shared, nunca string crua.

A Blizzard devolve realm como slug (`area-52`) em alguns endpoints e como nome exibido (`Area 52`) em outros, e nomes vêm com acento e capitalização variável. Comparar string crua faz a verificação de membership falhar **silenciosamente** — o pior tipo de bug aqui, porque parece que funcionou.

## Comandos

```bash
pnpm install              # na raiz

pnpm dev                  # shared (watch) + web + api, tudo junto
pnpm dev:web              # só o Next
pnpm dev:api              # só o Nest

pnpm typecheck            # todos os workspaces
pnpm lint
pnpm test
pnpm format

pnpm build                # todos, na ordem de dependência
```

## Fluxo de git

`main` é protegida: nada de push direto, nada de force-push. Todo trabalho entra por PR.

```bash
git switch -c leonardodasilveira/tit-15-formulario-de-apply-em-apply
# ... trabalho ...
git push          # push.autoSetupRemote já cria o upstream
gh pr create
```

**Nome da branch vem do Linear.** Cada issue tem um `gitBranchName` pronto (botão de copiar na issue). Usar esse nome faz o Linear ligar branch, PR e issue automaticamente, e mover a issue de status sozinho. Inventar nome de branch quebra essa ligação.

O CI (`.github/workflows/ci.yml`) roda no PR: formatação, lint, build, typecheck e testes. Merge só com CI verde.

Review do outro dev é bem-vindo, mas não obrigatório — em dupla, review obrigatório trava quando um dos dois está offline.

Antes de abrir PR, rodar localmente o que o CI roda:

```bash
pnpm format:check && pnpm lint && pnpm build && pnpm typecheck && pnpm test
```

`pnpm build` **antes** de `pnpm typecheck`: o `packages/shared` precisa estar compilado para os apps resolverem os tipos dele.

## Segredos

Nada de credencial no repositório. Tudo em `.env` local, documentado em `.env.example`.

Nunca commitar: `DATABASE_URL`, `BLIZZARD_CLIENT_ID`, `BLIZZARD_CLIENT_SECRET`, `SESSION_SECRET`, `DISCORD_WEBHOOK_URL`.

## Aviso sobre o Next 16

`apps/web/AGENTS.md` (gerado pelo `create-next-app`) avisa que esta versão do Next tem breaking changes em relação ao conhecimento pré-treinado, e manda ler `node_modules/next/dist/docs/` antes de escrever código.

**Respeitar isso.** Antes de mexer em App Router, cache, `use cache`, route handlers ou config, ler o guia relevante em `node_modules/next/dist/docs/` em vez de assumir a API de memória.

## Decisões já tomadas (não reabrir sem motivo)

| Decisão | Escolha                              | Motivo                                                                                                              |
| ------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Front   | Next.js, não Vite/SPA                | existe landing pública que precisa de SEO **e** área logada                                                         |
| Back    | NestJS                               | um dos devs já domina                                                                                               |
| Auth    | Battle.net OAuth2                    | verifica membership de verdade via roster; zero senha para guardar                                                  |
| Sessão  | cookie de sessão com estado no banco | permite revogar acesso na hora quando alguém sai da guilda; JWT sem revogação deixaria ex-membro dentro até expirar |
| Banco   | PostgreSQL + Prisma                  | melhor DX com Nest, tipos gerados                                                                                   |
| Deploy  | Docker por app                       | destino ainda não decidido; portável entre PaaS e VPS                                                               |
