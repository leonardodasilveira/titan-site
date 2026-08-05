# Landing pública — Especificação de implementação

> **Contrato técnico e visual.** Este documento fecha as decisões de direção de arte, UX,
> arquitetura, responsividade, conteúdo, mídia e comportamento da landing pública da Titan Inc.
> Quem implementa **executa**; não reinterpreta.
>
> Leitura obrigatória junto com este arquivo: `CLAUDE.md` (raiz) e `README.md`.
> Quem mexer em App Router, cache, route handler ou config: `apps/web/AGENTS.md` manda ler
> `node_modules/next/dist/docs/` antes — o Next 16 tem breaking changes em relação ao
> conhecimento pré-treinado. Respeitar.

| | |
| --- | --- |
| **Versão** | 1.1 — ver §25 |
| **Data** | 2026-08-05 |
| **Branch** | `feat/landing-page` |
| **Escopo** | `apps/web` apenas |
| **Direção aprovada** | INSTRUMENTO — *a progressão como leitura, não como número* |
| **Fora de escopo** | `apps/api`, `packages/shared`, `apps/web/app/interno/**`, `middleware.ts` |

**Como ler as marcações usadas no documento inteiro:**

| Marca | Significado |
| --- | --- |
| `[FECHADO]` | Decisão tomada. Não reabrir sem falar com o autor da issue. |
| `[PROV]` | Provisório. Funciona hoje, muda quando o dado/conteúdo real chegar. |
| `[BLOQUEADO]` | Depende de backend ou de conteúdo que ainda não existe. Tem estado degradado projetado. |
| `[VERIFICAR]` | Precisa de checagem em tempo de implementação. O documento diz como decidir. |

---

## 0. Índice

