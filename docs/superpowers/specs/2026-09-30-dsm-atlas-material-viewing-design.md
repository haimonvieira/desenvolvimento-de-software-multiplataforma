# DSM Atlas — Visualização de materiais (eixo 1)

**Status:** aguardando revisão
**Data:** 30 de setembro de 2026
**Escopo:** abrir, ler, agrupar e baixar materiais publicados
**Fora de escopo:** eixo 2 (uso de IA) e eixo 3 (organização do repositório) — ver §8

## 1. Diagnóstico

Três sintomas relatados. A investigação encontrou uma causa comum para dois deles e um
quarto problema que não havia sido relatado.

### 1.1 PDF nunca renderiza (confirmado por medição)

`atlas/scripts/build-catalog.ts:220` define a URL de download como o endpoint `raw` do
GitHub:

```
downloadUrl: `${REPOSITORY_URL}/raw/${encodeURIComponent(commitSha)}/${path}`
```

Medição real contra o material catalogado no commit `d32b8c8`:

```
$ curl -sS -o /dev/null -D - -L "https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/raw/d32b8c8.../DSM1/ALP/PLANO%20DE%20ENSINO/PLANO%20DE%20ENSINO%20-%20ALP.PDF"
HTTP/1.1 302 Found
Location: https://raw.githubusercontent.com/haimonvieira/.../PLANO%20DE%20ENSINO%20-%20ALP.PDF
HTTP/1.1 200 OK
Content-Type: application/octet-stream
X-Content-Type-Options: nosniff
```

O mesmo caminho para uma imagem devolve `Content-Type: image/png`.

Consequência: `<object type="application/pdf">` (`material-preview.tsx:36`) recebe
`application/octet-stream` com `nosniff` e o navegador **baixa** em vez de renderizar. Não é
defeito de CSS, de markup ou de lógica: o tipo de conteúdo está fora do nosso controle
enquanto o preview usar a URL do GitHub. Os dois sintomas relatados — "o PDF não funciona" e
"ele baixa automático quando clico no arquivo" — são o mesmo defeito.

### 1.2 O preview de texto está quebrado para 661 materiais

`build-catalog.ts:176` só gera preview quando o caminho está em `REVIEWED_PREVIEW_PATHS`
(`build-catalog.ts:83-86`), uma lista revisada à mão que contém **dois caminhos**:

```
previewKind: "text" com previewUrl ....    2
previewKind: "text" sem  previewUrl ...  661
```

Os 661 restantes caem em `PreviewFallback` com a mensagem "Pré-visualização bloqueada por
segurança ou indisponível." A trava de segurança efetiva já existe e é automática — o
`SECRET_MARKER` (`build-catalog.ts:87`), que barra conteúdo com credenciais. A allowlist
manual não protege nada que o scanner já não proteja; ela apenas impede o trabalho de
acontecer.

### 1.3 Imagem renderiza, mas sem utilidade de leitura

O `<img>` funciona (`Content-Type: image/png`), porém `globals.css:391-392` o coloca em
caixa de `min-height: 34rem` com `max-height: 75vh`, centralizado e sem ampliação. Uma
captura de tela pequena flutua num vazio grande; uma grande encolhe para 75vh sem forma de
ver detalhe.

### 1.4 A estrutura de pastas é descartada na apresentação

Distribuição real do catálogo (1280 materiais):

| | |
|---|---|
| Arquivos direto na pasta da disciplina | 102 (8%) |
| Arquivos aninhados | 1178 (92%) |
| Profundidade máxima | 11 níveis (TPI) |

E a interface achata: `catalog-list.tsx` emite um `<ul>` plano por disciplina, e
`study-discipline-materials.tsx:13` agrupa apenas pelo **primeiro** segmento do caminho:

```ts
Map.groupBy(materials, (material) => material.ref.path.split("/").slice(2, -1)[0] || "Materiais gerais")
```

Todo o resto da pasta vira texto cinza em `<small>` — não navegável. A árvore existe no
repositório e o aplicativo a descarta.

## 2. Decisões aprovadas

1. **Rota de asset própria**, para que tipo de conteúdo e disposição deixem de depender do
   GitHub.
2. **Cobertura de texto ampliada**: a allowlist manual sai; o `SECRET_MARKER` permanece como
   único portão.
3. **Agrupamento aninhado** por pasta em todos os níveis, numa página só, sem estado de
   aberto/fechado.
4. **Office por embed** do Office Online, com fallback.

## 3. Arquitetura

### 3.1 Rota de asset

`GET /api/material/<path>?disposition=inline|attachment`