1. [Contrato de direção](#1-contrato-de-direção)
2. [Escopo funcional](#2-escopo-funcional) · **[2.1 Filosofia de placeholders](#21-filosofia-de-placeholders--o-projeto-nunca-trabalha-com-buracos)**
3. [Fundação visual](#3-fundação-visual)
4. [Arquitetura frontend](#4-arquitetura-frontend)
5. [Dados e contratos](#5-dados-e-contratos)
6. [Placeholders e dados temporários](#6-placeholders-e-dados-temporários)
7. [Navegação](#7-navegação)
8. [Hero e instrumento](#8-hero-e-instrumento)
9. [About Us](#9-about-us)
10. [Roster](#10-roster)
11. [Apply](#11-apply)
12. [Login OAuth via popup](#12-login-oauth-via-popup)
13. [Footer](#13-footer)
14. [Responsividade](#14-responsividade)
15. [Movimento](#15-movimento)
16. [Acessibilidade](#16-acessibilidade)
17. [Performance](#17-performance)
18. [Mídia](#18-mídia)
19. [Copy e conteúdo](#19-copy-e-conteúdo)
20. [Critérios de aceite](#20-critérios-de-aceite)
21. [Plano de implementação](#21-plano-de-implementação)
22. [Matriz de QA](#22-matriz-de-qa)
23. [Backlog de backend](#23-backlog-de-backend)
24. [Riscos, suposições e decisões abertas](#24-riscos-suposições-e-decisões-abertas)

---

## 1. Contrato de direção

Este bloco vai, **verbatim e resumido**, como comentário HTML no topo do `<body>` em
`apps/web/app/layout.tsx` (ver §4.2). É o contrato que sobrevive ao build e que a revisão final
audita contra o render.

**THESIS.** A Titan Inc não conta onde chegou: ela **afere**. A landing é o painel dessa
aferição. Recusa o arranjo padrão da categoria — key art com scrim chapado, manchete condensada
em caixa alta, barra de progresso, grid de cards de vidro — e recusa também o oposto previsível,
o minimalismo de org de esports.

**OWN-WORLD.** Chapa de casco escura sob **uma** fonte de luz fria vinda de cima à direita.
Geometria gravada, não desenhada: círculos verdadeiros, detentes, réguas, sulcos de 1px.
Turquesa é **luz** (lâmpada acesa, agulha, ação, foco) e ocupa menos de 3% da superfície. Rosa é
**marca de falha** (wipe, melhor percentual, erro de campo). Azul da marca é **campo de
profundidade** — a atmosfera, nunca um traço. Cantos de 2 a 4px em chapas; círculo verdadeiro
apenas no instrumento. Sem blur, sem transparência decorativa, sem gradiente roxo, sem glow.

**STORY.** O visitante entende em um viewport: *esta guilda mede o que faz, e está em tal ponto
do tier*. Acredita porque a leitura é aferida e linkada a fonte externa verificável. Age
candidatando-se — e a candidatura é apresentada como **entrada no registro**, não como
formulário.

**FIRST VIEWPORT.** Fundo atmosférico em profundidade, massa focal à direita do centro. Coluna
esquerda (5 de 12): wordmark pequeno no topo, sobrancelha gravada com tier e season, `h1` em
até três linhas, uma linha de corpo, **uma** ação sólida. À direita do centro, sobrepondo o
fundo e sangrando para fora da borda direita: o **disco de aferição** — placa circular gravada
com uma detente por boss, as vencidas acesas, agulha parada na última. Leitura textual explícita
sob o cubo: `6/8` grande + `MÍTICO` em mono. No rodapé do viewport, pequeno: a linha de
procedência com link para a fonte externa.

**FORM.** Direção "INSTRUMENTO", escolhida por derivação da âncora da marca e da frase que o
próprio `CLAUDE.md` já declara como tese do produto: *"o site é o registro"* (Regra 7). O
sorteio formal de direções do Impeccable **não pôde rodar** — `concept-seed.mjs` exige um
`PRODUCT.md` que não existe no repositório e a etapa proibia criar arquivos. Derivação feita à
mão, com as duas valas da categoria nomeadas e mantidas fora. Divulgado aqui em vez de omitido.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the finish review,
the verdict, and DESIGN.md.

### 1.1 A regra que gera o acabamento

Uma regra sozinha produz a maior parte da sensação de "gravado". Está aqui em cima porque é
aplicada em **toda** superfície elevada da página, e porque é o item nº 1 da revisão visual.

> **Toda chapa tem uma luz no topo e um sulco na base.**
> `border-top: 1px solid var(--color-edge)` · `border-bottom: 1px solid var(--color-groove)` ·
> fundo com gradiente vertical de ~2% do topo para a base.
> Nada de `box-shadow` difuso. Nada de borda uniforme nos quatro lados.

A fonte de luz é **superior-direita, fria, única**. Todo realce, sulco e vinheta da página
obedece a ela. Se um elemento tem luz vindo de outra direção, está errado — não é questão de
gosto.

---

## 2. Escopo funcional

Seis áreas, nesta ordem no DOM. Nenhuma seção adicional, por nenhum motivo.

| # | Seção | Âncora | Dado | Estado sem backend |
| --- | --- | --- | --- | --- |
| 1 | Navbar (com login OAuth) | — | sessão (opcional) | botão de login inerte com aviso |
| 2 | Hero + instrumento | `#topo` | progressão pública | `SEM LEITURA`, projetado |
| 3 | About Us | `#sobre` | estático | — |
| 4 | Roster | `#tripulacao` | roster público | placeholders marcados |
| 5 | Apply | `#candidatura` | POST candidatura | envio fechado, explicitamente |
| 6 | Footer | — | estático | — |

**Proibido criar:** depoimento, estatística genérica, notícia, blog, carrossel editorial, loja,
plano, feature grid, FAQ, seção de parceiros, contador inventado, "trusted by", newsletter,
qualquer conteúdo não listado acima.

**Proibido alongar a página** adicionando seção. Se uma seção parecer curta, a correção é
resolver melhor a que existe.

### 2.1 Filosofia de placeholders — o projeto nunca trabalha com buracos

> **Regra governante, acima de qualquer outra seção deste documento.**
>
> **Nenhum elemento visual da interface pode depender da existência do asset final para
> existir.** Nenhuma área da página pode ficar vazia esperando arte, texto ou dado.
>
> Qualquer versão intermediária — em qualquer dia do desenvolvimento, em qualquer commit —
> tem de poder ser publicada internamente, revisada pelo time ou apresentada sem transmitir
> sensação de projeto incompleto.

**As quatro trilhas, e o que cada uma exige:**

| Trilha | O que falta | O que se usa no lugar | Onde está especificado |
| --- | --- | --- | --- |
| **Assets** | imagem, marca, ícone, OG, favicon | **placeholder oficial de alta fidelidade** | §18.2–18.9 (A1–A6, todos com estratégia obrigatória) |
| **Textos** | copy definitiva da guilda | **Lorem Ipsum calibrado** — mesma contagem, mesma hierarquia | §19.4 |
| **Dados** | resposta de API | **mock**, com guarda que quebra o build em produção | §6 |
| **Imagens de conteúdo** | retratos do roster | **placeholder editorial** na linguagem do roster | §10.5 |

**O que um placeholder oficial NÃO pode ser:**

- retângulo cinza;
- imagem quebrada, `alt` órfão ou ícone de erro;
- skeleton permanente (skeleton é estado de carregamento, não estado de ausência);
- bloco vazio, `<div>` com altura e nada dentro;
- moldura tracejada com o texto "imagem aqui";
- lorem ipsum em campo que já tem conteúdo real definido;
- borda pontilhada, marca d'água "PLACEHOLDER", ou qualquer sinalização de canteiro de obras
  **dentro da composição**. O aviso de provisoriedade vive na tarja de desenvolvimento
  (§6.1) e no código, nunca na arte.

**O que um placeholder oficial precisa ser:**

1. **Fiel à direção de arte.** Campo profundo, luz superior-direita, chapa gravada, cantos
   pequenos. Se destoar, não é placeholder — é buraco enfeitado.
2. **Construído com os tokens oficiais.** Zero cor literal, zero cinza neutro fora da paleta.
3. **Dimensionalmente idêntico ao final.** Mesma proporção, mesmo peso na composição, mesmo
   `aspect-ratio`. Trocar o placeholder pelo asset final **não pode mover um pixel de layout.**
4. **Fotografável.** A página tem de render screenshot apresentável em qualquer etapa. Este é o
   teste prático: *tirei print agora, mostro para alguém de fora sem explicar?*
5. **Removível em um lugar só.** Cada placeholder tem um ponto de troca documentado.

**Consequência para o plano de execução:** os placeholders oficiais são produzidos na **etapa
2** (fundação), antes de qualquer seção. Não são um remendo do fim; são a base sobre a qual as
seções são construídas. Ver §21.

---

## 3. Fundação visual

### 3.1 Tokens de cor `[FECHADO]`

Os tokens atuais de `apps/web/app/globals.css` **permanecem com os mesmos valores**. Muda o
papel de cada um, e entram quatro tokens novos. Nenhuma cor nova é inventada: os novos derivam
dos existentes.

| Token | Valor | Papel na direção | Cobertura alvo |
| --- | --- | --- | --- |
| `--color-bg` | `#0b0d12` | O fundo. O casco. | ~68% |
| `--color-surface` | `#14171f` | Chapa elevada: nav rolada, placas, painel de leitura | ~15% |
| `--color-border` | `#232733` | Régua e divisória. Nunca é a única fonte de profundidade | linha |
| `--color-fg` | `#e8eaf0` | Texto primário | — |
| `--color-fg-muted` | `#9aa1b1` | Texto de corpo secundário | — |
| `--color-fg-subtle` | `#6b7280` | Rótulo gravado, legenda. **Ver §3.2** | — |
| `--color-accent` | `#78d8c0` | **Luz.** Detente acesa, agulha, ação primária, anel de foco | **< 3%** |
| `--color-accent-soft` | `#14332c` | Fundo de estado ativo discreto | — |
| `--color-highlight` | `#d86078` | **Falha.** Melhor percentual, wipe, erro de campo | < 1% |
| `--color-highlight-soft` | `#331a20` | Fundo de alerta | — |
| `--color-brand-blue` | `#4878c0` | Base do campo de profundidade. **Hoje não é usado — passa a ser** | difuso |
| `--color-ok` / `--color-danger` | — | Estados de sistema | — |

**Tokens novos (4):**

```css
/* Luz no topo de toda chapa. É o que faz metal parecer metal. */
--color-edge: rgba(232, 234, 240, 0.07);

/* Sulco na base de toda chapa. Par obrigatório do de cima. */
--color-groove: rgba(0, 0, 0, 0.45);

/* Campo de profundidade: bg + brand-blue a ~9%. A atmosfera da hero. */
--color-deep: #10151f;

/* Núcleo do campo, no ponto de luz. Só em gradiente, nunca chapado. */
--color-deep-lit: #16203a;
```

**Estratégia de cor `[FECHADO]`: Restrained com campo.** Neutros escuros dominam; a turquesa é
escassa e por isso significa. A correção em relação à landing atual não é trocar a paleta — é
que hoje a página é **plana**, com `#0b0d12` chapado em tudo e profundidade tentada só por
borda. `--color-deep` / `--color-deep-lit` existem para dar à hero um campo real de atmosfera.

**Proibido:** qualquer cor hexadecimal escrita direto em componente. Sem exceção — a regra já
está no comentário do `globals.css` atual. A única cor literal tolerada no repo hoje é o
`text-[#0b0d12]` sobre botão turquesa; ele vira `text-bg` na primeira etapa.

### 3.2 Contraste `[VERIFICAR]`

Medir antes de usar, com qualquer verificador WCAG:

| Par | Uso pretendido | Exigência |
| --- | --- | --- |
| `fg-subtle #6b7280` sobre `bg #0b0d12` | rótulo mono 11px | ≥ 4.5:1. **Se reprovar, clarear o token para `#7d8494` e registrar aqui.** |
| `fg-muted #9aa1b1` sobre `bg` | corpo 17px | ≥ 4.5:1 |
| `accent #78d8c0` sobre `bg` | leitura numérica, links | ≥ 4.5:1 |
| `bg #0b0d12` sobre `accent` | texto do botão sólido | ≥ 4.5:1 |
| `highlight #d86078` sobre `bg` | percentual de wipe, erro | ≥ 4.5:1 |
| `accent` sobre `surface #14171f` | anel de foco | ≥ 3:1 (não-texto) |

Sobre imagem, texto **nunca** depende do contraste da imagem: o scrim (§18.4) garante piso de
luminância antes de qualquer texto ser desenhado.

### 3.3 Tipografia `[FECHADO]`

Hoje o projeto usa **Geist + Geist Mono**, que é a fonte do scaffold do `create-next-app`, não
uma escolha. Para uma superfície de persuasão isso é neutro demais.

| Papel | Face | Como carregar |
| --- | --- | --- |
| **Display + corpo** | **Archivo** (Omnibus-Type, OFL, variável) | `next/font/google`, subset `latin`, `display: 'swap'`, variável `--font-sans` |
| **Dado, rótulo gravado, numeral** | **Geist Mono** (manter) | já no projeto, custo zero, numeral tabular limpo |

**Por que Archivo.** Grotesca de sinalização industrial: largura e peso reais, terminais retos
que combinam com gravação, legibilidade intacta em 72px e em 13px. Uma família só cobre display
e corpo — economia de payload e coesão. É OFL e está no Google Fonts. Evitadas
deliberadamente as faces que qualquer modelo entrega por associação de categoria (Space
Grotesk, IBM Plex, Inter-como-display, DM Sans, Outfit, Plus Jakarta, Playfair, Fraunces).

**Eixo de largura `[VERIFICAR]`.** A intenção é usar Archivo em largura expandida no `h1`.
Em tempo de implementação, testar:

```ts
Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-sans' })
```

- **Se `axes: ['wdth']` for aceito pelo `next/font/google`:** usar `font-stretch: 112%` no `h1`
  e no numeral grande do instrumento. Corpo em 100%.
- **Se for rejeitado** (a família servida pelo GF não expõe `wdth`): remover a opção `axes`,
  usar peso 800 em 100% de largura, e compensar a presença com tamanho e `letter-spacing:
  -0.02em`. **Não** substituir por outra família, **não** usar `transform: scaleX()`.

Registrar aqui qual caminho valeu.

**Escala tipográfica** (razão ~1.33, valores em px):

| Passo | px | Uso |
| --- | --- | --- |
| `mono-xs` | 11 | rótulo gravado, caixa alta, `tracking .14em` |
| `xs` | 13 | legenda, procedência, nota de campo |
| `sm` | 15 | rótulo de formulário, metadado de placa |
| `base` | 17 | corpo |
| `lg` | 22 | corpo do About (a passagem grande) |
| `xl` | 30 | `h2` mobile |
| `2xl` | 40 | `h1` mobile · `h2` desktop |
| `3xl` | 54 | `h1` tablet · numeral do instrumento |
| `4xl` | 72 | `h1` desktop |

**Regras fechadas:**

- Entrelinha: 1.6 no corpo, 1.05 no `h1`, 1.15 em `h2`.
- Máximo **65 caracteres** por linha em texto corrido (`max-width: 34ch` no About).
- `text-wrap: balance` em `h1` e `h2`; `text-wrap: pretty` em parágrafos.
- Todo rótulo mono é caixa alta com `tracking: 0.14em`. Nunca caixa alta em texto de corpo.
- Numeral de dado **sempre** `font-variant-numeric: tabular-nums`. Sem exceção — colunas e
  leituras que dançam ao atualizar são o oposto de "aferido".
- Formatação numérica sempre com `toLocaleString('pt-BR', …)`, seguindo o padrão já
  estabelecido em `app/interno/roster/_components/roster-table.tsx` (ilvl com 2 casas mínimas,
  score com 1 casa mínima).

### 3.4 Grid, espaço e ritmo `[FECHADO]`

| Item | Valor |
| --- | --- |
| Base de espaçamento | 4px |
| Escala | 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160 |
| Coluna de conteúdo | `max-width: 1120px` |
| Largura máxima da página | `max-width: 1440px` (o fundo sangra além) |
| Colunas | 12, gutter 24px (16px abaixo de 768) |
| Padding lateral | 24px (<768) · 32px (768–1279) · 48px (≥1280) |
| Espaço entre seções | 160px (≥1024) · 120px (768–1023) · 96px (<768) |
| Full-bleed | **só** na hero e no trilho do roster. Se tudo sangra, nada sangra |

**Regra de ritmo, aplicada sem exceção:** mais espaço **acima** de um título do que abaixo dele.
Padrão: 96px acima, 24px abaixo. É a regra que sozinha faz a página parecer composta em vez de
empilhada.

**Ritmo de densidade, na ordem da página:** denso (hero) → **quieto** (About) → denso (roster) →
médio (apply) → âncora (footer). Uma passagem densa precisa de uma quieta antes e depois. O
About existe funcionalmente como o respiro; não pode ganhar cards.

### 3.5 Forma, borda e elevação `[FECHADO]`

| Elemento | Raio | Tratamento |
| --- | --- | --- |
| Chapa (placa, painel, nav rolada) | 3px | luz no topo + sulco na base (§1.1) |
| Botão sólido | 3px | idem, com a luz reforçada |
| Campo de formulário | 0 | **sem caixa**: régua de baseline de 1px |
| Instrumento | círculo verdadeiro | é a única forma circular da página |
| Retrato do roster | 2px | máscara retangular |

**Proibido:** `rounded-lg` e acima em qualquer elemento novo (o repo atual usa `rounded-lg` na
área interna — não é referência para a landing); `backdrop-filter`; `box-shadow` difuso como
recurso de elevação; borda de 1px uniforme nos quatro lados como recurso de profundidade.

---
## 4. Arquitetura frontend

### 4.1 Restrições herdadas do repositório

Não negociáveis. Vêm do `CLAUDE.md` e do estado real do código.

1. **Regra 1** — nenhuma regra de negócio e nenhum acesso a banco no Next. Route handler do Next
   só para cookie de sessão, webhook e upload. O callback do popup (§12) é cookie de sessão,
   logo é o **único** route/page handler novo permitido.
2. **Regra 2** — todo DTO nasce como schema Zod em `packages/shared`. A landing **consome**;
   não redeclara campo.
3. **Regra 5** — o `middleware.ts` é UX. Nada da landing depende dele.
4. **Regra 6** — nenhuma chamada a Blizzard, Raider.IO ou Warcraft Logs sai do browser. Nem
   para o retrato do personagem. Nem "só essa vez".
5. **Regra 6 (nomes)** — a identidade de um personagem é **sempre o par nome + realm**. Chave de
   React, chave de mapa, chave de cache: `${realm}/${name}`. Nunca o nome sozinho.
6. Server Component por padrão. `'use client'` só onde há estado, evento ou API de browser.
7. Toda leitura de API passa por `lib/api.ts` (`server-only`) e é validada com schema do shared.
8. Falha de API vira `null` → estado degradado projetado. Nunca tela de erro, nunca zero no
   lugar de "sem dado".
9. Componentes colocados em `_components/` dentro da própria rota, como já é a convenção.
10. Identificadores e comentários em **português**. Comentário explica *por quê*, não *o quê*.
11. Classes Tailwind na ordem do `prettier-plugin-tailwindcss` — `pnpm format:check` é o
    primeiro passo do CI.

### 4.2 Árvore de arquivos

`[M]` = modificado · `[N]` = novo · `[R]` = removido · **S** = Server Component · **C** = Client
Component

```
apps/web/
├─ app/
│  ├─ layout.tsx                              [M] S   contrato, fontes, skip link, nav, footer
│  ├─ page.tsx                                [M] S   composição das 6 seções, nada mais
│  ├─ globals.css                             [M]     4 tokens novos + utilitários de chapa
│  ├─ oauth/callback/page.tsx                 [N] S   página de retorno do popup (§12)
│  ├─ opengraph-image.tsx                     [N] S   OG oficial provisória (§18.8.2)
│  ├─ icon.svg                                [N]     favicon provisório (§18.6, A6)
│  └─ _components/
│     ├─ ui/
│     │  ├─ chapa.tsx                         [N] S   a superfície gravada (o primitivo)
│     │  ├─ rotulo.tsx                        [N] S   o mono caixa-alta tracked
│     │  ├─ acao.tsx                          [N] S   ação sólida e fantasma, <a> ou <button>
│     │  ├─ wordmark.tsx                      [N] S   wordmark tipográfico provisório (§18.8.1)
│     │  └─ marca.tsx                         [N] S   disco reduzido: âncora provisória (§18.6)
│     ├─ site-nav.tsx                         [N] C   régua, scroll-spy, disclosure mobile
│     ├─ nav-painel.tsx                       [N] C   painel de seções (mobile)
│     ├─ login-button.tsx                     [N] C   popup OAuth
│     ├─ site-footer.tsx                      [N] S
│     ├─ hero.tsx                             [N] S   composição + fundo + scrim
│     ├─ campo-profundo.tsx                   [N] S   fundo autoral SVG/CSS (§18.5)
│     ├─ instrumento/
│     │  ├─ instrumento.tsx                   [N] S   dado → geometria → render
│     │  ├─ disco.tsx                         [N] S   SVG puro, aria-hidden
│     │  ├─ detentes.tsx                      [N] C   botões sobrepostos + painel de leitura
│     │  ├─ geometria.ts                      [N]     puro: polar, seleção de raid/dificuldade
│     │  └─ geometria.spec.ts                 [N]     teste unitário
│     ├─ sobre.tsx                            [N] S
│     ├─ roster/
│     │  ├─ roster.tsx                        [N] S   busca, degrada, escolhe grid ou trilho
│     │  ├─ roster-grid.tsx                   [N] S   grid ≥768
│     │  ├─ roster-trilho.tsx                 [N] C   trilho com snap <768
│     │  ├─ placa-tripulante.tsx              [N] S   a placa individual
│     │  └─ retrato-editorial.tsx             [N] S   placeholder de retrato (§18.8.3)
│     └─ apply/
│        ├─ apply.tsx                         [N] S   moldura, copy, aviso de envio fechado
│        ├─ apply-form.tsx                    [N] C   campos, validação, estados
│        ├─ campo.tsx                         [N] C   linha regrada + erro + aria-describedby
│        └─ detentes-dias.tsx                 [N] C   os 7 dias como detentes
├─ lib/
│  ├─ api.ts                                  [M]     + getProgressaoPublica, getRosterPublico
│  ├─ config.ts                               [M]     + OAUTH_ORIGIN
│  └─ mock/
│     ├─ index.ts                             [N]     guarda contra produção
│     ├─ roster.mock.ts                       [N]     25 tripulantes fictícios
│     └─ progressao.mock.ts                   [N]     tier fictício, 8 bosses
└─ app/_components/api-status.tsx             [R]     temporário, sai na etapa 15
```

**Sobre a camada `ui/` — 5 primitivos, e cada um se justifica por repetição real:**

| Primitivo | Usos | Justificativa |
| --- | --- | --- |
| `chapa.tsx` | nav rolada, painel de leitura, placa, painel mobile, bloco de erro, sucesso do apply (≥6) | é a regra §1.1 encapsulada; escrita à mão em 6 lugares, diverge |
| `rotulo.tsx` | sobrancelha da hero, cabeçalho de cada seção, rótulo de campo, legenda de placa, rodapé (≥8) | mesma combinação de 4 classes repetida |
| `acao.tsx` | CTA da hero, Apply da nav, submit, login, links do footer (≥5) | sólida e fantasma; precisa funcionar como `<a>` e `<button>` |
| `wordmark.tsx` | nav desktop, nav mobile, painel mobile, footer, OG (≥5) | é o **ponto de troca único** de A3 (§18.9): quando o SVG chegar, muda um arquivo |
| `marca.tsx` | marca-d'água do footer, favicon, OG (3) | mesmo motivo, para A4. Reusa a geometria do disco, não é desenho novo |

**Proibido** criar `Card`, `Container`, `Stack`, `Grid`, `Text`, `Heading`, `Badge` ou qualquer
outro primitivo sem ≥4 usos reais já existentes na página. A instrução é explícita: extrair só o
que de fato repete.

### 4.3 Responsabilidade por arquivo

Formato: **caminho** · tipo · props · dados · estados · eventos · teste.

---

**`app/layout.tsx`** · **S** · `{ children }`

Muda: (a) o comentário-contrato de §1 como **primeiro filho do `<body>`**, em HTML comment, para
sobreviver ao build; (b) troca `Geist` por `Archivo` mantendo `Geist_Mono`; (c) `<a>` de skip
link como primeiro elemento focável; (d) `<SiteNav />` e `<SiteFooter />` envolvendo `{children}`;
(e) `metadata` com `openGraph` e `twitter`.

Estrutura do body: `skip link → <SiteNav/> → <main id="conteudo"> {children} </main> → <SiteFooter/>`.
O `<main>` sai daqui e **não** pode ser repetido em `page.tsx` — hoje `page.tsx` renderiza o
próprio `<main>`; isso muda.

**Teste:** nenhum unitário. Verificação: `grep` no output de `pnpm --filter web build` pela
chave do contrato; um contrato que o build apagou é um contrato que ninguém audita.

---

**`app/page.tsx`** · **S** · sem props

Só composição, nesta ordem: `<Hero/>` `<Sobre/>` `<Roster/>` `<Apply/>`. Cada seção busca o
próprio dado. Cada uma envolvida em `<Suspense>` com fallback próprio quando fizer I/O
(hero e roster). Sem lógica, sem fetch, sem estado.

`export const metadata` fica no layout; a página não redefine título.

---

**`_components/ui/chapa.tsx`** · **S**

```ts
interface ChapaProps {
  children: React.ReactNode;
  /** 'plana' não eleva (usada em divisória); 'elevada' é o padrão. */
  nivel?: 'plana' | 'elevada';
  as?: 'div' | 'section' | 'article' | 'aside';
  className?: string;
}
```

Emite a regra §1.1: `border-t border-edge border-b border-groove bg-gradient-to-b from-surface
to-[color-mix(in_srgb,var(--color-surface)_96%,black)] rounded-[3px]`. Nada mais. Sem padding
embutido — quem usa decide.

**Teste:** nenhum. É apresentação pura.

---

**`_components/ui/rotulo.tsx`** · **S** · `{ children, as?, className? }`

`font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle`. `as` permite `p`, `span`,
`h2`, `dt`.

---

**`_components/ui/acao.tsx`** · **S**

```ts
interface AcaoProps {
  children: React.ReactNode;
  variante: 'solida' | 'fantasma';
  href?: string;            // presente → <a>; ausente → <button>
  type?: 'button' | 'submit';
  disabled?: boolean;
  'aria-describedby'?: string;
  className?: string;
}
```

Sólida: `bg-accent text-bg` com luz no topo. Fantasma: `border border-border text-fg-muted
hover:text-fg hover:border-fg-subtle`. Altura mínima **44px** em ambas. Foco: `focus-visible:
outline-2 outline-offset-2 outline-accent`.

Regra: **no máximo duas ações sólidas na página inteira** — a da hero e a de submit do Apply. A
da nav é fantasma. Se aparecer uma terceira sólida, a hierarquia quebrou.

---

**`_components/site-nav.tsx`** · **C** — detalhado em §7.

Props: `{ sessao: SessionUser | null }` (vinda do layout via `getSessionUser()`).
Estado: `rolada: boolean`, `secaoAtiva: string`, `painelAberto: boolean`.
Eventos: `scroll` (passivo, via `IntersectionObserver` nas seções, **não** listener de scroll),
clique em âncora, `Escape` fecha o painel.

**Teste:** unitário da função pura que escolhe a seção ativa dado o conjunto de entradas
observadas (`geometria`-like). O componente em si não tem teste automatizado nesta fase.

---

**`_components/instrumento/geometria.ts`** · puro, sem React

Exporta:

```ts
/** Ponto de uma detente no viewBox 400×400. */
export interface PontoDetente { x: number; y: number; angulo: number }

/** Ângulo (graus, 0 = 12h, cresce no sentido horário) da detente i de n. */
export function anguloDetente(i: number, n: number): number;

/** Converte ângulo + raio em coordenada do viewBox. */
export function polar(angulo: number, raio: number): { x: number; y: number };

/** Escolhe a dificuldade a exibir. Ver §8.4. */
export function escolherDificuldade(report: RaidProgressReport): number;

/** Escolhe a raid a exibir. Ver §8.4. */
export function escolherRaid(report: RaidProgressReport, dificuldade: number): RaidProgress | null;

/** Linha de leitura de um boss numa dificuldade. */
export function lerBoss(boss: BossProgress, dificuldade: number): LeituraBoss;
```

**Teste obrigatório — `geometria.spec.ts`, com Vitest (o `packages/shared` já usa Vitest;
`apps/web` ainda não tem runner: ver §21, etapa 5):**

| Caso | Espera |
| --- | --- |
| `anguloDetente(0, 8)` | `-135` |
| `anguloDetente(7, 8)` | `135` |
| `anguloDetente(0, 1)` | `0` (uma detente fica no topo, não na ponta) |
| `escolherDificuldade` com kills em 4 e 5 | `5` |
| `escolherDificuldade` sem kill nenhuma | maior id de `difficulties` |
| `escolherDificuldade` com `difficulties: []` | não lança; devolve valor sentinela documentado |
| `escolherRaid` com 3 raids do tier | a de maior nº de kills na dificuldade |
| `escolherRaid` empate em kills | a de `firstKillAt` mais recente |
| `escolherRaid` ignorando raid com `id === null` | nunca a escolhe |
| `lerBoss` sem `byDifficulty` para a dificuldade | `{ morto: false, pulls: 0, melhorPercentual: null }` |
| `lerBoss` com `bestPercent: null` e `kills > 0` | `morto: true`, sem inventar percentual |

---

**`_components/roster/roster.tsx`** · **S** · sem props

Busca `getRosterPublico()`. Três saídas:
`null` → bloco degradado (§10.6) · lista vazia → bloco "sem tripulação registrada" · lista →
`<RosterGrid>` **e** `<RosterTrilho>`, ambos renderizados, alternados por CSS (`hidden md:grid`
/ `md:hidden`). Renderizar os dois no DOM duplicaria os retratos: **não**. Ver §10.3 para a
solução (um só componente com classes responsivas).

---

**`_components/apply/apply-form.tsx`** · **C**

Props: `{ envioHabilitado: boolean; urlDiscord?: string }`.
Estado: `useActionState` para o resultado do submit; `Map<string, string>` de erros por campo;
`tocados: Set<string>`.
Sem dependência nova. Justificativa em §11.7.

**Teste:** unitário da função pura `validarCampo(nome, valor)` que envelopa
`createApplicationSchema.shape[nome].safeParse`. O componente não tem teste nesta fase.

---

### 4.4 O que **não** fazer na arquitetura

- Não criar `app/api/**` para nada além do callback do popup. Um `POST /api/applications` no
  Next que grave, valide regra ou chame a Blizzard viola a Regra 1.
- Não instalar biblioteca de animação, de carrossel, de formulário, de ícone ou de utilitário
  de classe. Ver §17.6 para quando uma dependência seria aceitável.
- Não importar `lib/api.ts` de Client Component. O `server-only` no topo faz o build quebrar —
  de propósito. Valores seguros no browser ficam em `lib/config.ts`.
- Não usar `use cache`. `cacheComponents` não está ligado no `next.config.ts` e ligá-lo é
  mudança de modelo de cache do app inteiro, fora do escopo desta issue. Vale o modelo
  anterior: `fetch` não é cacheado por padrão; cache explícito por chamada (§5.2).

---

## 5. Dados e contratos

### 5.1 A. O que existe hoje

| Endpoint | Guard | Schema no shared | Serve à landing? |
| --- | --- | --- | --- |
| `GET /health` | público | `healthSchema` | não (sai na etapa 15) |
| `GET /auth/battlenet` | público | — | sim, mas só em redirect completo |
| `GET /auth/battlenet/callback` | público | — | redireciona para `${WEB_URL}/interno` |
| `GET /auth/me` | — | `sessionUserSchema` | sim (estado do botão de login) |
| `POST /auth/logout` | — | — | não |
| `GET /internal/roster` | `MemberGuard` | `rosterSchema` | **não** — 401 para anônimo |
| `GET /internal/raid-progress` | `MemberGuard` | `raidProgressReportSchema` | **não** — 401 |
| `GET /internal/progress` | `MemberGuard` | `progressReportSchema` | não |

Contratos reutilizáveis do `@titan/shared` (não redeclarar):
`createApplicationSchema`, `characterInputSchema`, `CLASSES`/`wowClassSchema`,
`ROLES`/`roleSchema`, `rosterSchema`/`rosterEntrySchema`, `raidProgressReportSchema`,
`killedInDifficulty()`, `sessionUserSchema`, `canApply()`, `toSlug()`, `toCharacterKey()`.

### 5.2 B. O que o frontend pode implementar agora

Tudo que é composição, tipografia, cor, layout, movimento, acessibilidade, validação de
formulário e estados degradados. Concretamente: **as 6 seções inteiras**, com o instrumento
lendo `progressao.mock.ts` e o roster lendo `roster.mock.ts`, e com todos os estados vazios,
degradados e de carregamento já projetados e visíveis.

Política de cache das chamadas públicas quando os endpoints existirem:

| Chamada | Opção de `fetch` | Motivo |
| --- | --- | --- |
| `getProgressaoPublica()` | `next: { revalidate: 900 }` | progressão muda no máximo por noite de raid; 15 min é folgado e protege o rate limit |
| `getRosterPublico()` | `next: { revalidate: 3600 }` | o time muda por semana, não por hora |
| `getSessionUser()` | `cache: 'no-store'` | já é assim hoje; sessão nunca é cacheada |

Nenhuma delas usa `connection()`: com `revalidate`, o Next pode gerar o HTML no build e
revalidar depois, o que é o comportamento desejado. **Cuidado herdado:** o `api-status.tsx`
atual usa `connection()` porque assar "API offline" no build seria mentira permanente. A
diferença é que a progressão tem estado degradado honesto (`SEM LEITURA`), então assar e
revalidar é aceitável.

### 5.3 C. O que é placeholder

Roster (25 tripulantes fictícios) e progressão (tier fictício de 8 bosses). Estratégia completa
em §6.

### 5.4 D. O que depende do backend

| # | Dependência | Trava | Estado degradado |
| --- | --- | --- | --- |
| B1 | Progressão pública | o centro da hero | `SEM LEITURA`, projetado |
| B2 | Roster público + retrato | a seção inteira | placeholders marcados |
| B3 | `POST /applications` | envio da candidatura | envio explicitamente fechado |
| B4 | Modo popup do OAuth | o requisito de login em popup | botão inerte com aviso |
| B5 | Decisão D3 (roster público é aceitável?) | expor nomes sem login | — |

### 5.5 E. Contratos propostos

> **Estas rotas não existem.** São proposta para a issue de backend (§23). Nenhum código do
> frontend pode ser escrito assumindo que já respondem: o caminho normal é o `null`.

#### B1 — `GET /public/raid-progress`

| | |
| --- | --- |
| Auth | **nenhuma** |
| Query | `?season=<id>` opcional |
| 200 | `PublicRaidProgress` |
| 200 com corpo `null` | nenhuma season gravada ainda |
| 503 | fonte externa fora e sem cache |
| Cache no Nest | 15 min, com último valor bom servido em falha (`stale: true`) |
| Privacidade | **nenhum dado individual.** É o relatório da guilda: boss, data, pulls, percentual |
| Responsabilidade do Nest | ler Warcraft Logs, cachear, montar, **remover qualquer campo por pessoa** |
| Responsabilidade do Next | validar com Zod, degradar em `null`, nunca chamar WCL direto |

Schema sugerido para `packages/shared/src/public-progress.ts`:

```ts
/**
 * Recorte PÚBLICO da progressão. Deliberadamente menor que
 * raidProgressReportSchema: a landing não precisa de availableSeasons nem do
 * histórico por dificuldade, e mandar menos dado por padrão é o certo.
 */
export const publicBossSchema = z.object({
  encounterId: z.number().int(),
  name: z.string(),
  killed: z.boolean(),
  /** ISO. Null = ainda não morreu nesta dificuldade. */
  firstKillAt: z.string().nullable(),
  /** Pulls na dificuldade exibida. */
  pulls: z.number().int(),
  /** % de vida restante do boss no melhor wipe. Menor é melhor.
   *  Null = não existe (não houve wipe), NUNCA zero. */
  bestPercent: z.number().nullable(),
});

export const publicRaidProgressSchema = z.object({
  /** Rótulo da season como a guilda fala. */
  seasonLabel: z.string(),
  /** Nome da raid exibida no instrumento. */
  raidName: z.string(),
  /** Nome da dificuldade: "Mítico", "Heroico"… já traduzido pelo Nest. */
  difficultyName: z.string(),
  /** Id da dificuldade no WCL, para o front não reinterpretar. */
  difficultyId: z.number().int(),
  bosses: publicBossSchema.array().min(1),
  /** Outras raids do mesmo tier, só como linha de texto. */
  outrasRaids: z
    .object({ name: z.string(), killed: z.number().int(), total: z.number().int() })
    .array(),
  fetchedAt: z.string().datetime(),
  /** true = leitura falhou, isto é cache anterior. A tela rotula como velho. */
  stale: z.boolean(),
});
export type PublicRaidProgress = z.infer<typeof publicRaidProgressSchema>;
```

**Por que um schema novo e não o `raidProgressReportSchema` existente:** o interno traz
`byDifficulty` completo e `availableSeasons`, que a landing não usa e que aumentam a superfície
pública sem ganho. A escolha de raid e de dificuldade passa a ser **do Nest**, que já tem a
regra — o front não deve reimplementá-la. As funções de `geometria.ts` (§4.3) existem para o
caminho de placeholder e para o caso de o backend preferir devolver o relatório inteiro; nesse
caso, elas são a ponte, e o teste delas continua valendo.

Exemplo de resposta:

```json
{
  "seasonLabel": "Season 1 · 12.0",
  "raidName": "[nome real da raid do tier]",
  "difficultyName": "Mítico",
  "difficultyId": 5,
  "bosses": [
    { "encounterId": 3129, "name": "[boss 1]", "killed": true,
      "firstKillAt": "2026-06-11T23:14:00.000Z", "pulls": 41, "bestPercent": null },
    { "encounterId": 3130, "name": "[boss 2]", "killed": false,
      "firstKillAt": null, "pulls": 87, "bestPercent": 3.7 }
  ],
  "outrasRaids": [{ "name": "[raid 2]", "killed": 3, "total": 3 }],
  "fetchedAt": "2026-08-05T02:11:00.000Z",
  "stale": false
}
```

#### B2 — `GET /public/roster`

| | |
| --- | --- |
| Auth | **nenhuma** — condicionado à decisão D3 |
| 200 | `PublicRoster` |
| 503 | WoWAudit fora e sem cache |
| Cache no Nest | 1 h |
| Privacidade | expõe nome, realm, classe, spec, função e retrato de ~22 pessoas. **Nada de presença, loot, histórico ou rank** — Regra 7 |
| Responsabilidade do Nest | WoWAudit (quem é do time) + Raider.IO (números) + **a fonte de imagem que ele escolher** (§10.0, B5); cachear tudo |
| Responsabilidade do Next | validar, degradar, renderizar. **Não conhece a origem da imagem** e não pode inspecioná-la |

```ts
export const publicRosterEntrySchema = z.object({
  name: z.string(),      // com acento, como a Blizzard exibe — Regra 6
  realm: z.string(),
  wowClass: z.string(),  // string crua do WoWAudit, só exibição
  spec: z.string().nullable(),
  role: z.string(),
  /** Render oficial do personagem. Null quando a Blizzard não tem. */
  portraitUrl: z.string().url().nullable(),
  itemLevel: z.number().nullable(),
  mythicPlusScore: z.number().nullable(),
});

export const publicRosterSchema = z.object({
  characters: publicRosterEntrySchema.array(),
  fetchedAt: z.string().datetime(),
  /** true = Raider.IO falhou; números vieram nulos. A tela avisa e mostra o time. */
  enrichmentFailed: z.boolean(),
});
```

**Diferença para o `rosterSchema` existente:** ganha `spec` e `portraitUrl`. A alternativa —
adicionar os dois ao `rosterSchema` e reutilizá-lo — é aceitável e até preferível **se** o time
de backend quiser um schema só; nesse caso a landing usa `rosterSchema` direto e este bloco é
descartado. **Decisão do backend, não do frontend.**

#### B3 — `POST /applications`

| | |
| --- | --- |
| Auth | nenhuma (é candidatura de não-membro) |
| Request | `createApplicationSchema` (já existe no shared, marcado PROVISÓRIO — TIT-13) |
| 201 | `{ id: string, receivedAt: string }` |
| 400 | `{ message, issues: ZodIssue[] }` — o front mapeia `issues[].path` para o campo |
| 409 | candidatura duplicada recente para o mesmo personagem |
| 422 | honeypot preenchido (o Nest responde 201 falso? **não** — ver abaixo) |
| 429 | rate limit |
| Cache | nenhum |

**Honeypot — decisão `[FECHADO]`:** o campo `website` já existe no schema com `max(0)`. O Nest
deve responder **201 com id sintético** quando o honeypot vier preenchido, sem gravar. Devolver
erro ensina o bot a evitar o campo. Isso é regra de negócio e mora no Nest; o front só envia o
campo e trata a resposta normalmente.

#### B4 — Modo popup do OAuth

Contrato completo em §12.5. Resumo: `GET /auth/battlenet?mode=popup` guarda a intenção no
cookie de state; o callback, ao detectar essa intenção, redireciona para
`${WEB_URL}/oauth/callback?status=ok|erro&motivo=<slug>` em vez de `${WEB_URL}/interno`.

#### B5 — Mídia do personagem

Endpoint oficial: `GET /profile/wow/character/{realm-slug}/{character-name}/character-media`
(namespace `profile-{region}`). Devolve `assets: [{ key, value }]` com chaves `avatar`, `inset`,
`main`, `main-raw`, apontando para `render.worldofwarcraft.com`.

**Isto é uma sugestão de implementação para o backend, não um requisito do frontend.** Ver
§10.0: o front recebe `portraitUrl: string | null` e nada mais.

- Chave sugerida: **`main-raw`** (retrato sem fundo de classe) se disponível; senão `main`;
  senão `inset`; senão `null`.
- **Chamado só pelo Nest** (Regra 6), cacheado junto do roster.
- **Recomendação forte: servir a imagem do próprio domínio** (proxy com cache no Nest) em vez
  de repassar a URL do CDN externo. Três ganhos: dispensa `images.remotePatterns` no
  `next.config.ts`; mantém o cache num lugar só, que é o que a Regra 6 pede; e desacopla o
  front da fonte para sempre, de modo que trocar Blizzard por storage próprio não toque em
  `apps/web`.
- Se ainda assim o backend optar por repassar URL externa, aí — **e só aí** —
  `images.remotePatterns` ganha o host correspondente. É a única alteração de
  `next.config.ts` que esta issue pode vir a precisar, e ela é **condicional**.
- `[VERIFICAR]` as dimensões reais devolvidas pela chave escolhida e ajustar o `sizes` do
  `next/image` (§17.3).

---

## 6. Placeholders e dados temporários

> Esta seção cobre a trilha **dados** da filosofia de §2.1. As outras três trilhas estão em
> §18 (assets), §19.4 (textos) e §10.5 (imagens de conteúdo). As quatro obedecem à mesma
> regra: **nunca um buraco**.

### 6.1 Regras `[FECHADO]`

1. Localização única: `apps/web/lib/mock/`. Nenhum dado fictício em JSX, em componente, ou
   fora dessa pasta.
2. Sufixo obrigatório no arquivo: `.mock.ts`. Torna `grep -r "\.mock"` uma auditoria completa.
3. **Guarda de produção**, em `lib/mock/index.ts`, avaliada em escopo de módulo:

```ts
if (process.env.NODE_ENV === 'production') {
  throw new Error(
    'lib/mock foi importado em produção. Placeholder não vai para o ar: ' +
      'remover o import ou trocar pela chamada real da API.',
  );
}
```

   Lançar em escopo de módulo faz o `pnpm build` **falhar**, não avisar. É intencional: um aviso
   silencioso é como dado falso chega em produção.

4. Nenhum nome real de membro, Discord tag ou Battle.tag — `CLAUDE.md`, seção de segredos, é
   explícito: nada de fixture com nome real de pessoa.
5. Enquanto houver mock ativo, a seção mostra uma **tarja de desenvolvimento** visível
   (`role="note"`, fundo `highlight-soft`, texto "dados de desenvolvimento"). Não é seção nova;
   é um aviso, e ele some junto com o mock.
6. Substituição pela API: cada seção já chama `getRosterPublico()` / `getProgressaoPublica()`.
   O mock entra **só** no ramo `null`, e só fora de produção:

```ts
const dado = (await getRosterPublico()) ?? (await carregarMockSeDev());
```

7. Critério de remoção: quando o endpoint correspondente responder em `dev`, apaga-se o arquivo
   `.mock.ts`, o ramo de fallback e a tarja, em um commit só. A etapa 15 do plano cobre isso.

### 6.2 Cobertura obrigatória do `roster.mock.ts`

**50 entradas** (o teto que a seção precisa suportar — ver §10.4), cobrindo **todos** estes
casos ao mesmo tempo:

| Caso a cobrir | Como |
| --- | --- |
| Nome curtíssimo | 2 caracteres |
| Nome no limite | 12 caracteres (o máximo do `characterRefSchema`) |
| Acento preservado | ao menos 3 entradas com diacrítico |
| **Colisão da Regra 6** | duas entradas com o mesmo nome-base e acentos diferentes, no mesmo realm; se a chave de React for só `name`, o React reclama de chave duplicada — é o teste |
| Realms diferentes | ao menos 4 realms |
| Todas as 13 classes | pelo menos uma vez cada |
| 4 funções | tank, healer, melee, ranged |
| Spec longa | ex.: uma spec de 20+ caracteres |
| Sem retrato | 2 entradas com `portraitUrl: null` |
| Sem ilvl | 1 entrada com `itemLevel: null` |
| Sem score | 2 entradas com `mythicPlusScore: null` |
| Sem nenhum número | 1 entrada com os dois nulos |

Além do array completo, exportar um recorte por quantidade da matriz de §10.4, para a
estabilidade do layout ser verificável sem editar código:

```ts
export const ROSTER_MOCK_50 = [...];

/** Recortes na ordem exata da matriz de §10.4. */
export const ROSTER_MOCK = {
  1: ROSTER_MOCK_50.slice(0, 1),
  2: ROSTER_MOCK_50.slice(0, 2),
  5: ROSTER_MOCK_50.slice(0, 5),
  8: ROSTER_MOCK_50.slice(0, 8),
  12: ROSTER_MOCK_50.slice(0, 12),
  16: ROSTER_MOCK_50.slice(0, 16),
  20: ROSTER_MOCK_50.slice(0, 20),
  30: ROSTER_MOCK_50.slice(0, 30),
  50: ROSTER_MOCK_50,
} as const;
```

**Retratos no mock `[FECHADO]` — mudou nesta revisão.** A versão anterior mandava `portraitUrl:
null` em todas as entradas, o que deixaria a seção inteira sem imagem durante o
desenvolvimento. Isso viola §2.1. Regra nova:

- **48 das 50 entradas** recebem o **retrato editorial provisório** (A7, §18.8) — um retrato
  gerado por código, determinístico a partir de `${realm}/${name}`, na linguagem visual do
  roster. A seção fica cheia, ritmada e fotografável desde o primeiro dia.
- **2 entradas** ficam com `portraitUrl: null`, para o estado de ausência (§10.5) continuar
  sendo exercitado — ele é o que mais aparece na vida real e não pode ser construído por
  último.

### 6.3 Cobertura do `progressao.mock.ts`

Exportar quatro cenários nomeados, para o instrumento ser construído contra todos:

| Export | Cenário | O que exercita |
| --- | --- | --- |
| `PROGRESSAO_MOCK_PARCIAL` | 8 bosses, 6 mortos, o 7º com `bestPercent: 3.7` | o estado normal |
| `PROGRESSAO_MOCK_ZERO` | 8 bosses, 0 mortos, pulls > 0 | agulha em repouso, `0/8` |
| `PROGRESSAO_MOCK_COMPLETA` | 8 de 8 | anel completo |
| `PROGRESSAO_MOCK_TRES_BOSSES` | 3 bosses | prova que o arco não é fixo em 8 |

O último não é capricho. O `CLAUDE.md` registra que a season corrente tem **três raids** no
mesmo tier ("VS / DR / MQD", 9 bosses distribuídos) e que a próxima season começa em 18/08/2026
— dentro de duas semanas desta especificação. **O número de detentes é dado, nunca constante.**

---
## 7. Navegação

### 7.1 O conceito: régua de aferição `[FECHADO]`

A navbar não é uma barra colocada sobre o site. É a **régua** do instrumento: um trilho fino
cuja borda inferior carrega *ticks* — um por seção — e o tick da seção em que o visitante está
fica **mais longo e aceso**. O scroll move a marcação, como um cursor de escala.

Isso resolve três coisas de uma vez: pertence ao universo visual, indica a seção atual sem
pílula/sublinhado/pill genérico, e é barato (CSS + `IntersectionObserver`).

### 7.2 Anatomia desktop (≥1024px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [wordmark 22px]        SOBRE  TRIPULAÇÃO  CANDIDATURA      [entrar] [▪] │
│  ─────────────────────────┴────────┴────────────┴───────────────────────  │  ← régua 1px
│                           ╹        ╻            ╻                         │  ← ticks
└──────────────────────────────────────────────────────────────────────────┘
```

| Item | Especificação |
| --- | --- |
| Altura | 64px |
| Largura interna | `max-width: 1120px`, centralizada, com o padding lateral de §3.4 |
| Wordmark | SVG, altura 22px, `aria-label="Titan Inc — ir para o topo"`, link para `#topo` |
| Âncoras | 3 links (`#sobre`, `#tripulacao`, `#candidatura`), `rotulo.tsx` (mono 11px caixa alta tracked) |
| Régua | `border-bottom: 1px solid var(--color-border)`, largura total do trilho |
| Tick inativo | 1×5px, `--color-border`, centralizado sob o rótulo |
| Tick ativo | 1×11px, `--color-accent`, e o rótulo passa a `--color-fg` |
| Entrar | `acao` variante fantasma (§12) |
| Apply | `acao` variante fantasma, texto "Candidatar-se". **Não é sólida** — a sólida é a da hero |

**Ticks: por que não sublinhado.** Um sublinhado sob o link é o padrão da categoria e não diz
nada sobre o produto. O tick sai da borda da régua, não do texto — é uma marca de escala,
lida como medição. Custo idêntico.

### 7.3 Estados de rolagem

| Estado | Gatilho | Aparência |
| --- | --- | --- |
| **Sobre a hero** | `scrollY < 24` | fundo transparente; régua em `--color-border` a 40% de opacidade; wordmark e rótulos em `--color-fg` puro, legíveis porque o scrim da hero (§18.4) garante o piso de luminância nos 96px superiores |
| **Rolada** | `scrollY ≥ 24` | vira **chapa**: `--color-surface` opaco (sem blur), luz no topo, sulco na base; régua em `--color-border` cheio |

Transição: `background-color` e `border-color`, 180ms `ease-out`. **Só isso.** Sem mudança de
altura, sem encolher o wordmark, sem esconder/mostrar ao rolar para cima — nav que muda de
altura empurra o conteúdo e é o oposto de estável.

**Posicionamento:** `position: sticky; top: 0; z-index: 50`. Não `fixed` — `sticky` mantém o
fluxo e evita o pulo de layout.

### 7.4 Indicação de seção ativa

`IntersectionObserver` sobre `#sobre`, `#tripulacao`, `#candidatura`, com
`rootMargin: '-64px 0px -55% 0px'` — o topo desconta a altura da nav e o fundo garante que a
seção só é "ativa" quando ocupa a metade superior da tela.

Regras:

- Nenhuma seção intersectando → nenhum tick aceso (estado do topo da página). **Não** acender
  `#sobre` por padrão: mentir sobre a posição é pior que não indicar.
- Mais de uma intersectando → vence a de maior `intersectionRatio`; empate → a que aparece
  primeiro no DOM. A função de decisão é pura e testável (§4.3).
- **Não usar listener de `scroll`** para isso. `IntersectionObserver` não roda no main thread a
  cada frame.
- O link ativo recebe `aria-current="page"` — mesmo padrão já usado em
  `app/interno/_components/sidebar-nav.tsx`.

### 7.5 Mobile (<1024px) `[FECHADO]`

**Decisão, e a justificativa que a instrução exige.** Foram avaliadas três soluções:

| Solução | Veredito |
| --- | --- |
| Hambúrguer nu (☰) | Rejeitado — **não por princípio**, mas porque um ícone sozinho não diz onde a pessoa está, e a régua já resolve isso no desktop. Perder a indicação de posição no mobile é regressão. |
| Barra inferior fixa | Rejeitado — consome 56px permanentes de uma tela de 640px de altura, competindo com o conteúdo, e no iOS briga com a barra do Safari |
| **Disclosure rotulado com a seção atual** | **Escolhido** |

O trilho mobile carrega: **wordmark** (18px) · **botão de disclosure rotulado** · **entrar**
(ícone + rótulo acessível).

O disclosure não é um hambúrguer: seu rótulo visível é **o nome da seção em que a pessoa está**,
com o tick aceso à esquerda e um chevron de 10px à direita.

```
┌───────────────────────────────────────────┐
│ [wordmark]   ╹ TRIPULAÇÃO ⌄       [entrar]│
│ ─────────────────────────────────────────  │
└───────────────────────────────────────────┘
```

Assim o componente informa **e** convida, em vez de só convidar. No topo da página, antes de
qualquer seção estar ativa, o rótulo é `SEÇÕES`.

**Painel aberto** (`nav-painel.tsx`): não é drawer lateral nem dropdown. É uma **chapa de tela
cheia** que desce do trilho, com as 3 seções como linhas regradas (48px de altura cada, tick à
esquerda), separadas por `--color-border`, e a ação "Candidatar-se" ao final como fantasma.

| Aspecto | Especificação |
| --- | --- |
| Abertura | `translateY(-8px) → 0` + `opacity 0 → 1`, 200ms `cubic-bezier(.16,1,.3,1)` |
| Foco | ao abrir, foco no primeiro item; `Tab` circula dentro do painel (focus trap) |
| Fechamento | `Escape`, clique fora, clique em item, ou navegação |
| Ao fechar | foco **volta** ao botão de disclosure |
| ARIA | botão com `aria-expanded`, `aria-controls`; painel com `id`, `role="dialog"`, `aria-label="Seções da página"` |
| Scroll do body | travado enquanto aberto (`overflow: hidden` no `<html>`), restaurado ao fechar |
| Reduced motion | sem translate; só `opacity`, 0ms |

**Em 320px:** o rótulo do disclosure trunca para o tick + chevron, mantendo `aria-label` com o
nome completo da seção. O "entrar" vira só ícone com `aria-label`. Alvos permanecem ≥44px.

### 7.6 Casos-limite

| Caso | Comportamento |
| --- | --- |
| Tela muito larga (≥1920) | O trilho é full-bleed, o **conteúdo** dele permanece em 1120px centralizados. Nav esticada até 1920 desmonta a relação com o resto da página |
| Viewport muito baixo (≤600px de altura, ex.: mobile landscape) | Altura da nav cai para 52px; o painel mobile ganha `overflow-y: auto` e `max-height: 100dvh` |
| Imagem da hero não carregou | A nav continua legível: o `--color-deep` do `campo-profundo.tsx` é fundo CSS e pinta antes de qualquer imagem. **A legibilidade da nav nunca depende de imagem** |
| Sem JavaScript | Os links de âncora funcionam (é HTML). O scroll-spy não acende ticks. O painel mobile não abre → o `<nav>` mobile renderiza os 3 links em uma linha rolável horizontalmente por padrão, e o JS os substitui pelo disclosure. Ver §16.11 |
| Reduced motion | Sem transição de abertura; a mudança de estado da nav vira instantânea |
| `prefers-contrast: more` | Régua e ticks passam a `--color-fg-subtle`; tick ativo ganha 2px |

### 7.7 Skip link

Primeiro elemento focável do `<body>`, antes da nav. Invisível até receber foco; ao focar,
aparece como chapa no canto superior esquerdo, `z-index: 100`. Texto: `Pular para o conteúdo`.
Destino: `#conteudo` no `<main>`.

---

## 8. Hero e instrumento

### 8.1 Composição desktop (≥1280px)

```
 ╭─ full-bleed: campo de profundidade + (futura) imagem + scrim ────────────╮
 │                                                                          │
 │   ┌─ col 1-5 ──────────────────┐          ┌─ col 7-12 ───────────────┐   │
 │   │ [wordmark 180px]           │          │                          │   │
 │   │                            │          │        ╭─────────╮       │   │
 │   │ SEASON 1 · 12.0            │          │      ╭─┤ DISCO   ├─╮     │──▶ sangra
 │   │                            │          │      │ │ 440px   │ │     │   │
 │   │ Endgame sem abrir mão      │          │      ╰─┤  6/8    ├─╯     │   │
 │   │ da vida real               │◀── o disco sobrepõe a borda direita  │   │
 │   │                            │    do h1 em ~40px                    │   │
 │   │ Uma linha de corpo.        │          │        MÍTICO            │   │
 │   │                            │          │                          │   │
 │   │ [ CANDIDATAR-SE ]          │          │  [painel de leitura]     │   │
 │   └────────────────────────────┘          └──────────────────────────┘   │
 │                                                                          │
 │   Aferido no Warcraft Logs · 05/08/2026                                  │
 ╰──────────────────────────────────────────────────────────────────────────╯
```

| Item | Especificação |
| --- | --- |
| Altura | `min-height: 100svh` com `max-height: 900px`; **nunca** `100vh` (a barra do iOS quebra) |
| Colunas | texto em 1–5, instrumento em 7–12 |
| Sobreposição | o disco sobrepõe a coluna de texto em ~40px e sangra ~60px além da borda direita do container. **Função:** cria a camada e força a ordem de leitura manchete → instrumento |
| Wordmark | 180px de largura, no topo da coluna de texto. **Não** é gigante: a marca não é a mensagem |
| Ação | uma só, sólida, âncora para `#candidatura` |
| Procedência | `xs`, `fg-subtle`, no rodapé do viewport, com link externo |

**Ordem do DOM (importa para leitor de tela e para o mobile):** wordmark → sobrancelha → `h1` →
parágrafo → ação → **instrumento** → procedência. No desktop o instrumento é reposicionado por
grid; no mobile ele sobe por `order` (§8.7).

### 8.2 O instrumento — construção `[FECHADO]`

SVG único, `viewBox="0 0 400 400"`, centro em `(200, 200)`. Escala por CSS (`width`), nunca por
atributo. Camadas de dentro para fora:

| # | Camada | Geometria | Cor |
| --- | --- | --- | --- |
| 1 | Campo do mostrador | círculo `r=176` | `--color-deep`, com gradiente radial deslocado para o ponto de luz (cx 38%, cy 28%) até `--color-deep-lit` a 18% |
| 2 | Bisel externo | anel `r=190` a `r=168` | traço `--color-border` 1px; arco superior-direito com `--color-edge` para pegar a luz |
| 3 | Texto do bisel | `textPath` no arco superior, `r=179` | mono 11px tracked, `--color-fg-subtle`. Conteúdo: nome da raid |
| 4 | **Detentes** | uma por boss, ver §8.3 | ver §8.3 |
| 5 | Agulha | do centro até `r=118`, largura 2px, com cauda de contrapeso `r=-22` | `--color-accent` |
| 6 | Cubo | círculo `r=16`, com anel de 1px | `--color-surface` + `--color-edge` |
| 7 | Leitura | **fora do SVG**, em HTML | ver §8.5 |

**O arco é de 270°, não 360°.** Vai de −135° a +135° (0° = 12h, crescendo no sentido horário),
deixando uma abertura de 90° na base onde a leitura numérica se apoia. É como mostradores reais
se comportam, e é o que impede a peça de virar um "donut chart".

Fórmulas, para não haver interpretação:

```ts
// graus, 0 = 12h, cresce no sentido horário
export function anguloDetente(i: number, n: number): number {
  if (n <= 1) return 0;                 // uma detente só fica no topo
  return -135 + (270 * i) / (n - 1);
}

export function polar(angulo: number, raio: number) {
  const r = (angulo * Math.PI) / 180;
  return { x: 200 + raio * Math.sin(r), y: 200 - raio * Math.cos(r) };
}
```

### 8.3 A detente

| Estado | Traço radial | Lâmpada | Cor |
| --- | --- | --- | --- |
| **Boss vencido** | de `r=138` a `r=160`, 2px | círculo `r=4` em `r=168` | `--color-accent` |
| **Boss não vencido** | de `r=148` a `r=160`, 1px | nenhuma | `--color-border` |
| **Boss em progressão** (não vencido, é o de menor `bestPercent`) | de `r=145` a `r=160`, 2px | anel vazado `r=4`, 1px | `--color-highlight` |
| **Selecionado** (hover/foco) | idem ao seu estado | + anel externo `r=7`, 1px | `--color-fg` |

**Acessibilidade sem depender de cor `[FECHADO]`.** Vencido e não-vencido diferem por
**comprimento do traço** (22 vs 12 unidades), **espessura** (2 vs 1) e **presença da lâmpada** —
três sinais não-cromáticos. Quem não distingue turquesa de cinza ainda lê o mostrador.

### 8.4 Escolha de raid e dificuldade

Necessária porque **uma season pode ter mais de uma raid** — o `CLAUDE.md` registra que a atual
tem três no mesmo tier do Warcraft Logs. Se o backend implementar o contrato B1, a escolha é
dele e o front só renderiza. Enquanto for placeholder, ou se o backend devolver o relatório
interno inteiro, vale este algoritmo, implementado em `geometria.ts` e coberto por teste:

```
1. dificuldade = maior id em `difficulties` que tenha ≥1 kill em alguma raid.
   Se nenhuma dificuldade tem kill → maior id de `difficulties`.
   Se `difficulties` está vazio → sem leitura (§8.6).

2. raid = entre as raids com `id !== null`:
     máximo de killedInDifficulty(raid, dificuldade).killed
     empate → firstKillAt mais recente entre seus bosses
     empate → primeira na ordem do array

   Raids com `id === null` são o balde "nunca pullado" e nunca são escolhidas.

3. As demais raids do tier viram uma linha de texto sob o disco:
   "NOME 6/6 · NOME 3/3"  — texto, não um segundo instrumento.
```

### 8.5 Leitura textual — obrigatória, e é o ponto

> **O visitante não pode precisar interpretar a metáfora para entender a progressão.**

Sob o cubo, dentro da abertura de 90°, em **HTML** (não em SVG — precisa ser selecionável, e é o
que o leitor de tela lê primeiro):

```
 6/8            ← Archivo, 54px, tabular-nums, --color-fg
 MÍTICO         ← mono 11px caixa alta tracked, --color-accent
```

Abaixo do disco: o **painel de leitura** — uma `chapa` de **altura fixa** (128px desktop / 108px
mobile). Altura fixa é obrigatória: um painel que cresce ao selecionar boss causa layout shift
na hero, que é onde ele mais custa.

Conteúdo padrão (nada selecionado): o **último boss vencido**, para o painel nunca começar
vazio.

| Campo | Boss vencido | Boss não vencido |
| --- | --- | --- |
| Nome | `Archivo 22px, --color-fg` | idem |
| Linha 1 | `MORTO EM 11/06/2026` (mono 11px, accent) | `MELHOR 3,7%` (mono 11px, highlight) |
| Linha 2 | `41 pulls` (mono 11px, fg-subtle) | `87 pulls` |
| Ausente | se `firstKillAt` é null mas `killed` é true → omite a linha, não inventa data | se `bestPercent` é null → `SEM WIPE REGISTRADO`, nunca `0%` |

`bestPercent` é **% de vida restante do boss no melhor wipe — menor é melhor**. Formatar com
uma casa decimal em pt-BR (`3,7%`) e legendar com `title`/`aria` explicando o sentido, porque
"melhor 3,7%" é ambíguo para quem não é do jogo.

### 8.6 Estados do instrumento `[FECHADO]`

Todos projetados. Nenhum é "o elemento some".

| Estado | Gatilho | Render |
| --- | --- | --- |
| **Carregando** | `<Suspense>` da seção | Disco completo desenhado, detentes todas no estado "não vencido", sem agulha, leitura `—/—` e rótulo `AFERINDO…`. Sem shimmer, sem spinner. **Mesmas dimensões do estado final** → zero CLS |
| **Sem leitura** | API devolveu `null` (fora do ar, sem endpoint, sem season gravada) | Disco apagado, agulha em repouso (−143°), leitura `—/—`, rótulo `SEM LEITURA`, e uma linha `xs`: "A aferição não respondeu. Nenhum número é melhor que um número errado." |
| **Sem kills** | `killed === 0` em todos | Todas as detentes no estado não-vencido, a de menor `bestPercent` em `--color-highlight`, agulha em repouso, leitura `0/8` |
| **Parcial** | o normal | §8.2–8.5 |
| **Completo** | todos vencidos | Todas acesas, agulha no máximo, e o bisel ganha um arco contínuo de 1px em `--color-accent` a 40% entre a primeira e a última detente. **Sem glow, sem confete, sem pulso** |
| **Velho** (`stale: true`) | leitura falhou, isto é cache | Render normal + rótulo `LEITURA DE <data>` em `--color-highlight`. Número velho apresentado como atual é pior que número velho rotulado como velho |
| **Uma raid, 1–3 bosses** | tier pequeno | O arco continua 270°; com `n=1` a detente única fica a 0° (topo) |
| **Muitos bosses (>12)** | tier grande | Abaixo de 12 unidades de espaçamento angular, as lâmpadas se tocam: reduzir a lâmpada para `r=3` e o traço para 1.5px acima de 12 detentes. `[VERIFICAR]` visualmente com o mock de 3 e um mock ad-hoc de 14 |

### 8.7 Interação

**Alvos.** As detentes **não** são elementos SVG interativos. São `<button>` HTML posicionados
por cima, num container `position: relative` de mesma proporção:

```
left = (polar(angulo, 158).x / 400) * 100 + '%'
top  = (polar(angulo, 158).y / 400) * 100 + '%'
transform: translate(-50%, -50%)
width/height: 44px  (mínimo de toque; o alvo visual é menor)
```

O SVG inteiro recebe `aria-hidden="true"`. Os botões carregam toda a semântica. Isso dá foco,
teclado, `aria-pressed` e alvo de toque de graça, sem hack de `tabindex` em `<g>`.

| Entrada | Comportamento |
| --- | --- |
| Hover (ponteiro fino) | seleciona; ao sair, volta ao padrão |
| Foco por teclado | seleciona; `Tab` percorre as detentes na ordem da raid |
| `Enter`/`Espaço` | fixa a seleção (`aria-pressed="true"`); repetir solta |
| `←` / `→` | move entre detentes sem sair do grupo (roving tabindex opcional — se implementado, só uma detente no `Tab`) |
| Toque | tap seleciona e fixa; tap fora solta |
| `Escape` | solta a seleção, volta ao padrão |

`aria-label` de cada botão, completo e sem depender de cor:
`"Boss 3 de 8: [nome]. Vencido em 11 de junho de 2026, 41 pulls."` ou
`"Boss 7 de 8: [nome]. Não vencido. Melhor tentativa: 3,7% de vida restante, 87 pulls."`

O painel de leitura é `aria-live="polite"` — a mudança é anunciada sem roubar o foco.

### 8.8 Composição mobile (<768px) `[FECHADO]`

**Inversão deliberada: o instrumento vem ANTES do `h1`.** No mobile o primeiro viewport cabe
uma coisa só, e a prova ganha da retórica. Ordem:

```
sobrancelha (SEASON 1 · 12.0)
     ↓
DISCO 280px, centralizado
     ↓
6/8  MÍTICO
     ↓
painel de leitura (altura fixa 108px)
     ↓
h1 (40px, 3 linhas)
     ↓
parágrafo
     ↓
[ CANDIDATAR-SE ]  ← largura total
     ↓
procedência
```

O wordmark **não** se repete na hero mobile — já está na nav a 18px, e repetir come o viewport.

Fundo: composição própria em retrato (§18.3), **não** o recorte do desktop.

`min-height` da hero mobile: `auto`, não `100svh`. Forçar altura de tela empurra o `h1` para
fora quando a fonte do sistema está aumentada.

---
## 9. About Us

### 9.1 Função

É a **passagem quieta** que a hero densa exige. Não é uma seção de venda; é o respiro que faz o
roster seguinte ter impacto. Se ganhar cards, ícones ou colunas, o ritmo da página inteira
morre — é a razão de existir dela.

### 9.2 Composição `[FECHADO]`

```
 ┌─ col 1-2 ─┬─ col 4-9 ──────────────────────────────────────┐
 │           │                                                │
 │  2009     │  Texto grande, 22px, entrelinha 1.6,           │
 │  ─────    │  no máximo 34ch de largura, 2 a 3 parágrafos.  │
 │  5H       │                                                │
 │  SEMANA   │                                                │
 │  ─────    │                                                │
 │  TER·QUI  │                                                │
 │  21:00    │                                                │
 │           │                                                │
 └───────────┴────────────────────────────────────────────────┘
     ↑ marginália gravada                    ↑ a passagem
```

| Item | Especificação |
| --- | --- |
| Transição da hero | A hero termina em `--color-deep`; o About começa em `--color-bg`. A junção é uma régua de 1px em `--color-border` cruzando a largura total. **Sem gradiente de transição** |
| Título | `h2` visualmente oculto? **Não** — `h2` real, `2xl` (40px), curto, alinhado com a coluna de texto |
| Corpo | `lg` (22px), `--color-fg-muted`, `max-width: 34ch`, 2–3 parágrafos |
| Marginália | 3 fatos, cada um: rótulo mono 11px em `--color-fg-subtle` + valor em Archivo 22px `--color-fg`, separados por régua de 1px. Alinhados ao topo do primeiro parágrafo, não centralizados |
| Densidade | a seção mais vazia da página. Padding vertical de 160px (desktop) e nada mais |
| Fundo | `--color-bg` chapado. É o único ponto da página que **não** tem chapa nem campo |

**Mobile (<768):** a marginália vira uma faixa **horizontal acima** do texto — três células
separadas por régua vertical de 1px, cada uma com rótulo em cima e valor embaixo. Não vira lista
empilhada (comeria meia tela) e não some (são os fatos duros da guilda).

### 9.3 Conteúdo `[BLOQUEADO]`

Não inventar história, data, conquista, valor ou número. Ver §19 para o inventário. O que existe
hoje na landing (`app/page.tsx`) e pode ser reaproveitado **porque já estava publicado**:

- "Guilda de raid e Mythic+ desde 2009"
- "Cinco horas de raid por semana"
- "21:00 — 23:30, terças e quintas"
- "Presença nos horários marcados" / "Performance purple+ de parse"
- "Ambiente seguro e divertido, com gente de perfis bem diferentes"

Isso cobre a marginália inteira e dá base a um parágrafo. **Faltam 1–2 parágrafos na voz da
guilda** (§19, C1). Enquanto não chegam, o texto provisório fica marcado no código com
`{/* [PROV] TIT-xx */}` e a etapa 15 exige a troca.

**Proibido:** nome de oficial (o repositório é público, e o `app/page.tsx` atual registra que
essa remoção foi deliberada em relação ao site antigo).

---

## 10. Roster

### 10.0 Premissa de dados `[FECHADO]` — mudou nesta revisão

> **O frontend não conhece a origem das fotografias.**
>
> As imagens do roster **são servidas pelo backend da aplicação**. Se o Nest as obtém de uma
> API oficial da Blizzard, de um bucket próprio, de upload manual da liderança ou de um proxy
> com cache é **decisão e responsabilidade dele** — e pode mudar sem que uma linha do frontend
> mude junto.

O que o frontend assume, e só isso:

```
Recebe uma coleção ARBITRÁRIA de membros.
Cada membro tem metadados de texto e, opcionalmente, uma URL de imagem.
A coleção pode ter qualquer tamanho, inclusive 0 e 1.
```

Consequências arquiteturais, todas obrigatórias:

| Antes (revisão 1.0) | Agora |
| --- | --- |
| A seção dependia do endpoint `character-media` da Blizzard | Nenhuma dependência de API externa é assumida em lugar nenhum do frontend |
| `next.config.ts` ganharia `remotePatterns` para `render.worldofwarcraft.com` | **Só é necessário se** o backend devolver URL de host externo. Se ele servir do próprio domínio (proxy ou storage próprio — **o recomendado**), nenhuma mudança de config é necessária. Ver §17.3 |
| Layout dimensionado para 8–25 membros | Layout resiliente de **1 a 30**, sem ajuste manual (§10.4) |
| Retratos ausentes durante o desenvolvimento | Retrato editorial provisório (A7, §18.8) desde o primeiro dia |

O tipo que o frontend consome permanece o de §5.5 (`publicRosterEntrySchema`): `portraitUrl` é
`string().url().nullable()` e nada mais. **Nenhum componente pode inspecionar o host da URL,
derivar variantes, montar caminho de CDN ou assumir dimensão de origem.**

### 10.1 Solução escolhida e por quê `[FECHADO]`

**Grid de placas verticais ≥768px · trilho horizontal com snap <768px.**

| Faixa | Estrutura | Justificativa |
| --- | --- | --- |
| ≥1280 | grid até 5 colunas | 5 é o teto, não o valor fixo: a contagem de colunas é **derivada do número de membros** (§10.4) para que 1, 2 e 5 membros não gerem uma fileira mutilada. Com o time cheio, mantém a seção proporcional ao fato de que a tripulação **é** a guilda |
| 1024–1279 | grid 4 colunas | placa ~200px de largura, retrato ainda com presença |
| 768–1023 | grid 3 colunas | idem |
| <768 | **trilho horizontal com snap** | **Não é economia de espaço.** A 360px, um grid 2-up dá ~160px de largura de placa e o retrato perde toda presença — e o conceito depende da presença do retrato. O trilho mantém a placa em ~260px e transforma navegar em *folhear fichas de tripulação*, que é um gesto narrativo, não um atalho de layout |

Rejeitados: carrossel no desktop (esconde membros sem motivo), grid assimétrico (hierarquiza
pessoas que são iguais), paginação (interação a mais para 25 itens), agrupamento por função
(divide o time em castas na página pública).

**Como a seção evita parecer tabela/dashboard/template de esports:** o retrato ocupa 70% da
placa e é o elemento dominante; os números vivem numa régua fina na base, em 11px, sem rótulo
colorido; não há coluna, cabeçalho, ordenação, filtro nem badge; a placa não flutua nem levanta.

### 10.2 A placa `[FECHADO]`

```
┌──────────────────────┐  ← luz no topo (--color-edge)
│                      │
│      RETRATO         │  proporção 3:4, object-fit: cover,
│      (3:4)           │  object-position: top center
│                      │
├──────────────────────┤  ← régua 1px --color-border
│ Nomedoperso          │  Archivo 17px, --color-fg
│ azralon              │  mono 11px, --color-fg-subtle
│ Priest · Discipline  │  mono 11px, --color-fg-muted
├──────────────────────┤  ← régua 1px
│ 293,06        3.412,1│  mono 11px tabular, --color-fg
└──────────────────────┘  ← sulco na base (--color-groove)
   ▏ hairline de 2px na borda esquerda, na cor da classe
```

| Elemento | Regra |
| --- | --- |
| Chave React | **`${realm}/${name}`** — Regra 6. Nome sozinho colide e o React reclama; o mock (§6.2) cobre exatamente esse caso |
| Cor de classe | **hairline de 2px na borda esquerda apenas.** Nunca preenchimento, nunca texto colorido, nunca badge. É assim que a classe entra sem virar neon |
| Altura | fixa por breakpoint, para o grid não ficar irregular: 340px (≥1280) · 320px (1024–1279) · 300px (768–1023) · 360px (trilho) |
| Proporção do retrato | 3:4, `aspect-ratio` no container. Retratos de origens diferentes são **recortados**, não deformados |
| Nome longo | `text-overflow: ellipsis`, uma linha, com `title` completo |
| Realm | mantido — Regra 6 exige o par nome + realm na tela, não só na chave |
| Métricas futuras | a régua da base é um grid de 2 células hoje; comporta 3 sem mudar altura |
| Hover/foco | a borda superior clareia de `--color-edge` para 12% e os numerais passam de `fg-muted` a `fg`. **Sem `translateY`, sem sombra, sem escala** |
| Interatividade | a placa **não é link** nesta fase. Perfil individual é área interna (Regra 7). Logo, sem `tabindex`, sem `role` |

### 10.3 Grid e trilho no mesmo componente

Renderizar duas listas e esconder uma por CSS duplicaria até 30 retratos no DOM. **Não fazer.**
Um único `<ul>` com classes responsivas:

```
<ul
  style={{ '--colunas-md': c3, '--colunas-lg': c4, '--colunas-xl': c5 }}
  class="
    flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4
    md:grid md:gap-5 md:overflow-visible md:px-0
    md:[grid-template-columns:repeat(var(--colunas-md),minmax(0,1fr))]
    lg:[grid-template-columns:repeat(var(--colunas-lg),minmax(0,1fr))]
    xl:[grid-template-columns:repeat(var(--colunas-xl),minmax(0,1fr))]
  "
>
```

Onde `c3 = colunas(total, 3)`, `c4 = colunas(total, 4)` e `c5 = colunas(total, 5)`, calculados
no servidor pela função pura de §10.4. **Não** usar `grid-cols-3/4/5` fixos: com 2 membros isso
produz a fileira mutilada que §10.4 proíbe.

Cada `<li>`: `w-[68vw] max-w-[280px] shrink-0 snap-start md:w-auto md:max-w-[240px]` — o
`max-width` no grid é o que impede a placa de esticar quando há 1 ou 2 membros (§10.4.1).

O trilho é CSS puro — `overflow-x: auto` + `scroll-snap`. **Sem biblioteca, sem JavaScript.**
Consequências, todas desejadas: funciona sem JS, funciona com teclado (o container recebe foco
e as setas rolam), funciona com touch nativo, e respeita `prefers-reduced-motion` porque o
`scroll-behavior: smooth` fica dentro de uma media query.

Como o usuário percebe que há mais: a última placa visível é cortada pela borda (o `68vw`
garante que a próxima apareça pela metade), e há um `scroll-hint` — uma régua de 1px sob o
trilho com um segmento aceso proporcional à posição, atualizado só por CSS
(`scroll-timeline`) `[VERIFICAR]` suporte; se não houver, some, e o corte da placa já basta.

Posição inicial: primeira placa. Estado final: última placa alinhada à direita com o padding
preservado (`scroll-padding-inline`).

### 10.4 Estabilidade de 1 a 50+ `[FECHADO]` — reescrito nesta revisão

O layout tem de funcionar **sem nenhum ajuste manual** em qualquer contagem. O problema real
não é o número grande: é o **número pequeno**. Um grid fixo de 5 colunas com 2 membros produz
duas placas encolhidas num canto e três buracos — exatamente a "linha quebrada" que a decisão
proíbe.

**Regra: as colunas são derivadas da contagem, com teto por breakpoint.**

```ts
// Puro, testável, sem media query em JS.
// O valor vira uma classe/estilo de grid no Server Component.
const colunas = (total: number, teto: number) => Math.max(1, Math.min(total, teto));
```

Tetos por breakpoint: **5** (≥1280) · **4** (1024–1279) · **3** (768–1023) · trilho (<768).

Aplicado com `grid-template-columns: repeat(var(--colunas), minmax(0, 1fr))`, onde `--colunas`
é uma custom property inline calculada no servidor e sobrescrita por media query com o teto de
cada faixa. **`minmax(0, 1fr)` é obrigatório** — `1fr` puro deixa o conteúdo estourar a coluna.

**Matriz resultante (≥1280, teto 5):**

| Total | Colunas | Fileiras | Última fileira | Observação |
| --- | --- | --- | --- | --- |
| **1** | 1 | 1 | cheia | placa em largura de coluna única, **não esticada** (§10.4.1) |
| **2** | 2 | 1 | cheia | |
| **5** | 5 | 1 | cheia | |
| **8** | 5 | 2 | 3 | |
| **12** | 5 | 3 | 2 | |
| **16** | 5 | 4 | 1 | fileira de 1 — aceitável, ver abaixo |
| **20** | 5 | 4 | cheia | |
| **30** | 5 | 6 | cheia | |
| **50** | 5 | 10 | cheia | ver §10.4.2 sobre comprimento |

#### 10.4.1 Placa nunca estica

Com 1 ou 2 membros, o grid tem menos colunas — mas a placa **mantém a mesma largura máxima**
que teria no grid cheio (`max-width: 240px` em ≥1280, proporcional nos demais), e o conjunto é
alinhado à esquerda da coluna de conteúdo.

Sem isso, 1 membro vira uma placa de 1120px de largura com um retrato deformado no meio — o
antipadrão mais óbvio dessa seção. **`object-fit: cover` + `aspect-ratio: 3/4` no container
garantem que nenhuma imagem seja deformada em nenhuma contagem**; a placa é que não pode
crescer.

#### 10.4.2 Fileira final e comprimento

- **Fileira incompleta:** alinhada à **esquerda** (`justify-items: start`, que é o padrão).
  Nunca `justify-content: center`, que desalinha a coluna com o resto da página. Nunca célula
  de preenchimento, nunca placa esticada para fechar a fileira.
- **Fileira final com 1 placa** (caso `16`): aceitável e comum em galerias. Se for considerado
  feio na revisão visual, a correção permitida é reduzir o teto para 4 naquele breakpoint —
  **não** inventar preenchimento.
- **Comprimento com 30–50:** a seção fica longa (6 a 10 fileiras). É o custo de mostrar a
  tripulação inteira, e mostrar a tripulação inteira é o ponto da seção. **Não paginar, não
  cortar com "ver mais".** Se o comprimento vier a incomodar de verdade, a decisão volta ao
  autor da issue — não é do implementador.
- **0 membros:** estado vazio da seção (§10.6), não um grid de zero colunas.

#### 10.4.3 Trilho (<768) em qualquer contagem

| Total | Comportamento |
| --- | --- |
| 1 | Sem rolagem. A placa fica alinhada à esquerda, com o padding lateral normal. O `overflow-x: auto` continua, mas não há o que rolar |
| 2–3 | Rola pouco; a última placa alinha à direita com `scroll-padding-inline` preservado |
| ≥4 | Comportamento normal do trilho |

Em nenhuma contagem o trilho centraliza o conteúdo — centralizar faz a primeira placa "pular"
para o meio da tela quando há poucos membros.

### 10.5 Estados por placa

| Estado | Render |
| --- | --- |
| **Sem retrato** (`portraitUrl: null`) | O **retrato editorial** (A7, §18.8) — não é caixa cinza, não é ícone de usuário, não é "sem imagem". É uma composição desenhada em SVG: campo em `--color-deep` com o gradiente de luz superior-direita, arco de 1px na cor da classe seguindo a curvatura do ombro, e a inicial do nome em Archivo 54px a 40% de `--color-fg-subtle`. **Este é o estado padrão durante todo o desenvolvimento** e continua sendo o estado permanente de quem não tem retrato |
| **Retrato carregando** | Fundo `--color-deep` chapado, sem shimmer. `next/image` com `placeholder="empty"` — shimmer em até 50 células é ruído |
| **Retrato falhou (404/erro de rede)** | Cai no mesmo render de "sem retrato". Implementado com `onError` num Client wrapper mínimo **ou**, preferencialmente, tratado no Nest (que já sabe se a URL existe) para manter a placa como Server Component |
| **Sem ilvl / sem score** | `—` na célula. **Nunca `0`** — "sem dado" e "gear ruim" são coisas diferentes, e o repo já registra essa lição em `roster-table.tsx` |
| **Sem nenhum número** | a régua da base some inteira e a placa fica 24px mais curta? **Não.** A régua fica, com `— —`. Altura constante ganha |

### 10.6 Estados da seção

| Estado | Render |
| --- | --- |
| **Carregando** | `<Suspense>`: 10 placas em campo `--color-deep` com a régua e as divisórias já desenhadas (sem inicial e sem texto), altura correta, sem shimmer. Zero CLS. É o único skeleton da página, e ele é **transitório** — nunca o estado de repouso de nada |
| **Sem endpoint (desenvolvimento)** | Mock de §6.2, com retrato editorial em 48 das 50 entradas. A seção fica **cheia e fotografável** desde o primeiro dia — §2.1 |
| **API fora / sem endpoint** | Chapa com: "A lista da tripulação não respondeu agora." + a explicação de que o time é curado no WoWAudit + link para a página pública da guilda no Raider.IO. **Sem número inventado** |
| **Lista vazia** | "Nenhum tripulante registrado nesta season." |
| **`enrichmentFailed: true`** | Renderiza o time inteiro, com todos os números em `—` e um `rotulo` acima: `NÚMEROS INDISPONÍVEIS`. Degradar, não derrubar — Regra 6 |
| **Mock ativo** | tarja de desenvolvimento (§6.1) |

### 10.7 Cabeçalho da seção

`rotulo` "Tripulação" + `h2` + uma linha de corpo + à direita, em mono 11px:
`22 TRIPULANTES · AFERIDO EM 05/08 14:02`. É onde a contagem e a procedência vivem — não numa
célula do grid.

---

## 11. Apply

### 11.1 Conceito `[FECHADO]`

**Entrada no registro**, não formulário. A tradução é sóbria: campos como **linhas regradas**
(régua de baseline de 1px, sem caixa), rótulos gravados em mono, coluna única, e o sucesso
apresentado como **entrada carimbada**. Nada de pergaminho, selo de cera, fonte gótica ou
qualquer cosplay que atrapalhe o preenchimento.

### 11.2 Composição

Coluna única, `max-width: 560px`, alinhada à esquerda na coluna de conteúdo (não centralizada —
centralizar formulário longo é padrão de SaaS). Acima: `rotulo` + `h2` + 2 linhas de
enquadramento na voz da guilda.

### 11.3 Campos, derivados de `createApplicationSchema`

Fonte única: `packages/shared/src/application.ts`. **Não redeclarar nenhum campo.** Ordem e
apresentação:

| # | Campo | Tipo na UI | Label | Auto­complete | inputMode | Notas |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `character.name` | text | Personagem | `off` | `text` | 2–12 chars. Ajuda: "Como aparece no jogo. Acento não atrapalha." |
| 2 | `character.realm` | text | Realm | `off` | `text` | 2–64. Ajuda: "Azralon, Goldrinn, Area 52…". **Sem seletor de região** — a guilda é US-only e o servidor preenche (Regra 6) |
| 3 | `class` | radiogroup | Classe | — | — | 13 opções de `CLASSES`. Rótulo legível em pt-BR mapeado no front (só exibição) |
| 4 | `mainRole` | radiogroup | Função principal | — | — | 4 opções de `ROLES` |
| 5 | `offRole` | radiogroup + "nenhuma" | Função secundária | — | — | opcional |
| 6 | `discordTag` | text | Discord | `off` | `text` | 2–37 |
| 7 | `battleTag` | text | BattleTag | `off` | `text` | opcional, regex `Nome#1234`. Ajuda com exemplo |
| 8 | `availableDays` | 7 detentes | Dias disponíveis | — | — | §11.4. Mín. 1 |
| 9 | `experience` | textarea | Experiência | `off` | `text` | 1–4000, ~6 linhas, contador a partir de 3600 |
| 10 | `motivation` | textarea | Por que a Titan Inc | `off` | `text` | 1–4000 |
| 11 | `warcraftLogsUrl` | url | Logs | `url` | `url` | opcional |
| 12 | `website` | **honeypot** | — | `off` | — | §11.6 |

**`[PROV]`** — o schema está marcado `PROVISÓRIO — TIT-13` no shared: os campos precisam de
revisão por quem recruta. Se mudarem, o form muda junto e é o typecheck que acusa, não o
usuário. Isso é o desenho correto (Regra 2), não um risco.

### 11.4 Os dias como detentes

Os 7 dias viram uma fileira de 7 controles com a **mesma forma da detente do instrumento** —
traço curto que cresce e acende quando ativo. É o que costura a seção à página em vez de
decorá-la.

Implementação: `role="group"` com `aria-labelledby`, 7 `<button role="checkbox"
aria-checked>` (ou `<input type="checkbox">` visualmente substituído — preferir o input, que
funciona sem JS). Rótulo visível `D S T Q Q S S`, `aria-label` completo (`"Domingo"`). Alvo
44×44. Estado ativo diferenciado por **traço + preenchimento + `aria-checked`**, não só cor.

### 11.5 Validação `[FECHADO]`

- **Fonte:** `createApplicationSchema` do shared, campo a campo via
  `createApplicationSchema.shape[nome].safeParse(valor)`.
- **Quando:** nunca ao digitar num campo ainda não tocado. Primeira validação **no blur**;
  depois de o campo ter erro, revalida a cada mudança (para o erro sumir assim que for
  corrigido). É o comportamento que menos irrita.
- **No submit:** valida o objeto inteiro. Se falhar, foca o **primeiro campo inválido na ordem
  do DOM** e renderiza um **resumo de erros** no topo do formulário, com links âncora para cada
  campo, dentro de um `role="alert"`.
- **Mensagens em português**, específicas, nunca "campo inválido". O schema já traz uma
  (`"Formato esperado: Nome#1234"`); as demais são mapeadas por código de issue do Zod em uma
  função pura e testável.
- **Preservação:** os valores **nunca** são perdidos em falha de submit. O estado vive no
  componente; se algum dia houver Server Action, `useActionState` devolve o payload anterior.

### 11.6 Honeypot

Campo `website`, `<input>` real, `tabindex="-1"`, `autocomplete="off"`, `aria-hidden="true"`,
posicionado fora da tela com `position:absolute; left:-9999px` (**não** `display:none`, que
alguns bots detectam). Label real e escondido junto, para não quebrar validador de HTML.

### 11.7 Biblioteca: decisão `[FECHADO]`

**Nativo (React 19 + `useActionState`/`useState`), sem `react-hook-form`.**

| Critério | RHF + `@hookform/resolvers` | Nativo |
| --- | --- | --- |
| Revalidação por campo | de graça | ~40 linhas próprias |
| Estado pending/erro | de graça | `useActionState`/`useTransition` já resolvem em React 19 |
| Foco no primeiro erro | de graça | ~10 linhas |
| Peso no bundle | ~12KB gzip | 0 |
| **Lockfile** | **muda `pnpm-lock.yaml`** | não muda |
| Manutenção | +2 dependências para **um** formulário | 0 |

**Decisivo:** o projeto tem dois devs trabalhando em paralelo, e `pnpm-lock.yaml` é o arquivo de
maior risco de conflito do repositório. Trocar isso por ~50 linhas de código próprio, num único
formulário de 12 campos, é o negócio certo. **Se** aparecer um segundo formulário complexo, a
decisão se reabre — e aí RHF é a escolha correta.

### 11.8 Envio — o ponto mais sensível `[BLOQUEADO]`

`POST /applications` **não existe** (não há módulo `applications` no Nest nem model
`Application` no `schema.prisma`).

> **Regra absoluta: a página nunca pode dar a impressão de que a candidatura foi enviada.**

Comportamento nesta fase, em ordem de preferência:

1. **Se a URL do Discord for fornecida (§19, C2):** o botão de submit é substituído por uma ação
   sólida "Falar com a liderança no Discord", e acima dela uma `chapa` com `role="note"`:
   *"O envio pelo site ainda não está aberto. Por enquanto a candidatura chega pelo Discord — o
   formulário abaixo é a mesma coisa que vamos perguntar lá."* O formulário permanece visível e
   validável (serve para a pessoa se preparar) mas **não** submete.
2. **Sem a URL do Discord:** botão `disabled` com `aria-describedby` apontando para a mesma
   nota, e a nota diz que o canal ainda não abriu.

Nos dois casos: **nada de `preventDefault` com toast de sucesso, nada de `setTimeout` fingindo
envio, nada de `mailto:`.**

**Quando o endpoint existir**, a integração é uma Server Action em `app/actions.ts` que só
repassa ao Nest (permitido — é o Next consumindo a API; a regra de negócio e a persistência
ficam no Nest, Regra 1). Nada de `app/api/applications/route.ts`.

### 11.9 Estados do formulário

| Estado | Render |
| --- | --- |
| Inicial | campos vazios, nenhum erro, submit habilitado ou não conforme §11.8 |
| Campo inválido | régua do campo passa a `--color-highlight`; mensagem abaixo em 13px `--color-highlight`, ligada por `aria-describedby` |
| Pending | submit vira "Registrando…", `disabled`, `aria-busy="true"`. Campos **não** são desabilitados (desabilitar campo em pending perde o foco e confunde leitor de tela) |
| Erro do servidor (4xx/5xx) | `chapa` com `role="alert"` no topo do form, mensagem do servidor quando houver, genérica quando não. **Dados preservados** |
| Erro de rede | mesma chapa, texto próprio: "Não foi possível registrar agora. Nada foi perdido — tente de novo." |
| Sucesso | o formulário é **substituído** por uma entrada carimbada: `chapa` com `REGISTRADO`, o nome do personagem, a data/hora em mono, e uma linha sobre o próximo passo. `role="status"`, foco movido para o bloco |

---

## 12. Login OAuth via popup

> **O requisito de produto é popup.** Este documento **não** o substitui por redirect. Mas o
> backend hoje só suporta redirect de página inteira, com o destino final *hardcoded* em
> `apps/api/src/auth/auth.controller.ts` (`res.redirect(\`${webUrl}/interno\`)`). Enquanto B4
> não existir, o botão renderiza inerte, com aviso — **nunca** simulando um fluxo que não roda.

### 12.1 Fluxo esperado

```
1. clique no botão
2. window.open(API_URL + '/auth/battlenet?mode=popup', 'titan_oauth', features)
3. popup navega: Nest → Blizzard → consentimento → Nest /auth/battlenet/callback
4. Nest grava a sessão, seta o cookie, e redireciona o POPUP para
   WEB_URL + '/oauth/callback?status=ok'
5. /oauth/callback faz window.opener.postMessage({...}, WEB_ORIGIN) e window.close()
6. a página principal recebe a mensagem, valida origin, e faz router.refresh()
7. o botão passa a mostrar a conta; navegação para /interno é do usuário
```

### 12.2 Abertura da janela

| Item | Valor |
| --- | --- |
| Nome da janela | `'titan_oauth'` — nome fixo **reaproveita** a janela e previne múltiplas |
| Dimensões | 480×720, com `Math.min` contra `window.screen.availWidth/Height` |
| Posição | centralizada no monitor **atual**: `left = window.screenX + (window.outerWidth - w)/2` |
| Features | `popup=yes,width,height,left,top,noopener=no` — `noopener` **não** pode ser usado; sem `opener` não há `postMessage` de volta |
| Guarda de duplo clique | referência em `useRef`; se a janela existe e não está fechada, `ref.current.focus()` e sai |

### 12.3 Estados do botão

| Estado | Render |
| --- | --- |
| Ocioso, deslogado | `acao` fantasma: "Entrar" |
| Aguardando | "Aguardando Battle.net…", `disabled`, `aria-busy` |
| **Popup bloqueado** | `window.open` devolveu `null`. Render de uma `chapa` com `role="alert"`: "Seu navegador bloqueou a janela de login." + **link de fallback** que faz o fluxo por redirect completo (`/auth/battlenet`, sem `mode`). Esse link é a rede de segurança e sempre funciona |
| **Usuário fechou** | polling de `popup.closed` a cada 500ms; ao detectar fechamento sem mensagem, volta a ocioso e mostra "Login cancelado." em `aria-live="polite"`. O polling **para** ao receber mensagem ou ao desmontar |
| **Timeout** | 3 minutos sem mensagem → fecha a janela, volta a ocioso, mensagem "O login demorou demais. Tente de novo." |
| **Erro do provedor** | mensagem `status=erro&motivo=<slug>`; reaproveitar os textos já existentes em `app/entrar/page.tsx` (`cancelado`, `state`, `falha`) — não escrever textos novos e divergentes |
| **Sucesso** | `router.refresh()`; o botão passa a mostrar a battletag + link "Área de membros". **Não redirecionar automaticamente** — o visitante estava lendo a landing; levá-lo embora sem pedir é hostil. A ida a `/interno` é um clique dele |
| Logado ao carregar | o layout já chamou `getSessionUser()`; o botão nasce no estado logado |

### 12.4 Segurança da mensagem `[FECHADO]`

```ts
// no listener da página principal
if (event.origin !== window.location.origin) return;   // origin, sempre
if (event.source !== popupRef.current) return;         // e a fonte esperada
const parsed = mensagemOAuthSchema.safeParse(event.data);  // e o formato
if (!parsed.success) return;
```

Três checagens, nenhuma opcional. `postMessage` com `'*'` como target origin é **proibido**: o
`postMessage` do callback usa a origem exata do site.

O payload **não carrega token, nem sessão, nem dado pessoal** — só `{ tipo: 'titan-oauth',
status: 'ok' | 'erro', motivo?: string }`. A sessão viaja no cookie `httpOnly`, como já é hoje.

### 12.5 Contrato proposto ao backend (B4)

| Lado | Responsabilidade |
| --- | --- |
| **Nest** | Aceitar `?mode=popup` em `GET /auth/battlenet` e guardar a intenção junto do `state` (no cookie de state, não na query do callback). No callback, se a intenção for popup, redirecionar para `${WEB_URL}/oauth/callback?status=ok` ou `?status=erro&motivo=<cancelado\|state\|falha>` em vez de `${WEB_URL}/interno`. **Nenhuma outra mudança.** |
| **Next** | A página `/oauth/callback`, o `postMessage`, a validação de origin, o estado do botão e o fallback por redirect |

**Nada em `apps/api` é alterado nesta issue.** Vai como item do backlog (§23).

### 12.6 A página de callback

`app/oauth/callback/page.tsx` — Server Component mínimo que renderiza uma `chapa` com "Login
concluído. Pode fechar esta janela." e um Client Component invisível que:

1. lê `status`/`motivo` de `searchParams`;
2. `window.opener?.postMessage({ tipo: 'titan-oauth', status, motivo }, window.location.origin)`;
3. `window.close()`.

Se `window.opener` for nulo (a pessoa abriu a URL direto, ou o navegador cortou o opener), a
página **não** fica em branco: mostra a mesma chapa com um link para `/` e outro para
`/interno`. Fallback sempre visível.

Esta é a **única** rota nova de app permitida, e ela se qualifica pela Regra 1: é fluxo de
cookie de sessão do browser.

### 12.7 Cookies, mobile e navegadores

| Assunto | Situação e mitigação |
| --- | --- |
| **SameSite** | O cookie hoje é `sameSite: 'lax'`, `httpOnly`, `secure` só em produção. No fluxo de popup a navegação final é *top-level* dentro do popup, então `lax` **envia** o cookie. Não requer mudança para `none` |
| **Cookie de terceiros** | Em dev, front (`:3000`) e API (`:3001`) são origens diferentes; em produção, se ficarem em domínios diferentes, Safari ITP e o bloqueio de terceiros do Chrome podem descartar o cookie e o sintoma é **"logou e continua deslogado"**. **Mitigação obrigatória: em produção, servir Next e Nest sob o mesmo site registrável** (ex.: `titaninc.gg` e `api.titaninc.gg`). Isso é decisão de deploy e entra no backlog |
| **HTTPS** | Obrigatório em produção; `secure: true` já é condicionado a `NODE_ENV` |
| **Mobile** | Popup em navegador móvel abre como **nova aba**, não janela flutuante — o `postMessage` continua funcionando, e a aba se fecha sozinha. Aceitável. Se `window.open` falhar (comum em WebViews de app), cai no fallback por redirect de §12.3 |
| **WebView / navegador in-app** (Discord, Instagram) | Cenário provável, já que o tráfego virá do Discord. Muitos bloqueiam `window.open`. O fallback por redirect é o caminho, e ele precisa estar sempre visível — não escondido atrás de uma tentativa fracassada |
| **`prefers-reduced-motion`** | Irrelevante aqui; o fluxo não anima |

---

## 13. Footer

Um fecho com peso, não uma tira de links. É o "real close" que ancora o fim da página.

```
 ┌───────────────────────────────────────────────────────────────┐
 │  [âncora em marca-d'água, 320px, opacidade 4%, ao fundo]      │
 │                                                               │
 │  TITAN INC              AFERIÇÃO            MEMBROS           │
 │  Uma linha sobre        Raider.IO           Entrar            │
 │  a guilda.              Warcraft Logs                         │
 │                         Discord                               │
 │  ───────────────────────────────────────────────────────────  │
 │  Dados de personagem via Raider.IO. World of Warcraft é       │
 │  marca da Blizzard Entertainment, Inc. Site não oficial.      │
 └───────────────────────────────────────────────────────────────┘
```

| Item | Especificação |
| --- | --- |
| Fundo | `--color-bg`, com régua de 1px no topo |
| Marca-d'água | o SVG da âncora, `opacity: .04`, `aria-hidden`, `pointer-events: none`, ancorado à direita e cortado pela borda inferior |
| Colunas | 3 no desktop, empilhadas no mobile com régua entre elas |
| Links externos | `target="_blank" rel="noopener noreferrer"`, com indicação textual (não só ícone) de que abrem fora |
| **Atribuições** | **Obrigatórias**, ver §18.6: link de volta ao Raider.IO (exigência dos termos de uso deles) e o aviso de marca da Blizzard (exigência das diretrizes de trademark). Não é rodapé decorativo — é conformidade |
| Padding | 96px topo / 48px base |

---
## 14. Responsividade

Breakpoints do Tailwind 4 usados: `md` 768 · `lg` 1024 · `xl` 1280. `sm` (640) **não é usado** —
a virada real é em 768, e inventar um passo em 640 só cria um estado a testar.

### 14.1 Matriz por largura

| | 320 | 360 | 390 | 430 | 768 | 1024 | 1280 | 1440 | 1920 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Padding lateral** | 20 | 24 | 24 | 24 | 32 | 32 | 48 | 48 | 48 |
| **Nav** | disclosure só ícone+tick | disclosure rotulado | idem | idem | idem | régua completa | régua completa | idem | trilho full-bleed, conteúdo 1120 |
| **Nav altura** | 56 | 56 | 56 | 56 | 60 | 64 | 64 | 64 | 64 |
| **Hero ordem** | instrumento → h1 | idem | idem | idem | idem | **h1 ← → instrumento** (2 col) | idem | idem | idem |
| **Disco** | 240 | 260 | 280 | 300 | 340 | 380 | 440 | 440 | 440 |
| **h1** | 32 | 34 | 36 | 40 | 40 | 54 | 72 | 72 | 72 |
| **Painel de leitura** | 108 fixo | 108 | 108 | 108 | 118 | 128 | 128 | 128 | 128 |
| **Fundo da hero** | retrato | retrato | retrato | retrato | retrato | paisagem | paisagem | paisagem | paisagem |
| **About marginália** | faixa horizontal | idem | idem | idem | idem | calha lateral | calha | calha | calha |
| **About corpo** | 17px | 17 | 17 | 18 | 20 | 22 | 22 | 22 | 22 |
| **Roster** | trilho | trilho | trilho | trilho | grid até 3 | grid até 4 | grid até 5 | até 5 | até 5 |
| **Placa (altura)** | 340 | 360 | 360 | 360 | 300 | 320 | 340 | 340 | 340 |
| **Apply largura** | 100% | 100% | 100% | 100% | 100% | 560 | 560 | 560 | 560 |
| **Espaço entre seções** | 96 | 96 | 96 | 96 | 120 | 160 | 160 | 160 | 160 |
| **Footer colunas** | 1 | 1 | 1 | 1 | 3 | 3 | 3 | 3 | 3 |

### 14.2 O que muda além de colunas

**Composição.** Mobile não é o desktop empilhado. Três inversões deliberadas, todas já
especificadas: o instrumento sobe para antes do `h1` (§8.8), a marginália do About vira faixa
horizontal (§9.2), e o roster vira trilho de folhear (§10.1). Se alguma delas for implementada
como simples empilhamento, o requisito falhou.

**Foco.** No desktop o olho entra pelo `h1` e é puxado para o instrumento pela sobreposição. No
mobile o instrumento é a primeira coisa, e o `h1` explica o que se acabou de ver. São duas
direções de leitura diferentes, de propósito.

**Mídia.** Duas composições autorais distintas (§18.2 e §18.3), servidas por `<picture>` /
`next/image` com `media`, nunca a mesma imagem recortada por CSS.

### 14.3 Casos de viewport

| Caso | Comportamento |
| --- | --- |
| **Landscape mobile** (ex.: 740×360) | A hero abandona `min-height` de tela; disco cai para 200px e vai para a **direita** do `h1` em duas colunas — em landscape há largura, não altura. Nav cai para 52px |
| **Altura curta em geral** (`@media (max-height: 620px)`) | Hero sem `min-height`; espaço entre seções cai um passo |
| **Zoom 200%** | Layout reflui sem rolagem horizontal (§16.12). A 1280 com zoom 200% o comportamento é o de 640 → **trilho** no roster, disclosure na nav. Testar exatamente assim |
| **Fonte do sistema aumentada** | Toda medida de texto em `rem`; nada de altura fixa em contêiner de texto. As **únicas** alturas fixas da página são o painel de leitura e a placa do roster — as duas contêm texto truncável, e o truncamento é aceitável ali |
| **Texto mais longo** (traduções, nomes de boss longos) | `h1` com `text-wrap: balance` e sem `max-height`. Nome de boss no painel de leitura: 2 linhas máximo, `ellipsis` na segunda |
| **≥1920** | Nada cresce além de 1440 (conteúdo) / 1120 (coluna). O fundo da hero sangra; o resto ancora. Página esticada até 1920 perde a relação de escala |
| **Área segura (iOS)** | `padding-inline` soma `env(safe-area-inset-*)`; a nav soma `env(safe-area-inset-top)` |

---

## 15. Movimento

### 15.1 Linguagem `[FECHADO]`

Uma linguagem só: **assentamento**. Coisas medidas não deslizam nem quicam — elas *assentam*.
Uma curva, duas durações.

| Token | Valor | Uso |
| --- | --- | --- |
| Curva | `cubic-bezier(0.16, 1, 0.3, 1)` | tudo que assenta |
| Curto | 150ms | confirmação de estado (hover, foco, seleção) |
| Longo | 700ms | os dois momentos narrativos |

**No máximo um momento orquestrado por seção.** Movimento espalhado por hover é o que faz uma
página parecer gerada.

### 15.2 Tabela de animações

| # | Elemento | Gatilho | Inicial → Final | Duração | Propriedade | Custo | Reduced motion | Mobile | Motivo narrativo |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Agulha do instrumento | entrada em viewport (`IntersectionObserver`, uma vez) | `rotate(-143deg)` → ângulo da leitura | 700ms | `transform` | composited | vai direto ao final, 0ms | igual | "isto é uma medição", não uma animação |
| 2 | Detentes | junto com 1, stagger de 60ms | `opacity .25` → `1` na cor do estado | 500ms total | `opacity`, `fill` | baixo | estado final imediato | igual | reencena a história do tier em meio segundo |
| 3 | Nav: chapa | `scrollY ≥ 24` | transparente → surface | 180ms | `background-color`, `border-color` | baixo | mantém (é estado, não movimento) | igual | confirma que saiu do topo |
| 4 | Nav: tick ativo | scroll-spy | 5px → 11px, border → accent | 150ms | `height`, `background-color` | baixo | mantém | igual | cursor de escala se movendo |
| 5 | Painel mobile | clique | `translateY(-8px)` + `opacity 0` → `0`/`1` | 200ms | `transform`, `opacity` | composited | só `opacity`, 0ms | — | a chapa descendo do trilho |
| 6 | Placa do roster | hover/foco | borda topo 7% → 12%; numerais `fg-muted` → `fg` | 150ms | `border-color`, `color` | baixo | mantém | sem hover; só foco | a chapa pegando luz |
| 7 | Detente selecionada | hover/foco/tap | anel externo `opacity 0` → `1` | 150ms | `opacity` | baixo | mantém | igual | confirma o alvo |
| 8 | Campo do formulário | foco | régua `border` → `accent`, 1px → 2px | 150ms | `border-color`, `border-width` | baixo | mantém | igual | a luz da chapa se deslocando para a linha ativa |
| 9 | Detente de dia | toggle | traço 8px → 14px | 120ms | `height` | baixo | mantém | igual | encaixe tátil |
| 10 | Trilho do roster | scroll | `scroll-behavior: smooth` só ao clicar em âncora | nativo | — | — | `auto` | igual | — |

**Momentos orquestrados:** apenas #1+#2 (a hero). O resto é confirmação de estado, que continua
existindo sob `prefers-reduced-motion` porque **feedback não é enfeite**.

### 15.3 Proibições

Parallax · scroll-jacking · `fade-in` ao rolar em seções ou textos · contador numérico subindo ·
partículas · animação contínua/loop · card levantando com `translateY` ou `scale` · cursor
customizado · som · texto montando letra a letra · `animate-pulse` como placeholder de conteúdo ·
qualquer biblioteca de animação.

### 15.4 Implementação

CSS puro (`transition`, `@keyframes`) com classes trocadas por estado React. Web Animations API
**apenas** para #1, se o cálculo do ângulo final tornar a transição por classe inviável — o
ângulo é dinâmico, então provavelmente será `style={{ transform }}` com `transition` em CSS, o
que resolve sem WAAPI. Decidir na implementação e registrar.

`prefers-reduced-motion` implementado uma vez, globalmente, em `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

E, além disso, o instrumento **checa a preferência em JS** para renderizar já no estado final em
vez de transicionar em 0.01ms — a diferença importa para quem tem sensibilidade vestibular.

---

## 16. Acessibilidade

Cada item ligado a um comportamento real da página, não a um checklist.

### 16.1 Landmarks e estrutura

```
<body>
  <!-- contrato de direção (comentário HTML) -->
  <a href="#conteudo">Pular para o conteúdo</a>
  <header>  <nav aria-label="Principal">…</nav>  </header>
  <main id="conteudo">
    <section aria-labelledby="hero-titulo">…</section>
    <section id="sobre" aria-labelledby="sobre-titulo">…</section>
    <section id="tripulacao" aria-labelledby="tripulacao-titulo">…</section>
    <section id="candidatura" aria-labelledby="candidatura-titulo">…</section>
  </main>
  <footer>…</footer>
</body>
```

Toda `<section>` com `aria-labelledby` apontando para seu próprio heading. `<section>` sem nome
acessível não vira landmark e não aparece na lista de regiões do leitor de tela.

### 16.2 Hierarquia de headings

Um `h1` só (a manchete da hero). Quatro `h2` (About, Tripulação, Candidatura, e o do Footer,
este visualmente oculto com `sr-only`). Sem `h3` nesta página. **Nunca** pular nível, nunca usar
heading por tamanho.

### 16.3 Ordem do DOM

A ordem do DOM é a ordem de leitura no **mobile** (§8.8). No desktop, o reposicionamento do
instrumento é feito com **grid areas**, não com `order` em flex de container inteiro — `order`
descasa foco de posição visual. Onde `order` for usado (a subida do instrumento no mobile), a
ordem visual e a de foco coincidem, então é seguro.

### 16.4 Foco

- `:focus-visible` em **tudo** que é focável: `outline: 2px solid var(--color-accent);
  outline-offset: 2px`. Nunca `outline: none` sem substituto.
- Contraste do anel ≥3:1 contra `bg` e contra `surface` — os dois fundos onde ele aparece.
- Sobre a imagem da hero, o anel ganha um `box-shadow: 0 0 0 4px var(--color-bg)` para não
  sumir contra área clara.
- Foco nunca fica preso fora do painel mobile aberto (focus trap), e **volta** ao gatilho ao
  fechar.
- Após submit com erro, foco vai ao primeiro campo inválido. Após sucesso, ao bloco de sucesso.

### 16.5 Teclado

| Elemento | Comportamento |
| --- | --- |
| Nav | `Tab` na ordem visual; `Enter` navega |
| Disclosure mobile | `Enter`/`Espaço` abre; `Escape` fecha e devolve foco |
| Detentes do instrumento | `Tab` percorre; `Enter`/`Espaço` fixa; `←`/`→` move; `Escape` solta |
| Trilho do roster | container com `tabindex="0"` e `aria-label="Tripulação, lista rolável"`; setas rolam (comportamento nativo de container rolável focado) |
| Dias do Apply | checkboxes nativos; `Espaço` alterna |
| Login | `Enter` abre o popup — `window.open` disparado por evento de teclado **não** é bloqueado como popup |

### 16.6 Cor nunca sozinha

| Informação | Sinal não-cromático |
| --- | --- |
| Boss vencido vs. não | comprimento e espessura do traço + lâmpada + `aria-label` |
| Classe do personagem | o **texto** da classe na placa; a cor é redundante |
| Campo com erro | texto da mensagem + `aria-invalid` + espessura da régua |
| Seção ativa na nav | comprimento do tick + `aria-current` |
| Dia selecionado | comprimento do traço + `aria-checked` |
| `stale` na leitura | o rótulo textual `LEITURA DE <data>` |

### 16.7 Alvos de toque

Mínimo **44×44 CSS px** em: links da nav, disclosure, detentes do instrumento (alvo invisível
maior que o desenho), botões de dia, submit, links do footer. Espaçamento mínimo de 8px entre
alvos adjacentes.

### 16.8 Imagens

| Imagem | Tratamento |
| --- | --- |
| Fundo da hero | **decorativa**: `alt=""` + `aria-hidden`. Não carrega informação; a informação é o texto sobreposto |
| Wordmark na nav | `alt="Titan Inc"` (é o nome do site e o link para o topo) |
| Wordmark na hero | `alt=""` — repete o que o `h1` já diz; anunciar duas vezes é ruído |
| Retrato do roster | `alt=""` + `aria-hidden`. O nome, classe e realm estão em texto ao lado. `alt="Retrato de Fulano"` seria redundância pura |
| Âncora do footer | decorativa, `aria-hidden` |
| SVG do instrumento | `aria-hidden="true"` inteiro; a semântica está nos botões HTML e na leitura textual |

### 16.9 O instrumento por leitor de tela

O que é anunciado, em ordem:

1. `<p>` da leitura: **"6 de 8, Mítico"** — texto real, não SVG, não `aria-label`.
2. Um `<p class="sr-only">` com a frase completa: *"Progressão da guilda em [raid], dificuldade
   Mítico: 6 de 8 bosses vencidos. Aferido em 5 de agosto de 2026."*
3. O grupo de detentes: `role="group"` com `aria-label="Bosses da raid"`, cada botão com o
   `aria-label` completo de §8.7.
4. O painel de leitura como `aria-live="polite"`.

Quem usa leitor de tela obtém a informação **inteira sem tocar em nada**. A interação com as
detentes é enriquecimento, não requisito.

### 16.10 Conteúdo dinâmico

| Região | `aria-live` |
| --- | --- |
| Painel de leitura do instrumento | `polite` |
| Resumo de erros do formulário | `role="alert"` (assertivo por natureza) |
| Mensagem de estado do login | `polite` |
| Bloco de sucesso do Apply | `role="status"` + foco movido |
| Tarja de mock | `role="note"`, sem live |

### 16.11 Sem JavaScript

| Funciona | Não funciona | Mitigação |
| --- | --- | --- |
| Toda a estrutura, texto, imagens | scroll-spy (ticks) | ticks ficam inativos; links funcionam |
| Links de âncora | disclosure mobile | os 3 links renderizam em linha rolável por padrão; o JS os substitui pelo disclosure. **Ou seja: o HTML nasce funcional e o JS melhora** |
| Trilho do roster (CSS puro) | — | — |
| Instrumento renderizado com o dado correto (é Server Component) | seleção de boss | painel mostra o padrão; a leitura textual e o `sr-only` continuam completos |
| Campos do formulário e validação nativa do HTML (`required`, `maxlength`, `pattern`) | validação por Zod, resumo de erros | a validação nativa cobre o essencial |
| — | login por popup | o link de fallback por redirect é um `<a>` real e sempre visível |

### 16.12 Zoom e reflow

A 400% de zoom em 1280 (equivalente a 320px de largura) **não pode haver rolagem horizontal** —
exceto no trilho do roster, que é uma região deliberadamente rolável e permitida pela norma.
Tudo em unidades relativas; nenhum `min-width` fixo em container; nenhuma tabela.

### 16.13 Meta e idioma

`<html lang="pt-BR">` — já está correto. Sem `maximum-scale` ou `user-scalable=no` no viewport
(bloquear zoom é falha de acessibilidade). Termos em inglês inevitáveis (nomes de classe, de
boss, "parse") ficam como estão — traduzir nome próprio de jogo confunde mais que ajuda.

---

## 17. Performance

### 17.1 Orçamento `[FECHADO]`

| Recurso | Teto | Como medir |
| --- | --- | --- |
| JS da rota `/`, além do framework | **45KB** gzip | saída do `pnpm --filter web build` |
| CSS total | 20KB gzip | idem |
| Fontes | **95KB** total (Archivo variável latin + Geist Mono) | aba Network |
| Fundo da hero, desktop | 220KB AVIF | arquivo |
| Fundo da hero, mobile | 120KB AVIF | arquivo |
| Retrato individual | 30KB AVIF a 280px | arquivo |
| SVG do instrumento | 6KB inline | arquivo |
| **LCP** | < 2.0s em 4G simulada | Lighthouse |
| **CLS** | < 0.02 | Lighthouse |
| **INP** | < 200ms | Lighthouse |
| Requisições na primeira dobra | ≤ 8 | Network |

### 17.2 Fontes

- `next/font/google` para Archivo (self-hosted automaticamente, sem requisição a domínio
  terceiro — o que também evita um problema de privacidade).
- `subsets: ['latin']`, `display: 'swap'`.
- **Variável, não pesos estáticos.** Um arquivo variável cobre 400–800; três estáticos pesam
  mais.
- `preload` automático do `next/font` mantido para Archivo (é a face do LCP). **Geist Mono com
  `preload: false`** — ele aparece em rótulos, não no maior elemento.
- Nenhuma terceira família. Nenhum ícone-fonte.

### 17.3 Imagens

| Item | Configuração |
| --- | --- |
| Componente | `next/image` sempre; nunca `<img>` cru |
| Fundo da hero | `priority` + `fetchPriority="high"`, `sizes="100vw"`, `quality={72}` |
| Duas composições | `<picture>` com `media` **ou** dois `next/image` alternados por CSS com `priority` só no que corresponde ao breakpoint — na dúvida, usar o componente `<Image>` com `sizes` e servir a variante retrato via `media` num `<picture>` manual, que é o único jeito de trocar a **composição** e não só a resolução |
| Retratos | `loading="lazy"` a partir do 6º; os 5 primeiros `loading="eager"` sem `priority` (priority em 5 imagens compete com o LCP). Com 50 membros isso significa 45 imagens fora da primeira dobra — o lazy é o que mantém o orçamento de §17.1 válido em qualquer contagem |
| `sizes` dos retratos | `"(min-width:1280px) 200px, (min-width:1024px) 240px, (min-width:768px) 280px, 68vw"` |
| Formato | AVIF com fallback WebP — padrão do `next/image`; nenhuma config extra necessária |
| Placeholder | `placeholder="empty"` + fundo `--color-deep` no container. **Sem blur-up**: 25 blurs é ruído e peso |
| `remotePatterns` | **Condicional.** As imagens são servidas pelo backend (§10.0). Se ele as entregar do próprio domínio — proxy ou storage próprio, **o recomendado** — nenhuma entrada é necessária e o `next.config.ts` não muda. Só se o backend devolver URL de host externo é que se adiciona esse host, e aí a entrada é ditada pelo que o contrato B2 publicar, não presumida aqui |
| Retrato editorial (A7) | SVG inline no Server Component, **não** passa por `next/image`. Zero requisição, zero custo de otimização, e funciona offline |
| Layout shift | todo container de imagem com `aspect-ratio` fixo. Zero exceções |

### 17.4 O instrumento

SVG **inline**, gerado no servidor a partir do dado. Não é arquivo, não é requisição, não é
sprite. ~6KB no HTML, que é menos que qualquer alternativa. Sem `<use>` externo, sem CSS
`mask`.

O componente é Server Component; só `detentes.tsx` (os botões + painel) é Client, e ele carrega
o mínimo: sem dependência, sem `useEffect` de layout, o `IntersectionObserver` da animação vive
num efeito único com `{ once: true }`.

### 17.5 Conexão lenta e estado antes da mídia

Ordem de pintura desejada:

1. **HTML + CSS**: campo de profundidade (CSS puro), nav, tipografia, e o instrumento **já com
   o número correto** — porque é Server Component. A leitura `6/8 MÍTICO` aparece antes de
   qualquer imagem.
2. Fonte (swap: o texto aparece na fallback e troca).
3. Fundo da hero.
4. Retratos, sob demanda.

Consequência desejada: **em 3G, a página é útil e bonita antes de a primeira imagem chegar**,
porque o fundo autoral (§18.5) é CSS/SVG. Esse é o argumento central de por que o
`campo-profundo.tsx` existe.

### 17.6 Dependências

**Zero dependências novas nesta issue.** Nem animação, nem carrossel, nem formulário, nem ícone,
nem `clsx`.

Uma dependência seria aceitável se, e só se: (a) resolvesse um problema que 50+ linhas próprias
não resolvem bem; (b) pesasse < 8KB gzip; (c) fosse usada em ≥3 lugares; (d) e o custo de
conflito no `pnpm-lock.yaml` fosse discutido com o outro dev antes. Nenhum item desta
especificação atende aos quatro.

### 17.7 Progressive enhancement

A página nasce funcional em HTML: conteúdo, links, formulário com validação nativa, trilho com
CSS. O JavaScript adiciona: scroll-spy, disclosure mobile, seleção de boss, validação por Zod e
popup de login. Cada um desses tem o comportamento sem-JS documentado em §16.11 — e nenhum
deles é a única via para uma informação.

---
## 18. Mídia

### 18.1 Inventário do que foi pesquisado

Pesquisa feita em 2026-08-05. **"Está disponível na internet" não é autorização de uso** — cada
linha traz origem, condição e recomendação.

| # | Fonte | Origem / autor | Finalidade | Formato / resolução | Licença ou condição | Risco de PI | Atribuição | Recomendação |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M1 | **Blizzard Character Media API** — `GET /profile/wow/character/{realm}/{name}/character-media`, namespace `profile-{region}`; devolve `assets[]` com chaves `avatar`, `inset`, `main`, `main-raw` em `render.worldofwarcraft.com` | Blizzard Entertainment | **Retratos do roster** | JPG, dimensões a confirmar por chave | API oficial, acesso por credencial de cliente já prevista no projeto. Uso não comercial de fan site é o cenário coberto pelas diretrizes de trademark | **Baixo** — é a via oficial, sem cópia para o nosso repositório | Aviso de marca no footer | **USAR — mas como opção de implementação do BACKEND, não como premissa do frontend.** Continua sendo a via de maior qualidade por esforço; deixou de ser uma dependência arquitetural desta issue. Ver §10.0: o frontend só recebe uma URL, e não sabe nem pode saber de onde ela vem |
| M2 | **Raider.IO API** (`raider.io/api/v1/...`) | Raider.IO | ilvl e score do roster (**já em uso** em `apps/api/src/raiderio/raiderio.service.ts`) | JSON | Uso comunitário e pessoal permitido; **"aplicações públicas que usam dados desta API devem incluir um link de volta ao raider.io"**; 200 req/min sem autenticação | Baixo | **Link obrigatório no footer** | **USAR.** A atribuição hoje não existe no site e passa a ser requisito (§13) |
| M3 | **Página pública da guilda no Raider.IO e no Warcraft Logs** | — | Prova externa linkada na hero e no footer | link | link público | Nenhum | — | **USAR.** É o movimento de maior credibilidade disponível: *provar, não afirmar* |
| M4 | **Blizzard Press Center** (`blizzard.gamespress.com/World-of-Warcraft`) | Blizzard Entertainment | seria a fonte de key art oficial | — | **Retornou HTTP 401 na verificação.** É gated para imprensa credenciada | **Alto** — licença de imprensa não se estende a site de guilda | — | **EVITAR.** Não é fonte utilizável |
| M5 | **Fan Site Kit do WoW** (logos, arte, recortes de personagem por classe, PSDs) | Blizzard, historicamente | seria fonte de recorte e moldura | PSD/PNG | **Não é mais distribuído oficialmente**; só circula em terceiros e no Wayback Machine | **Alto** — material antigo, procedência da cópia não verificável, versão desatualizada | — | **EVITAR** |
| M6 | **Diretrizes de trademark da Blizzard** | Blizzard | conformidade | — | Permitem uso das marcas **para fins não comerciais**, sob as políticas de atividade (a de fan site entre elas). Exigem crédito, proíbem marca no domínio e proíbem implicar patrocínio/afiliação | — | **Aviso obrigatório no footer** | **APLICAR** |
| M7 | **Archivo** (Héctor Gatti / Omnibus-Type) | Omnibus-Type | tipografia display e corpo | variável (`wght`, `wdth`) | **SIL Open Font License 1.1**, disponível no Google Fonts | Nenhum | não requer no site | **USAR** via `next/font/google` |
| M8 | **Geist Mono** | Vercel | numerais e rótulos | variável | já no projeto | Nenhum | — | **MANTER** |
| M9 | Screenshots de terceiros (Wowhead, Icy-Veins, sites de boost) | terceiros | — | — | Sem licença compatível; muitos com marca d'água | **Alto** | — | **EVITAR** |

**Nenhuma imagem foi baixada, copiada ou adicionada ao repositório.**

### 18.2 Asset ausente A1 — fundo da hero, desktop

| Campo | Especificação |
| --- | --- |
| **Nome** | `hero-desktop.avif` (+ `.webp` de fallback gerado pelo `next/image`) |
| **Seção** | Hero |
| **Função narrativa** | A atmosfera do lugar onde a guilda opera. Estabelece que isto é um mundo, não um produto. Não informa nada — a informação é o instrumento |
| **Composição** | Paisagem. Massa focal (silhueta arquitetônica, formação, estrutura) posicionada entre **62% e 78%** do eixo horizontal. Terço esquerdo deliberadamente **vazio ou de baixa frequência**, para receber a coluna de texto |
| **Enquadramento** | Plano geral. Horizonte na altura de **58–66%** da altura, abaixo do centro, para dar céu/vazio na metade superior |
| **Foco visual** | Um só. Se houver dois elementos disputando, a imagem está errada |
| **Espaço negativo** | ≥ 34% da largura, contíguo, à esquerda. É requisito, não preferência |
| **Iluminação** | Fonte fria **superior-direita**, coerente com toda a página. Sem luz frontal, sem luz quente dominante |
| **Paleta** | Alinhada a `--color-deep` / `--color-deep-lit`: azuis frios e grafite. Sem magenta, sem laranja saturado, sem verde-neon |
| **Contraste** | Baixo a médio. Imagem contrastada demais briga com o texto; o scrim não deve ter que trabalhar sozinho |
| **Tratamento** | Saturação −25%, pretos elevados ~4% (preto absoluto mata a profundidade), gradação empurrada para o azul nas sombras, leve vinheta coerente com a luz |
| **Formato / proporção** | AVIF · 16:9 |
| **Resolução mínima** | 2560×1440 |
| **Peso** | ≤ 220KB em AVIF q≈72 |
| **Recortes** | Nenhum. A variante mobile é **outra composição** (A2), não um recorte |
| **Não pode aparecer** | UI do jogo (barras, minimapa, nameplate, chat), nome de jogador, número de dano, cursor, marca d'água, texto embutido, logotipo, rosto reconhecível de pessoa real, partículas em excesso |
| **Origem preferida** | **Captura da própria guilda**, feita no jogo com a UI escondida (`Alt+Z` esconde a interface) e em resolução máxima. É captura deles, do jogo deles, e é a opção de menor risco |
| **Instrução de captura** | Modo de câmera livre se disponível; FOV amplo; hora do dia/iluminação da zona escolhida pelo tom frio; desligar efeitos de tela cheia (screen-space); tirar 10+ e escolher 1 |
| **Pós-produção** | Gradação conforme "Tratamento"; export AVIF q72; **não** aplicar blur, glow, letterbox ou textura de grão em pós — a página já tem seu próprio acabamento |
| **Geração por IA** | **Não recomendada.** É exatamente onde "aparência gerada por IA" fica mais evidente, e a direção foi aprovada com esse veto. Se for a única saída, a imagem deve ser abstrata (formações, luz, profundidade) e nunca conter personagem, criatura, arquitetura reconhecível de WoW, ou qualquer coisa que possa passar por arte oficial — e deve ser rotulada como sintética no inventário |
| **Critérios de aprovação** | (1) coluna de texto legível **sem** aumentar o scrim além do especificado; (2) nenhum elemento de interesse no terço esquerdo; (3) luz coerente com superior-direita; (4) ≤220KB; (5) nenhum item da lista "não pode aparecer" |
| **Estratégia temporária `[OBRIGATÓRIA]`** | O **campo profundo** (§18.5) é construído na **etapa 2** e é a hero completa e apresentável desde o primeiro dia. Não é espera: é a solução oficial provisória, e continua por baixo da imagem quando ela chegar. **A hero nunca aparece vazia, cinza ou com moldura de "imagem aqui".** Ponto de troca: uma camada nova em `hero.tsx`, entre a camada 1 e a 2 do scrim — zero mudança de layout |

### 18.3 Asset ausente A2 — fundo da hero, mobile

Composição **própria**. Recortar o A1 é explicitamente rejeitado.

| Campo | Especificação |
| --- | --- |
| **Nome** | `hero-mobile.avif` |
| **Composição** | Retrato. Massa focal na **metade inferior**; os 45% superiores em baixa frequência, porque ali ficam a nav, a sobrancelha e o disco |
| **Enquadramento** | Mais fechado que o desktop. O plano geral não sobrevive a 390px de largura |
| **Espaço negativo** | Uma faixa horizontal contígua entre 12% e 55% da altura |
| **Formato / proporção** | AVIF · 9:19.5 |
| **Resolução mínima** | 1170×2532 |
| **Peso** | ≤ 120KB |
| **Demais campos** | idênticos ao A1 (iluminação, paleta, tratamento, proibições) |
| **Aprovação** | O disco de 280px sobreposto aos 45% superiores tem que ficar legível **sem** reforçar o scrim |
| **Estratégia temporária `[OBRIGATÓRIA]`** | A variante retrato do campo profundo: mesmas quatro camadas com o gradiente da camada 3 em `180deg`, e o padrão de sondagem adensando embaixo em vez de à direita. Construída junto com A1, na etapa 2 |

### 18.4 O scrim — é objeto de design, não overlay

Overlay preto chapado é o erro que transforma key art em wallpaper. Especificação:

```
Camada 1 (sempre, mesmo sem imagem): --color-deep chapado.
Camada 2: gradiente radial elíptico, centro em 72% 42%, de
          --color-deep-lit (18% de opacidade) até transparente em 70% do raio.
          É a "luz" do campo.
Camada 3 (só sobre a imagem): gradiente linear a 100deg,
          de --color-bg 88% em 0%, a --color-bg 55% em 42%,
          a transparente em 78%.
          Abre onde a arte tem massa (direita), fecha onde o texto senta (esquerda).
Camada 4: vinheta radial das bordas, --color-bg 0% → 40%, coerente com a luz.
```

Mobile: a camada 3 vira gradiente vertical (`180deg`), fechando no topo (onde o disco fica) e
abrindo embaixo.

**Piso de luminância garantido:** com as camadas 1–4, a área da coluna de texto nunca ultrapassa
`#1a1f2b` de luminância, independentemente da imagem. É isso que torna o contraste do texto
previsível **antes** de a imagem existir — e por isso o texto nunca precisa de sombra.

### 18.5 Solução oficial provisória da hero: `campo-profundo.tsx` `[OBRIGATÓRIA]`

Construída na **etapa 2**, antes de qualquer seção. Não é contingência para o caso de A1/A2
atrasarem — é a hero de trabalho durante todo o desenvolvimento, e é o exemplo canônico do que
§2.1 exige. O componente `campo-profundo.tsx` desenha o fundo inteiro em CSS + SVG:

- as quatro camadas do scrim, que já são CSS puro e independem de imagem;
- sobre elas, um padrão SVG de **linhas de sondagem** — curvas de nível concêntricas,
  irregulares, traço de 1px em `--color-border` a 30%, adensando à direita e rareando à
  esquerda. Gera profundidade e leitura de "carta batimétrica" sem nenhuma foto. ~3KB, `<defs>`
  + `<pattern>`, `aria-hidden`.

Isso é a opção 5 da ordem de preferência da instrução (texturas criadas com CSS/SVG) e é uma
solução **boa por mérito próprio**, não um placeholder de espera: sobrevive a 3G, não tem risco
de PI, não tem peso, e continua ali por baixo quando a imagem chegar. Quando A1/A2 existirem, a
imagem entra como camada **entre** a 1 e a 2, sem mudar mais nada.

### 18.6 Assets ausentes menores, com estratégia temporária obrigatória

| ID | Asset final | Especificação do final | Aprovação | **Estratégia temporária `[OBRIGATÓRIA]`** |
| --- | --- | --- | --- | --- |
| **A3** | `titan-inc-wordmark.svg` | Vetorização do wordmark atual. Duas variantes: (a) cores originais; (b) **knockout monocromático** em `currentColor`. Traçados otimizados, `viewBox` correto, sem `<image>` embutido, ≤6KB | Legível a 18px; sem serrilhado; sem raster embutido | **Wordmark tipográfico** — ver §18.8.1. Archivo 800, `TITAN` em `--color-fg` + `INC` em `--color-accent`, `tracking -0.02em`, com uma régua de 1px de `--color-edge` sob a palavra. É identidade, não texto solto |
| **A4** | `titan-inc-anchor.svg` | Só a âncora, monocromática, para a marca-d'água do footer e o favicon. ≤4KB | Reconhecível a 32px | **Marca geométrica provisória** — o próprio disco de aferição, reduzido: círculo com 3 detentes e agulha, 1px, em `currentColor`. Já existe como geometria (§8.2), então é reuso, não trabalho novo |
| **A5** | `og-image.png` | 1200×630. Campo profundo + disco + wordmark + uma linha. **É o cartão que aparece no Discord**, canal principal da guilda (Regra 7) — merece ser desenhado, não gerado por screenshot | Legível como miniatura no Discord | **OG dinâmica oficial** — ver §18.8.2. Gerada em build/runtime com o campo profundo, o disco no estado real e o wordmark tipográfico. Não é rascunho: é uma peça acabada que pode virar a definitiva |
| **A6** | favicon | Derivado de A4: `icon.svg` + `apple-icon.png` 180×180 (convenções de arquivo do App Router) | Reconhecível a 16px | **Favicon oficial provisório** — o disco reduzido de A4, em `icon.svg` com 2 detentes acesas, fundo `--color-bg`. Reconhecível a 16px por construção, porque é geometria, não desenho |
| **A7** | retratos reais do roster | fotografia/render servido pelo backend (§10.0) | — | **Retrato editorial** — §18.8.3. É também o estado permanente de quem não tem retrato |

**O PNG atual** (`public/titan-inc-logo.png`, 264×109, aquarela raster, 31KB) permanece
utilizável **na hero em 180px**, onde a aquarela funciona. **Não serve para a nav** a 22px, onde
vira mancha — por isso a nav usa o wordmark tipográfico de A3 desde a etapa 2, e nunca uma
versão espremida do PNG.

### 18.7 Conformidade — obrigatória, não opcional

Duas linhas no footer, derivadas diretamente do que foi pesquisado (§18.1, M2 e M6):

1. **Raider.IO:** link textual de volta a `raider.io` — é condição expressa dos termos de uso da
   API que o projeto já consome hoje.
2. **Blizzard:** *"World of Warcraft é marca registrada da Blizzard Entertainment, Inc. Este é um
   site de fãs, sem afiliação ou patrocínio oficial."* — as diretrizes exigem crédito e proíbem
   implicar afiliação.

Também derivado das diretrizes: **não** usar marca da Blizzard no domínio do site.

### 18.8 Especificação dos placeholders oficiais

Estes **não** são rascunhos. São peças acabadas, construídas com os tokens, que sustentam a
página inteira enquanto os assets finais não chegam — e algumas podem simplesmente ficar.

#### 18.8.1 Wordmark tipográfico provisório (substitui A3)

| Campo | Especificação |
| --- | --- |
| Construção | Texto real em HTML, não imagem. `TITAN` + `INC` num `<span>` cada |
| Face | Archivo 800, largura expandida se o eixo `wdth` existir (§3.3) |
| Cor | `TITAN` em `currentColor`; `INC` em `--color-accent` — deriva direto da logo, onde o "INC" já é a palavra destacada |
| Tracking | `-0.02em` no conjunto, `+0.06em` entre as duas palavras |
| Marca | Régua de 1px em `--color-edge` correndo sob a palavra, com 4px de folga. É o que impede que pareça texto solto |
| Tamanhos | 22px (nav desktop) · 18px (nav mobile) · 34px (footer) |
| Acessibilidade | O conjunto é envolvido por um elemento com `aria-label="Titan Inc"`; os `<span>` são `aria-hidden` para não serem lidos como duas palavras |
| Peso | **0 bytes.** É tipografia que já está carregada |
| Ponto de troca | `ui/wordmark.tsx` — um arquivo, um `return`. Trocar por `<svg>` não move layout porque a altura é a mesma |
| Critério de aprovação | Legível a 18px; reconhecível como marca, não como parágrafo; não parece texto que "sobrou" |

#### 18.8.2 OG image oficial provisória (substitui A5)

Gerada por código, não desenhada à mão. Composição fixa a 1200×630:

```
campo profundo (as 4 camadas do scrim, em landscape)
  + disco de aferição a 340px, à direita, no estado REAL do dado
  + wordmark tipográfico à esquerda, 64px
  + uma linha de 1 sentença abaixo, 28px, --color-fg-muted
  + régua de 1px na base em --color-edge
```

**O disco no estado real é o ponto:** o cartão que aparece no Discord passa a mostrar a
progressão atual da guilda. Isso é substancialmente melhor que uma imagem estática e é o
motivo de esta peça poder virar a definitiva.

`[VERIFICAR]` na implementação: a rota de OG dinâmica do App Router (`opengraph-image.tsx`)
tem restrições de CSS e de fonte. Se o disco não renderizar com fidelidade nesse ambiente, o
fallback é uma OG estática construída com a mesma composição, exportada uma vez. **Não é
aceitável** cair para "sem OG" nem para uma OG só com o wordmark num fundo chapado.

#### 18.8.3 Retrato editorial (A7)

O placeholder de imagem de conteúdo. Determinístico: a mesma pessoa produz sempre o mesmo
retrato.

| Campo | Especificação |
| --- | --- |
| Construção | SVG inline no Server Component. Sem requisição, sem `next/image`, sem canvas |
| Proporção | 3:4 — **idêntica** ao retrato real, para a troca não mover layout |
| Camadas | (1) campo `--color-deep` com gradiente radial de luz em 38% 28% até `--color-deep-lit`; (2) arco de 1px na **cor da classe**, com raio grande, cruzando o terço inferior como a linha de um ombro; (3) inicial do nome em Archivo 800 a 54px, `--color-fg-subtle` a 40%, centralizada e deslocada 8% acima do centro óptico |
| Determinismo | O ângulo e a posição do arco derivam de um hash de `${realm}/${name}`, num intervalo estreito (±12°). Variação suficiente para a galeria não parecer carimbada; contida o bastante para o conjunto não virar bagunça |
| Cor da classe | Já é usada na hairline da placa (§10.2). O arco é o segundo e **último** uso de cor de classe. Nunca preenchimento |
| Acessibilidade | `aria-hidden` — o nome, classe e realm estão em texto ao lado, exatamente como no retrato real |
| Peso | ~0.4KB por placa, inline. Com 50 placas, ~20KB de HTML — dentro do orçamento |
| Ponto de troca | `placa-tripulante.tsx`, o ramo `portraitUrl === null`. **O ramo permanece para sempre**, porque nem todo membro terá retrato |
| Critério de aprovação | 30 retratos lado a lado parecem uma galeria coesa, não 30 avatares de erro. Um print da seção é apresentável sem explicação |

### 18.9 Quadro consolidado — nenhum asset sem estratégia

| ID | Asset final | Onde aparece | Estratégia temporária | Existe desde | Ponto de troca | Move layout ao trocar? |
| --- | --- | --- | --- | --- | --- | --- |
| A1 | fundo da hero, desktop | hero | campo profundo (§18.5) | etapa 2 | camada em `hero.tsx` | **não** |
| A2 | fundo da hero, mobile | hero | campo profundo, variante retrato | etapa 2 | idem | **não** |
| A3 | wordmark SVG | nav, footer | wordmark tipográfico (§18.8.1) | etapa 2 | `ui/wordmark.tsx` | **não** |
| A4 | âncora SVG | footer, favicon | disco reduzido | etapa 2 | `ui/marca.tsx` | **não** |
| A5 | OG image | metadata | OG dinâmica com o disco real (§18.8.2) | etapa 2 | `opengraph-image.tsx` | n/a |
| A6 | favicon | aba | disco a 16px | etapa 2 | `app/icon.svg` | n/a |
| A7 | retratos do roster | roster | retrato editorial (§18.8.3) | etapa 8 | ramo `portraitUrl === null` | **não** |

**Nenhuma linha desta tabela pode ficar sem estratégia temporária.** Se um asset novo aparecer
no projeto, ele entra aqui com a coluna preenchida antes de ser usado em qualquer componente.

---

## 19. Copy e conteúdo

Não inventar conteúdo definitivo da guilda. O que segue é **estrutura + função + limite**, com
exemplos marcados `[PROV]` que existem para destravar a implementação e **têm** de ser
substituídos (etapa 15 do plano).

> **E nenhum campo fica vazio esperando texto** — §2.1. Onde não há copy real nem `[PROV]`
> reaproveitável, entra Lorem Ipsum calibrado. A regra está em §19.4 e é de cumprimento
> obrigatório.

### 19.1 Inventário

| ID | Onde | Função | Limite | Situação |
| --- | --- | --- | --- | --- |
| T1 | Hero, sobrancelha | Situar o tier e a season | 32 car. | `[BLOQUEADO]` — vem do dado (`seasonLabel`). Sem dado: `TITAN INC · DESDE 2009` |
| T2 | Hero, `h1` | A tese em uma frase | 58 car., 3 linhas | `[PROV]` reaproveitar o atual: *"Endgame sem abrir mão da vida real"* — já estava publicado |
| T3 | Hero, corpo | Qualificar em uma linha | 140 car. | `[PROV]` do atual: *"Guilda de raid e Mythic+ desde 2009. Cinco horas por semana, para gente com trabalho, família e faculdade — e ainda assim progredindo."* |
| T4 | Hero, ação | Verbo de entrada | 22 car. | `[FECHADO]` **"Candidatar-se"** |
| T5 | Hero, procedência | Prova externa | 48 car. | `[BLOQUEADO]` precisa da URL (C2). Texto: *"Aferido no Warcraft Logs · <data>"* |
| T6 | Instrumento, leitura | O número | — | derivado do dado |
| T7 | Instrumento, rótulo de dificuldade | — | 12 car. | derivado |
| T8 | About, `h2` | Enunciar a seção | 42 car. | `[PROV]` *"Cinco horas por semana, desde 2009"* |
| T9 | About, corpo | 2–3 parágrafos, ≤34ch de largura | **exatamente ~600 car. total** | `[LOREM]` — C1 continua sendo a lacuna real, mas a seção **não fica vazia**: Lorem Ipsum de 600 caracteres em 3 parágrafos, conforme §19.4 |
| T10 | About, marginália | 3 fatos | 3× (12 + 16) car. | `[PROV]` `2009` / `5H POR SEMANA` / `TER · QUI · 21:00` |
| T11 | Roster, `h2` + linha | Enquadrar quem é o time | 42 + 120 car. | `[PROV]` *"O time de raid"* + *"Quem senta na raid. A lista é curadoria do raid leader, não filtro de rank."* |
| T12 | Roster, procedência | Contagem e data | 44 car. | derivado |
| T13 | Apply, `h2` + 2 linhas | Convidar sem hype | 42 + 200 car. | `[PROV]` *"Entrar para o registro"* + *"Se o horário bate com o seu, vale conversar. Isto é o que perguntamos — responda com calma."* |
| T14 | Apply, ajuda por campo | Reduzir erro | ≤80 car. cada | `[FECHADO]` — os textos estão em §11.3 |
| T15 | Apply, erros | Específicos, em pt-BR | ≤90 car. | `[FECHADO]` — mapeados do Zod; `battleTag` já vem do schema |
| T16 | Apply, aviso de envio fechado | Honestidade | ≤180 car. | `[FECHADO]` — §11.8 |
| T17 | Apply, sucesso | Confirmar e dizer o próximo passo | ≤160 car. | `[PROV]` *"Registrado. A liderança lê as candidaturas e responde pelo Discord."* — **depende de C2 estar certo** |
| T18 | Footer, linha da guilda | — | 90 car. | `[PROV]` |
| T19 | Footer, conformidade | Obrigatório | — | `[FECHADO]` — §18.7 |
| T20 | Nav, rótulos | — | 12 car. cada | `[FECHADO]` `SOBRE` · `TRIPULAÇÃO` · `CANDIDATURA` |
| T21 | Estados vazios/degradados | Explicar sem alarmar | ≤160 car. | `[FECHADO]` — nos respectivos parágrafos |
| T22 | `metadata` (title, description, OG) | SEO e cartão do Discord | 60 / 155 car. | `[PROV]` reaproveitar o `layout.tsx` atual |

### 19.2 Tom

Direto, adulto, específico. Sem exclamação, sem "junte-se a nós!", sem hype, sem emoji, sem
maiúsculas para ênfase. A voz dos comentários do próprio repositório é a referência: explica o
porquê, admite limite, não vende.

### 19.3 Lacunas que precisam ser fornecidas

**Nenhuma destas lacunas bloqueia a implementação.** Todas têm contorno visual por §19.4; o que
elas travam é a **publicação**, não a construção. A etapa 15 do plano é o portão.

| ID | O que | Trava |
| --- | --- | --- |
| **C1** | 1–2 parágrafos do About na voz da guilda. **Sem nome de oficial** (repo público) | publicação. Enquanto não chega: Lorem Ipsum de 600 caracteres |
| **C2** | URLs: Raider.IO da guilda, Warcraft Logs da guilda, convite do Discord | prova externa (T5), footer, e o fallback do Apply (§11.8) |
| **C3** | Nome do tier/raid corrente e da season, como a guilda fala | T1, e o texto do bisel do instrumento |
| **C4** | O que "purple+ de parse" significa na prática para um candidato | enquadramento do Apply |
| **C5** | Confirmação de "desde 2009", "5h/semana", "ter e qui 21:00–23:30" | marginália do About |
| **C6** | Confirmação de que a sobrancelha atual, `Ghosts of K'aresh`, ainda é o tier corrente | Provavelmente **desatualizada**: o `CLAUDE.md` descreve a season atual como um tier de três raids e registra que a próxima season começa em **18/08/2026** — dentro de duas semanas desta especificação. Não usar esse texto sem confirmar |

### 19.4 Regra de conteúdo temporário `[FECHADO]` — nova nesta revisão

> **Toda ausência de copy é substituída obrigatoriamente por conteúdo temporário.**
> A página permanece **visualmente completa** durante todo o desenvolvimento.

**Como:**

1. **Lorem Ipsum**, não texto inventado sobre a guilda. A distinção importa: texto plausível em
   português corre o risco real de ser lido como fato e vazar para produção. Lorem Ipsum é
   inconfundivelmente provisório para qualquer humano, e ainda assim preenche o espaço.
2. **Calibrado ao tamanho esperado.** Não "um lorem qualquer": a contagem de caracteres tem de
   bater com o limite da linha correspondente em §19.1, com tolerância de ±10%. Um Lorem curto
   demais esconde problemas de quebra; longo demais inventa problemas que não existem.
3. **Hierarquia preservada.** Título continua sendo título, com o mesmo número de linhas
   previsto. Parágrafo continua com o mesmo número de parágrafos.
4. **Espaçamento e comportamento responsivo preservados.** O conteúdo temporário tem de exercer
   o layout exatamente como o final — inclusive nas quebras de 320px e no zoom de 200%.
5. **Marcado no código**, nunca na tela: `{/* [LOREM] T9 — trocar quando C1 chegar */}`. Sem
   tarja, sem borda, sem aviso dentro da composição. O aviso de provisoriedade da página inteira
   é a tarja de desenvolvimento de §6.1.

**Proibido, sem exceção:**

- título vazio ou com o texto "Título";
- parágrafo vazio ou com uma frase de uma palavra;
- **botão sem rótulo** — todo botão tem verbo real (os rótulos de ação já estão fechados: T4,
  T13, submit, login);
- card, placa ou célula vazia;
- lista com menos itens do que a versão final teria;
- `&nbsp;`, `—` ou `...` como preenchimento;
- `TODO`, `TBD`, `xxx`, `Lorem` sozinho visível na tela.

**O que NÃO recebe Lorem Ipsum:** rótulo de navegação, rótulo de campo de formulário, mensagem
de erro, mensagem de estado vazio e mensagem de estado degradado. Todos esses já estão
**fechados** neste documento (§7.2, §11.3, §11.9, §8.6, §10.6) e escrevê-los como Lorem
esconderia justamente os textos que precisam ser lidos e revisados.

**Aplicação concreta hoje:** o único ponto que precisa de Lorem é **T9** (corpo do About, ~600
caracteres em 3 parágrafos). Todo o resto tem `[PROV]` reaproveitado do que já estava publicado
ou está fechado neste documento.

---
## 20. Critérios de aceite

Todos observáveis. Nenhum depende de gosto.

### 20.1 Visual

| # | Critério |
| --- | --- |
| V1 | A progressão é identificável **no primeiro viewport**, em desktop e mobile, sem rolar |
| V2 | A leitura textual (`6/8` + dificuldade) existe em DOM como texto selecionável, não apenas dentro do SVG |
| V3 | O `h1` não compete com o instrumento: em ≥1280, o instrumento sobrepõe a coluna de texto e sangra a borda direita conforme §8.1 |
| V4 | A arte preserva área negativa para a coluna textual em **todos** os breakpoints (§18.2/18.3) |
| V5 | Nenhuma cor hexadecimal literal em componente; `grep -rE "#[0-9a-fA-F]{6}" apps/web/app apps/web/lib` retorna só `globals.css` |
| V6 | Toda superfície elevada tem luz no topo e sulco na base (§1.1); nenhuma tem borda uniforme nos 4 lados como recurso de elevação |
| V7 | Nenhum `backdrop-filter`, nenhum `rounded-lg`+ em elemento novo, nenhum `box-shadow` difuso |
| V8 | Turquesa ocupa < 3% da área visível em qualquer viewport (verificação por inspeção, não por medição automática) |
| V9 | Exatamente **duas** ações sólidas na página: hero e submit do Apply |
| V10 | Uma fonte de luz só (superior-direita) em todos os elementos gravados |
| V11 | Espaço acima de cada `h2` > espaço abaixo dele |
| V12 | O roster não tem cabeçalho de coluna, ordenação, filtro, badge colorido ou barra de progresso |
| V13 | Nenhuma seção além das seis aprovadas |

### 20.2 Funcional

| # | Critério |
| --- | --- |
| F1 | Os 3 links de âncora rolam para a seção correta, com a nav não cobrindo o título (`scroll-margin-top`) |
| F2 | O tick da seção ativa acompanha o scroll e nenhuma seção fica acesa no topo da página |
| F3 | Selecionar uma detente troca o painel de leitura sem alterar a altura da hero |
| F4 | O painel de leitura nunca começa vazio |
| F5 | O botão de login abre popup **ou**, se bloqueado, oferece o link de redirect — nunca falha em silêncio |
| F6 | O Apply valida no blur e no submit, foca o primeiro campo inválido e exibe resumo de erros |
| F7 | O Apply **não** informa sucesso enquanto não houver endpoint (§11.8) |
| F8 | Nenhum dado é perdido após erro de submit |

### 20.3 Responsivo

| # | Critério |
| --- | --- |
| R1 | Sem rolagem horizontal em 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920 — exceto o trilho do roster |
| R2 | Em <768 o instrumento aparece **antes** do `h1` no fluxo visual e no DOM |
| R3 | Em <768 o roster é trilho com snap, e a segunda placa é parcialmente visível na posição inicial |
| R4 | A marginália do About é faixa horizontal em <768 e calha lateral em ≥1024 |
| R5 | Em 400% de zoom a 1280, o layout reflui sem rolagem horizontal |
| R6 | Em landscape 740×360 a hero não empurra a ação para fora da tela |
| R7 | Alturas de placa e do painel de leitura constantes dentro de cada breakpoint |
| R8 | O roster funciona em 1, 2, 5, 8, 12, 16, 20 e 30 **sem nenhum ajuste manual**: nenhuma fileira quebrada, nenhuma placa esticada, nenhuma imagem deformada (§10.4) |

### 20.4 Técnico

| # | Critério |
| --- | --- |
| TE1 | `pnpm format:check && pnpm build && pnpm lint && pnpm typecheck && pnpm test` passa, nesta ordem |
| TE2 | Nenhuma dependência nova no `pnpm-lock.yaml` |
| TE3 | Nenhum arquivo alterado em `apps/api`, `packages/shared` ou `app/interno/**` |
| TE4 | Nenhuma chamada a domínio externo saindo do browser (Network sem requisição a `raider.io`, `warcraftlogs.com` ou `*.battle.net` além do fluxo de OAuth) |
| TE5 | `lib/api.ts` continua `server-only` e não é importado por Client Component |
| TE6 | O comentário-contrato de §1 aparece no HTML do build de produção |
| TE7 | Um `<main>` só na página |
| TE8 | `geometria.spec.ts` cobre os 11 casos de §4.3 e passa |

### 20.5 Conteúdo, mídia e placeholder

| # | Critério |
| --- | --- |
| C-A1 | Nenhum nome real de membro, Discord tag ou Battle.tag versionado |
| C-A2 | Nenhum nome de oficial na página |
| C-A3 | Nenhuma arte protegida de terceiros commitada em `public/` |
| C-A4 | Atribuição do Raider.IO e aviso de marca da Blizzard presentes no footer |
| C-A5 | `grep -r "\.mock" apps/web` lista **apenas** `lib/mock/` |
| C-A6 | `NODE_ENV=production pnpm --filter web build` **falha** se algum mock ainda estiver importado |
| C-A7 | Enquanto houver mock, a tarja de desenvolvimento está visível na seção |
| C-A8 | Todo texto `[PROV]` e `[LOREM]` está marcado no código com comentário |
| C-A9 | Todo asset de §18.9 tem estratégia temporária implementada; nenhuma linha da tabela sem ela |
| C-A10 | Trocar qualquer placeholder pelo asset final **não move layout** (verificar com A1 e A7, comparando antes/depois no mesmo viewport) |

### 20.6 Acessibilidade

| # | Critério |
| --- | --- |
| A1 | Um `h1`; nenhum nível de heading pulado |
| A2 | Skip link é o primeiro focável e leva a `#conteudo` |
| A3 | Toda `<section>` tem nome acessível |
| A4 | Toda a página é operável só por teclado, incluindo detentes, painel mobile e formulário |
| A5 | Foco visível em 100% dos focáveis, com ≥3:1 contra o fundo |
| A6 | Nenhuma informação transmitida só por cor (§16.6) |
| A7 | Um leitor de tela obtém a progressão completa **sem** interagir com as detentes |
| A8 | Alvos de toque ≥44×44 |
| A9 | Com `prefers-reduced-motion`, agulha e detentes renderizam no estado final e nada transiciona |
| A10 | Com JS desligado: conteúdo, links, trilho e formulário nativo funcionam; login oferece redirect |
| A11 | Zero violações sérias/críticas no axe DevTools |

### 20.7 Performance

| # | Critério |
| --- | --- |
| P1 | Orçamentos de §17.1 respeitados |
| P2 | LCP < 2.0s e CLS < 0.02 em Lighthouse mobile com throttling padrão |
| P3 | Lighthouse ≥ 95 em Performance, Acessibilidade e Boas Práticas |
| P4 | Sem layout shift ao carregar retratos (todos com `aspect-ratio`) |
| P5 | A leitura `6/8` está visível **antes** de qualquer imagem carregar (teste com imagens bloqueadas) |
| P6 | Console limpo: sem erro, sem warning de chave duplicada, sem aviso de imagem sem `sizes` |

### 20.8 Checklist de completude visual `[FECHADO]` — novo nesta revisão

**Este bloco é verificado ao final de cada etapa do plano, não só no fim do projeto.** É a
tradução operacional de §2.1.

| # | Verificação | Como |
| --- | --- | --- |
| **PL1** | **O teste do print.** Tirar screenshot de desktop e mobile da página inteira, agora. Mostrar a alguém de fora sem explicar nada. Se a pessoa perguntar "isso está quebrado?" ou "falta imagem aqui?", falhou | manual, a cada etapa |
| PL2 | Nenhuma área da página vazia, cinza, tracejada ou com moldura de "imagem aqui" | inspeção visual |
| PL3 | Nenhum título, parágrafo, botão, card ou lista sem conteúdo (§19.4) | inspeção visual + `grep -rE "TODO\|TBD\|xxx\|>\s*<" apps/web/app` |
| PL4 | Nenhum skeleton em estado de repouso — skeleton só aparece durante carregamento real | desligar a rede depois de carregado; nada deve virar skeleton |
| PL5 | Todo placeholder usa exclusivamente tokens oficiais; zero cinza neutro fora da paleta | `grep` de §20.1 V5 + inspeção |
| PL6 | Todo placeholder respeita a proporção do asset final | comparar `aspect-ratio` declarado com a especificação de §18 |
| PL7 | O roster está cheio e ritmado em qualquer contagem de 1 a 50 | percorrer `ROSTER_MOCK` inteiro |
| PL8 | A hero é apresentável **sem nenhuma imagem** carregada | bloquear imagens no DevTools |
| PL9 | A nav mostra marca reconhecível, não texto solto | inspeção a 18px e 22px |
| PL10 | O cartão de compartilhamento existe e mostra a progressão | colar a URL no Discord ou usar um validador de OG |
| PL11 | Nenhum aviso de provisoriedade **dentro** da composição — só a tarja de dev de §6.1 | inspeção visual |

**Critério de saída de qualquer etapa:** PL1 aprovado. Uma etapa que deixa a página com cara de
canteiro de obras não está concluída, mesmo que o código dela funcione.

---

## 21. Plano de implementação

16 etapas. Cada uma é commitável isoladamente e deixa a página em estado válido.
**Nenhuma etapa altera `apps/api` ou `packages/shared`.**

> **Critério de saída universal, aplicado a TODAS as etapas:** o checklist **PL1** de §20.8 —
> *tirar print de desktop e mobile e mostrar a alguém de fora sem explicar*. Uma etapa que
> deixa a página com cara de canteiro de obras não está concluída, mesmo que o código dela
> funcione. Este critério vale a partir da etapa 2 e não é negociável em nenhuma delas.

| # | Objetivo | Pré-condição | Cria | Altera | Entrega | Risco | Validação | Commit isolado | Mensagem sugerida |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **1** | Inventário e documentação | — | `docs/landing/04-implementation-spec.md` (este) | — | O contrato existe | — | leitura | sim | `Especificacao de implementacao da landing publica` |
| **2** | Fundação visual **+ todos os placeholders oficiais** | 1 | `ui/wordmark.tsx`, `ui/marca.tsx`, `campo-profundo.tsx`, `opengraph-image.tsx`, `app/icon.svg` | `globals.css`, `layout.tsx` | 4 tokens novos, utilitário de chapa, `prefers-reduced-motion` global, troca Geist→Archivo, contrato no `<body>`, **e as estratégias temporárias de A1–A6 (§18.9) prontas e em uso** | Eixo `wdth` pode não existir (§3.3) — decisão já documentada. `opengraph-image.tsx` tem restrições de CSS (§18.8.2) | `pnpm build`; contraste medido (§3.2); grep do contrato no build; **§20.8 PL5, PL6, PL9, PL10** | sim | `Fundacao visual e os placeholders oficiais que sustentam a pagina` |
| **3** | Estrutura semântica | 2 | `ui/chapa.tsx`, `ui/rotulo.tsx`, `ui/acao.tsx` | `page.tsx`, `layout.tsx` | Landmarks, skip link, 4 seções vazias com heading, um `<main>` só | `page.tsx` hoje tem `<main>` próprio — remover | axe sem violação; navegação por landmark | sim | `Esqueleto semantico da landing, com skip link e landmarks` |
| **4** | Navbar e footer | 3 | `site-nav.tsx`, `nav-painel.tsx`, `site-footer.tsx` | `layout.tsx` | Régua, ticks, scroll-spy, disclosure mobile, footer com conformidade | Focus trap é o ponto delicado | teclado completo; `Escape`; sem JS | sim | `Regua de afericao na navegacao, e o fecho da pagina` |
| **5** | Instrumento (dado mockado) | 3 | `instrumento/*`, `lib/mock/index.ts`, `lib/mock/progressao.mock.ts` | — | Disco, detentes, leitura, painel, todos os estados de §8.6 | O maior risco técnico da issue; geometria tem que sair certa | `geometria.spec.ts` verde; os 4 cenários do mock renderizados | sim | `Disco de afericao: a progressao lida como instrumento` |
| **6** | Hero | 2, 5 | `hero.tsx` | `page.tsx` | Composição desktop e mobile, scrim de 4 camadas, sobre o campo profundo da etapa 2. **A hero fica completa e fotografável aqui**, mesmo sem A1/A2 | — | R2; V1–V4; P5; **PL8** | sim | `Hero com o campo profundo e o instrumento sobreposto` |
| **7** | About | 3 | `sobre.tsx` | `page.tsx` | Passagem quieta, marginália nas duas formas, **corpo com Lorem calibrado de 600 car. (§19.4)** | Texto `[PROV]`/`[LOREM]` marcado no código | R4; largura ≤34ch; **PL3** | sim | `About como passagem quieta, com os fatos na marginalia` |
| **8** | Roster com placeholders | 3 | `roster/*` (inclui `retrato-editorial.tsx`), `lib/mock/roster.mock.ts` | `page.tsx` | Grid derivado da contagem, trilho, placa, retrato editorial, todos os estados de §10.5/10.6 | Chave de React: o mock tem colisão de acento de propósito. Colunas derivadas é o ponto delicado | **1/2/5/8/12/16/20/30/50**; console sem chave duplicada; R3; **PL7** | sim | `Placas de tripulacao, do grid ao trilho de folhear` |
| **9** | Apply visual e validação | 3 | `apply/*` | `page.tsx` | Campos, detentes de dia, validação, todos os estados, envio **fechado** | F7 é o critério que não pode falhar | F6, F7, F8; axe no formulário | sim | `Candidatura como entrada no registro, com o envio ainda fechado` |
| **10** | Login popup (front) | 4 | `oauth/callback/page.tsx`, `login-button.tsx` | `lib/config.ts` | Fluxo completo do lado do Next; inerte com aviso enquanto B4 não existir | Não descrever como funcional | popup bloqueado, fechado, timeout | sim | `Login em popup do lado do Next, com o redirect como rede de seguranca` |
| **11** | Movimento | 5–9 | — | componentes | As 10 animações de §15.2, e só elas | Espalhar movimento é a falha típica | A9; 60fps no perfil | sim | `Assentamento: uma linguagem de movimento, dois momentos` |
| **12** | Responsividade | 6–9 | — | componentes | Matriz de §14.1 fechada nos 9 breakpoints | — | R1–R7 | sim | `Composicao propria em cada largura, nao um desktop cortado` |
| **13** | Acessibilidade | 11–12 | — | componentes | §16 inteiro auditado e corrigido | — | A1–A11; axe; NVDA ou VoiceOver no instrumento | sim | `Passada de acessibilidade: foco, teclado e a leitura do instrumento` |
| **14** | Performance e entrada de assets finais | 12 | assets, se chegarem | `next.config.ts` (só se o backend devolver host externo — §17.3) | Orçamentos, `sizes`, lazy, AVIF; troca dos placeholders que já tiverem substituto | Se A1/A2 não chegarem, **não há problema**: o campo profundo é a solução oficial, não uma espera | P1–P6; Lighthouse; **C-A10** (a troca não move layout) | sim | `Orcamento de performance e entrada das imagens` |
| **15** | Remoção de temporários | 14 | — | `page.tsx`; remove `_components/api-status.tsx` | Painel de stack fora; `[PROV]`/`[LOREM]` trocados **se e somente se** C1–C6 chegaram; mocks removidos **se e somente se** os endpoints existirem | Não remover mock antes do endpoint, nem Lorem antes da copy. **Remover um temporário sem substituto abre um buraco e viola §2.1** | C-A5 a C-A10; **§20.8 inteiro** | sim | `Remove o painel de verificacao da stack e os textos provisorios` |
| **16** | Prontidão para PR | 15 | — | — | Sequência do CI verde, QA de §22 preenchida | — | TE1 | — | (abre o PR) |

**Ordem justificada:** fundação antes de tudo evita retrabalho de token — e a etapa 2 agora
carrega **todos os placeholders oficiais**, porque eles são a base sobre a qual as seções são
construídas, não um remendo do fim (§2.1); o instrumento vem
**antes** da hero porque é a peça de maior risco e a hero se compõe em torno dele; movimento,
responsividade, acessibilidade e performance vêm depois das seções porque cada uma é uma
passada transversal — intercalá-las com construção gera retrabalho; remoção de temporários é
penúltima porque depende de conteúdo externo chegar.

**Sobre o runner de teste:** `apps/web` não tem `test` no `package.json` hoje, então
`pnpm test` no root simplesmente pula o workspace. A etapa 5 precisa de Vitest em `apps/web`
para `geometria.spec.ts`. **Isso é uma dependência de devDependency** e contraria §17.6 — a
exceção se justifica por ser ferramenta de teste (não vai para o bundle) e por `packages/shared`
já usar Vitest 4, então a versão é conhecida. **Alternativa sem dependência:** mover
`geometria.ts` para `packages/shared` — mas isso altera `packages/shared`, que está fora do
escopo. **Decisão: adicionar Vitest a `apps/web`**, avisando o outro dev antes por causa do
lockfile. Se ele preferir, a etapa 5 entrega sem teste e abre-se um débito registrado.

---

## 22. Matriz de QA

Executar por inteiro antes do PR. Comandos reais do repositório.

### 22.1 Sequência do CI (com `pnpm dev` parado)

```bash
pnpm format:check && pnpm build && pnpm lint && pnpm typecheck && pnpm test
```

`build` vem **antes** de `lint` e `typecheck` porque ambos dependem do `packages/shared`
compilado. Localmente a ordem errada passa (o `dist` sobrou); só quebra em clone limpo — ou
seja, só no CI.

```bash
pnpm dev:web          # servir só o Next, quando a API não for necessária
pnpm dev              # shared watch + web + api
pnpm format           # antes de commitar, por causa do plugin do Tailwind
```

### 22.2 Matriz

| # | Cenário | Como reproduzir | Espera |
| --- | --- | --- | --- |
| Q1 | Chrome, Firefox, Safari (desktop) | manual | render idêntico em estrutura; diferenças só de fonte |
| Q2 | Safari iOS e Chrome Android | dispositivo real ou emulação | trilho com snap fluido; `100svh` sem salto de barra |
| Q3 | 9 breakpoints | DevTools responsivo | R1–R7 |
| Q4 | Só teclado | `Tab` do topo ao fim | A4, A5; nenhum foco perdido; painel devolve foco |
| Q5 | Touch | dispositivo real | alvos ≥44px; tap na detente fixa e solta |
| Q6 | Reduced motion | SO ou DevTools → Rendering | A9 |
| Q7 | **API offline** | `pnpm dev:web` sem a API | hero em `SEM LEITURA`, roster degradado, página inteira legível |
| Q8 | **API lenta** | DevTools → Slow 3G | Suspense com placeholders de altura correta; zero CLS |
| Q9 | Imagem ausente | `portraitUrl: null` em **todas** as entradas | retrato editorial em todas; galeria coesa, nenhuma caixa cinza |
| Q10 | Imagem lenta | Slow 3G | P5: `6/8` visível antes de qualquer imagem |
| **Q11** | **Contagem do roster: 1, 2, 5, 8, 12, 16, 20, 30, 50** | percorrer `ROSTER_MOCK` inteiro nos 3 tetos de coluna | §10.4: nenhuma fileira quebrada, nenhuma placa esticada, nenhuma imagem deformada, sem ajuste manual entre uma contagem e outra |
| Q12 | Roster com 0 membros | `[]` | estado vazio da seção (§10.6), não grid de zero colunas |
| Q13 | Nomes longos e curtos | mock | ellipsis com `title`; sem quebra de altura |
| Q14 | Colisão de acento | mock | sem warning de chave duplicada no console |
| Q15 | Erro no Apply | submeter vazio | F6: foco no 1º inválido + resumo + `role="alert"` |
| Q16 | **Popup bloqueado** | bloquear popups no navegador | chapa de alerta + link de redirect |
| Q17 | **Popup fechado** | abrir e fechar a janela | volta a ocioso em ≤1s, mensagem em `aria-live` |
| Q18 | Login bem-sucedido | só após B4 existir | botão mostra a conta; **sem** redirect automático |
| Q19 | Login com erro | `?status=erro&motivo=falha` no callback | reaproveita os textos de `app/entrar/page.tsx` |
| Q20 | Contraste | axe + verificador manual dos pares de §3.2 | todos aprovados |
| Q21 | Zoom 200% e 400% | navegador | R5, sem rolagem horizontal |
| Q22 | **Sem JavaScript** | desabilitar JS | §16.11 inteiro |
| Q23 | Sem AVIF/WebP | UA antigo ou forçar | `next/image` serve o fallback; nada quebra |
| Q24 | Console | DevTools | P6: limpo |
| Q25 | Network | DevTools | TE4: nenhum domínio externo chamado do browser |
| Q26 | Layout shift | Lighthouse + camada de Layout Shift Regions | P2 |
| Q27 | Build de produção | `NODE_ENV=production pnpm --filter web build` | C-A6: falha se houver mock importado |
| Q28 | Contrato no build | `grep` da chave no `.next` | TE6 |
| **Q29** | **Teste do print (PL1)** | screenshot de desktop e mobile, página inteira, mostrado a alguém de fora sem explicação | ninguém pergunta "está quebrado?" nem "falta imagem?" |
| **Q30** | **Página sem nenhuma imagem** | bloquear imagens no DevTools e recarregar | PL8: hero, roster e footer continuam apresentáveis |
| **Q31** | **Troca de placeholder não move layout** | substituir A7 por uma imagem real numa entrada e comparar screenshots do mesmo viewport | C-A10: diferença apenas dentro do retângulo do retrato |
| **Q32** | **Nenhum campo vazio** | inspeção + `grep -rE "TODO\|TBD\|xxx" apps/web/app` | PL3 |

---

## 23. Backlog de backend

**Nada disto entra na execução do frontend.** São issues separadas.

| # | Item | Bloqueia | Esforço percebido | Nota |
| --- | --- | --- | --- | --- |
| **B1** | `GET /public/raid-progress` (§5.5) | o centro da hero | médio | A lógica já existe em `raidprogress.service.ts`; falta um controller público, o recorte do DTO e o cache de 15 min |
| **B2** | `GET /public/roster` com `spec` e `portraitUrl` (§5.5) | a seção do roster **em produção** (não a construção — §10.0) | médio | Junta WoWAudit + Raider.IO (já feito em `roster.service.ts`) + a fonte de imagem que o backend escolher |
| **B5** | **Servir as imagens do roster** | B2 | pequeno a médio | **A escolha da fonte é do backend** (§10.0): `character-media` da Blizzard (chave `main-raw` → `main` → `inset` → `null`) é a de melhor relação qualidade/esforço, mas storage próprio ou upload manual são igualmente válidos. **Recomendação:** servir do próprio domínio (proxy com cache) em vez de repassar URL de CDN externo — evita `remotePatterns`, mantém o cache num lugar só (Regra 6) e desacopla o front da fonte para sempre |
| **B3** | Módulo `applications` + model `Application` + `POST /applications` | o envio da candidatura | grande | `createApplicationSchema` está PROVISÓRIO (TIT-13): revisar os campos com quem recruta **antes** da migration |
| **B4** | `?mode=popup` no `/auth/battlenet` e destino do callback (§12.5) | o requisito de popup | pequeno | Duas linhas no `auth.controller.ts` e um campo no cookie de state |
| **B6** | Decisão de produto D3: roster público é aceitável? | B2 | — | Expor ~22 nomes de personagem sem login. Decisão da liderança, não técnica |
| **B7** | Deploy: Next e Nest sob o mesmo site registrável | login em popup em produção | — | Domínios distintos fazem o cookie ser tratado como de terceiros e o login falha em silêncio no Safari (§12.7) |
| **B8** | `next.config.ts` → `images.remotePatterns` | retratos | trivial | **Só é necessário se B5 devolver URL de host externo.** Se o backend servir do próprio domínio — o recomendado — esta linha desaparece. O host, se houver, é ditado por B5, não presumido pelo frontend |

---

## 24. Riscos, suposições e decisões abertas

### 24.1 Riscos

| # | Risco | Impacto | Mitigação já embutida |
| --- | --- | --- | --- |
| RK1 | **O instrumento é a ideia inteira.** Sem B1, o centro da hero fica sem dado | alto | O estado `SEM LEITURA` é **projetado** (§8.6): apagado de propósito lê como intencional, ausente lê como quebrado |
| RK2 | Os assets A1–A7 podem nunca chegar | **baixo, depois desta revisão** | §18.9: **todos** têm estratégia temporária oficial, produzida na etapa 2, dimensionalmente idêntica ao final. O pior caso deixou de ser "página com buracos" e passou a ser "página com a arte provisória", que é apresentável |
| RK2b | Um placeholder ser bom demais e o asset final nunca ser priorizado | baixo | Aceitável. Se o campo profundo ou o retrato editorial ficarem definitivos, a página não perde nada — §18.9 registra quais podem simplesmente ficar |
| RK3 | Cookie de terceiros derruba o login em popup em produção | alto | §12.7 + B7. **Não é resolvível no frontend** |
| RK4 | `createApplicationSchema` é PROVISÓRIO e vai mudar | médio | O typecheck quebra antes do usuário — é o desenho correto da Regra 2 |
| RK5 | O tier vira em ~18/08/2026, dentro de duas semanas | médio | O número de detentes é **dado**, nunca constante; há mock de 3 bosses para provar isso |
| RK6 | Conflito no `pnpm-lock.yaml` com o outro dev | médio | Zero dependências novas, exceto Vitest em `apps/web` — combinar antes |
| RK7 | Textos `[PROV]` vazarem para produção | médio | Marcados no código e travados pela etapa 15 e por C-A8 |
| RK8 | Mock vazar para produção | alto | A guarda de §6.1 **quebra o build**, não avisa |
| RK9 | A landing e `/interno` divergirem visualmente | baixo | A gramática do instrumento é reaproveitável; a unificação é trabalho futuro, não desta issue |

### 24.2 Suposições declaradas

1. O roster público é o **time de raid**, não a guilda inteira (~590). O layout é resiliente de
   1 a 30 (§10.4), o que cobre com folga qualquer tamanho de time de raid; uma galeria de 590
   retratos é outra coisa e não está no escopo.
2. Os textos hoje publicados em `app/page.tsx` podem ser reaproveitados, porque já eram públicos.
3. A guilda consegue capturar screenshots próprios no jogo.
4. A URL do Discord existe e pode ser publicada.
5. A região é US e vem de `BLIZZARD_REGION`; nenhum campo do site pergunta região.

### 24.3 Decisões abertas que **não** bloqueiam a implementação

| # | Decisão | Default adotado se ninguém responder |
| --- | --- | --- |
| D3 | Roster público é aceitável? | Implementa-se com mock; o endpoint só entra quando a liderança aprovar |
| D-A | Vitest em `apps/web`? | Adicionar, avisando o outro dev; se ele recusar, a etapa 5 vai sem teste e o débito fica registrado |
| D-B | Eixo `wdth` do Archivo disponível? | §3.3 traz os dois caminhos e o critério de escolha |
| D-C | `publicRosterSchema` novo ou estender o `rosterSchema`? | **Escolha do backend.** O front consome o que for publicado no shared |

### 24.4 O que este documento **não** decide

Direção de arte da área interna, sistema de design duradouro (`DESIGN.md` é escrito no fim,
a partir do que foi construído, não antes), estratégia de deploy, e o conteúdo real da guilda.

---

## 25. Registro de alterações

| Versão | Data | Mudança |
| --- | --- | --- |
| 1.0 | 2026-08-05 | Versão inicial. Direção INSTRUMENTO aprovada; 6 seções especificadas; 5 contratos propostos; pesquisa de mídia registrada em §18.1 |
| **1.1** | **2026-08-05** | **Filosofia de placeholders (§2.1): o projeto nunca trabalha com buracos.** Todos os assets A1–A6 ganham estratégia temporária obrigatória e entra o A7 (retrato editorial); quadro consolidado em §18.9. Regra de conteúdo temporário com Lorem Ipsum calibrado (§19.4). Roster deixa de assumir API externa para fotografias (§10.0) e passa a ser resiliente de 1 a 50 membros com colunas derivadas da contagem (§10.4). Novo checklist de completude visual (§20.8) com critério de saída por etapa. Ajustes de coerência em §4.2, §6.2, §17.3, §18.1, §18.6, §19.1, §19.3, §20.5, §21, §22, §23 e §24 |