- **Fonte:** `https://raw.githubusercontent.com/<GITHUB_REPOSITORY>/<commitSha>/<path>`, com o
  `GITHUB_USER_AGENT` já exigido pelo GitHub (corrigido em `d32b8c8`).
- **Allowlist obrigatória:** o `<path>` é conferido contra o catálogo publicado
  (`query.getMaterial`) antes de qualquer fetch. Sem isso a rota é um proxy aberto. Um
  caminho ausente do catálogo responde `404`, nunca repassa.
- **Tipo de conteúdo:** derivado da extensão, nunca do cabeçalho do GitHub:

  | Extensão | `Content-Type` |
  |---|---|
  | `.pdf` | `application/pdf` |
  | `.png` `.jpg` `.jpeg` `.gif` `.webp` `.bmp` | `image/<tipo>` |
  | `.svg` | `image/svg+xml` |
  | `.txt` `.md` `.java` `.js` `.ejs` `.alg` `.properties` `.form` … | `text/plain; charset=utf-8` |
  | outras | `application/octet-stream` |

- **Disposição:** `inline` por padrão; `attachment; filename="<nome>"` quando pedido. O valor
  é fixo por enumeração, nunca interpolado de entrada do usuário.
- **`Range`:** repassado quando presente e ecoado com `206 Partial Content`, `Accept-Ranges` e
  `Content-Range`. O visualizador de PDF do navegador busca faixas; sem isso um PDF grande
  fica lento ou falha.
- **Cache:** `ETag` derivado de `commitSha` + caminho (o conteúdo de um commit é imutável) e
  `Cache-Control: public, max-age=31536000, immutable`.

### 3.2 Modelo

`Material` passa a carregar duas URLs próprias, ambas same-origin:

| Campo | Uso | Disposição |
|---|---|---|
| `assetUrl` | preview (`<img>`, `<object>`, `<iframe>`) | `inline` |
| `downloadUrl` | botão "Baixar arquivo" | `attachment` |

`previewUrl` mantém o significado atual (preview de texto gerado no build) e não muda.

### 3.3 Componente de preview

`material-preview.tsx` passa a apontar para `assetUrl` e ganha ações fixas:

- **imagem:** `<img>` com `max-width` e `max-height` úteis, mais link "Abrir em tamanho real"
  que abre `assetUrl` numa aba nova. O estado natural do arquivo (dimensões) é preservado;
  nada é ampliado ou reduzido por conta própria.
- **PDF:** `<object data={assetUrl} type="application/pdf">` com o fallback atual.
- **texto:** inalterado — `<pre>` inerte, sem execução.
- **Office** (`.pptx`, `.ppsx`, `.docx`, `.xlsx`, `.doc`, `.ppt`, `.xls`): `<iframe>` para
  `https://view.officeapps.live.com/op/embed.aspx?src=<assetUrl absoluto e codificado>`, com o
  fallback atual por baixo.
- **sempre:** "Baixar arquivo" (`downloadUrl`) e "Ver no GitHub" visíveis, independentemente de
  o preview ter funcionado.

O embed do Office Online é uma dependência de terceiro em tempo de execução, assumida para
cobrir 14 arquivos (1,1% do catálogo) sem empacotar bibliotecas. O URL enviado ao serviço é o
do material, que já é público. Se o serviço não responder, o fallback mantém a página útil.

### 3.4 Cobertura de texto

- `classify()` (`build-catalog.ts:89`) passa a marcar como `text` as extensões hoje em `none`
  que são texto: `.ejs`, `.alg`, `.form`, `.htm`, `.properties`, `.xml`, `.jsonl`, `.yaml`,
  `.ini`, `.dev`, `.layout`, `.mf`, `.pas` e arquivos **sem extensão** (67 arquivos).
- `REVIEWED_PREVIEW_PATHS` é removido. `SECRET_MARKER` continua sendo o único portão.
- Arquivo acima de `PREVIEW_LIMIT` (200.000 bytes): gera preview **truncado**, com o novo campo
  `Material.previewTruncated: true`, em vez de silenciosamente não gerar. São 4 arquivos. A
  página avisa que o conteúdo exibido está cortado e aponta para o download.

Custo: 1026 previews, 5,9 MiB no total, em `public/material-previews/` (já ignorado pelo git).
Cabe nos limites de static assets do Workers.

### 3.5 Agrupamento aninhado

`study-discipline-materials.tsx` deixa de agrupar por um nível e passa a montar uma árvore a
partir de `path.split("/").slice(2)` — o caminho abaixo da disciplina.

- Renderização recursiva: cada pasta é um cabeçalho com nome e contagem, seguido dos seus
  itens.
- Profundidade exposta como `--depth` para indentação, com limite superior para não estourar
  em telas estreitas (o pior caso é 11 níveis).
- Sem estado de aberto/fechado: tudo visível numa página.
- Nomes de pasta e de arquivo preservados como texto real; a árvore continua sendo uma `<ul>`
  com nome acessível por pasta, e não depende de JavaScript para ser lida.

## 4. Fluxo de dados

```
catálogo (build)                 página do material                 navegador
─────────────────                ──────────────────                 ─────────
classify(ext)  ──► previewKind ──► MaterialPreview ──► assetUrl ──┐
                    previewUrl ──► TextPreview                    │
                                      │                           │
                                      ▼                           ▼
                                 downloadUrl  ──────────► GET /api/material/<path>
                                                              ?disposition=inline|attachment
                                                                   │
                                      confere contra o catálogo ───┤ (404 se ausente)
                                                                   ▼
                                                       raw.githubusercontent.com
```

## 5. Falhas

| Situação | Comportamento |
|---|---|
| Caminho fora do catálogo | `404`, sem fetch upstream |
| `commitSha` fora do publicado | `404` |
| GitHub indisponível ou `5xx` | `502` com mensagem própria; nunca repassa corpo do upstream |
| Arquivo ausente no commit | `404` |
| Preview não suportado | `PreviewFallback` com "Baixar arquivo" e "Ver no GitHub" |
| Office Online não responde | fallback assume |
| Conteúdo barrado pelo `SECRET_MARKER` | sem preview; arquivo continua listado e baixável |

## 6. Testes

- **Unit, `classify`:** cada extensão nova produz `text`; arquivos sem extensão também.
- **Unit, geração de preview:** arquivo com `api_key` não gera preview; arquivo acima do limite
  gera truncado e marcado; arquivo comum gera.
- **Unit, árvore:** caminho de 11 níveis produz 11 níveis; pasta vazia não aparece; contagem por
  pasta bate com o total de materiais.
- **Unit, rota:** `Content-Type` por extensão; `attachment` só quando pedido; `Range` devolve
  `206` com `Content-Range`; caminho fora do catálogo devolve `404` **sem** chamar o fetch
  (dublê que falha o teste se for chamado).
- **e2e:** a página de um PDF responde `200` com `Content-Type: application/pdf` e o elemento
  `[data-material-preview="pdf"]` está presente; a de um `.java` mostra o conteúdo.

A suite existente (37 arquivos, 351 testes) precisa continuar verde; os testes que fixam a URL
do GitHub em `downloadUrl` serão reescritos, porque a decisão muda.

## 7. Ordem de implementação

1. Rota de asset + modelo (`assetUrl`) + testes da rota.
2. Preview apontando para `assetUrl`; ações fixas de download.
3. Cobertura de texto (`classify` + remoção da allowlist + truncamento).
4. Agrupamento aninhado.
5. Office por embed.

Cada passo é independente e verificável sozinho; 1 e 2 juntos já corrigem o PDF.

## 8. Decomposição dos outros eixos

O pedido original cobre três subsistemas independentes. Cada um tem spec e plano próprios;
esta spec trata apenas do eixo 1.

**Eixo 2 — uso de IA.** Achados já levantados, todos com evidência, para specs posteriores:
dois seams de provedor duplicando fetch/status/timeout/parse (`public-tutor-ai.ts:54-56`,
`admin-classifier-ai.ts:110-112`); prompts como literais inline sem teste de conteúdo
(`groq-public-tutor-ai.ts:147-164`); `answerStream` escrito e sem chamador em produção
(`:481,498`) enquanto a rota usa `answer`; `expireStaleReservations` sem chamador em produção;
contrato de saída frouxo no público (`response_format: json_object`) contra estrito no admin
(`json_schema`, `admin-classifier-ai.ts:323-329`); nenhuma avaliação contra modelo real.

**Eixo 3 — organização do repositório.** Não é o que o pedido descrevia: a inspeção mostrou que
a raiz e `atlas/` seguem convenção, e que todo artefato de build está corretamente ignorado
(`dist/`, `.next/`, `.vinext/`, `.wrangler/`, `test-results/`, `src/generated/`, `public/_index/`
— zero rastreados). Os problemas reais, se você quiser tratá-los depois: testes em três casas
(27 colocados em `src/**`, 8 soltos em `tests/`, 2 em `tests/integration/`, 10 e2e), e
`.maestri/`/`.omp/`/`.remember/` fora do `.gitignore` (com `.omp/state/continuity.md` e
`.zcodeignore` rastreados e aparecendo como modificados em todo `git status`).
