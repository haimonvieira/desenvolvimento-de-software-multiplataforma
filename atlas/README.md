# DSM Atlas

Aplicação Next.js (App Router/TypeScript) executada no Cloudflare Workers pelo adapter `vinext`, com catálogo gerado a partir da árvore Git do repositório e persistência no Neon PostgreSQL.

## Decisões de runtime

- **Adapter:** `vinext` 1.0 beta com `@vinext/cloudflare`, Vite e Wrangler. Em 27/09/2026, a documentação da Cloudflare recomenda vinext para novos apps Next.js em Workers e declara App Router e route handlers suportados. O adapter ainda é beta; execute `pnpm exec vinext check` ao atualizar. Fonte: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- **Banco:** `@neondatabase/serverless` 1.1 via HTTP e query parametrizada ``sql`SELECT 1` ``. O HTTP é a opção documentada para consultas one-shot em ambientes edge e evita TCP. Fonte: https://neon.com/docs/serverless/serverless-driver
- **Plano gratuito:** o caminho não exige recurso pago. Workers Free documenta 100.000 requests/dia, 10 ms de CPU por request, 128 MB, 50 subrequests e seis conexões de saída simultâneas. Espera por `fetch` não conta como CPU. Fonte: https://developers.cloudflare.com/workers/platform/limits/
- **Saúde honesta:** `/api/health` retorna `ok` somente após Neon e GitHub responderem. Sem configuração retorna HTTP 503 e `unconfigured`; falhas externas retornam HTTP 503 e `error` sem detalhes ou segredos.

## Desenvolvimento local

Requer pnpm (`packageManager: pnpm@12.6.0`) e Node com `--experimental-strip-types` (usado pelos scripts de build).

```bash
pnpm install
pnpm dev
```

Scripts disponíveis em `atlas/package.json`:

- `pnpm dev`: desenvolvimento com vinext/Vite; o hook `predev` regenera catálogo e índice de conteúdo antes de subir.
- `pnpm build`: `vite build`; o hook `prebuild` regenera catálogo e índice antes do build e grava o Worker em `dist/`.
- `pnpm preview`: executa o Worker gerado localmente com `wrangler dev --config dist/server/wrangler.json`.
- `pnpm test`: `vitest run`; o hook `pretest` executa `pnpm build` antes, porque a verificação de vazamento de segredos no bundle lê `dist/server` — sem o build o teste falharia por artefato ausente.
- `pnpm test:e2e`: `playwright test`; o hook `pretest:e2e` executa `pnpm build` antes, porque o servidor de preview do e2e (`pnpm preview`) precisa de `dist/server/wrangler.json`.
- `pnpm typecheck`: `tsc --noEmit`.
- `pnpm lint`: `eslint .`.
- `pnpm catalog:build`: gera `src/generated/catalog.json` a partir da árvore Git.
- `pnpm content-index:build`: gera o índice textual em `public/_index/`.
- `pnpm deploy`: deploy explícito pelo `vinext-cloudflare`; não é executado pelos testes.

O catálogo é sempre gerado no build/dev; a aplicação nunca varre o repositório em tempo de requisição. O smoke real de Neon e GitHub exige credenciais configuradas e deve produzir `{ "status": "ok", "runtime": "cloudflare", "database": "ok", "github": "ok" }`. Sem elas, o resultado esperado é `unconfigured`.

## Variáveis de ambiente

Nomes conferidos em `worker-configuration.d.ts` e em `wrangler.jsonc`. **Nunca escreva os valores no repositório**; use `wrangler secret put <NOME>` para os secrets.

**Banco (Neon)**

- `DATABASE_URL` — *secret*. String de conexão do Neon usada pelo driver serverless e pelas migrações Drizzle.

**Identidade (Better Auth + passkey)**

- `BETTER_AUTH_SECRET` — *secret*. Mínimo de 32 bytes.
- `BETTER_AUTH_URL` — *secret*. URL base do Better Auth.
- `BETTER_AUTH_TRUSTED_ORIGINS` — *secret*. Lista separada por vírgula de origins HTTPS explícitos.
- `PASSKEY_RP_ID` — *secret*. Hostname fixo usado como Relying Party ID do WebAuthn.
- `GITHUB_CLIENT_ID` — *secret*. OAuth do Better Auth para o bootstrap/recuperação do dono.
- `GITHUB_CLIENT_SECRET` — *secret*. Par do anterior.
- `ADMIN_GITHUB_USER_ID` — *secret*. Identidade administrativa autorizada.

**GitHub App (leitura de materiais e publicação)**

- `GITHUB_APP_ID` — *secret*. ID do GitHub App.
- `GITHUB_APP_PRIVATE_KEY` — *secret*. Chave privada em PEM (aceita PKCS#1 e PKCS#8).
- `GITHUB_INSTALLATION_ID` — *secret*. ID da instalação do App no repositório.
- `GITHUB_REPOSITORY` — *configuração* (`owner/repository`).

**Cota do tutor público**

- `TUTOR_SUBJECT_SECRET` — *secret*. 32+ bytes, usado para derivar a chave anônima da cota de IA.

**Provedores de IA (Groq)**

- `GROQ_API_KEY` — *secret*. Tutor público patrocinado.
- `GROQ_ADMIN_API_KEY` — *secret*. Credencial separada da classificação administrativa; nunca a mesma de `GROQ_API_KEY`.

**Turnstile**

- `TURNSTILE_SECRET_KEY` — *secret*. Verificação do primeiro uso patrocinado.
- `TURNSTILE_SITE_KEY` — *público*. Sitekey do widget; valor `[vars]` simples, seguro no bundle cliente.

## Autenticação no GitHub (GitHub App)

A autenticação no GitHub usa um **GitHub App**, não um token pré-emitido: `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY` e `GITHUB_INSTALLATION_ID` são secrets do Worker; o token de instalação é assinado (`RS256`) e trocado no endpoint `/app/installations/{id}/access_tokens` a cada requisição, mantido apenas em memória do isolate até pouco antes de `expires_at` e nunca persistido, registrado em log ou devolvido ao cliente.

Permissões exigidas no repositório de `GITHUB_REPOSITORY`:

- **Contents: read and write** — leitura de `commits/HEAD`, `git/commits`, `git/trees?recursive=1` e `git/blobs`; escrita de blobs, trees, commits e atualização de refs da Git Data API para publicar um lote em um único commit. O **Metadata: read** implícito do App é suficiente para o resto.
- Nenhuma outra permissão é usada: não há chamadas a Actions, Checks, Issues, Pull requests ou pacotes.

Nenhum desses valores pertence ao bundle cliente ou ao repositório.

## Fluxo de branches do Neon

- **Desenvolvimento/preview:** usa uma branch de banco dedicada. As migrações são aplicadas nessa branch de desenvolvimento, o esquema é inspecionado, os testes de integração rodam, e então a branch é resetada e reaplicada para provar que as migrações são reprodutíveis. O preview usa `DATABASE_URL` e `PASSKEY_RP_ID` próprios — não são tratados como credenciais de produção. (`wrangler.jsonc`; plano de implementação, Tarefa 7 §5.)
- **Produção:** usa `DATABASE_URL` próprio, configurado como secret do Worker de produção.

### Migrações

As migrações em `drizzle/migrations/` são **escritas à mão**. Elas definem funções plpgsql (`sync_study`, `reserve_ai_budget`), comentários e constraints que `drizzle-kit generate` não reproduz. Por isso o repositório **não usa `drizzle-kit generate`** contra este journal: os snapshots em `drizzle/migrations/meta/` cobrem apenas a migração `0000`, então um `generate` re-emitiria `0001`–`0006` como uma migração nova e o `apply` falharia por duplicidade.

Regra: qualquer alteração de esquema é uma nova migração SQL escrita à mão, numerada na sequência, seguida da declaração correspondente em `src/integrations/neon/schema.ts`. O guard é `npx drizzle-kit check` (verifica journal/snapshots) mais `tests/schema-migration-parity.test.ts` (exige que todo `CHECK` do SQL aplicado exista em `schema.ts`, e vice-versa).

```bash
cd atlas
npx drizzle-kit check   # journal e snapshots consistentes
pnpm test -- schema-migration-parity
```

## Deploy no Cloudflare

1. `pnpm build` gera o Worker em `dist/` (o `prebuild` regenera catálogo e índice de conteúdo).
2. `pnpm preview` valida localmente o Worker gerado (`wrangler dev --config dist/server/wrangler.json`).
3. `pnpm deploy` executa `vinext-cloudflare deploy --config dist/server/wrangler.json`.

**Build on push:** a plataforma reconstrói a aplicação a cada push que altera a branch principal. Esse build roda o comando de build, que dispara o hook `prebuild` e regenera o **catálogo** (`src/generated/catalog.json`) e o **índice de conteúdo** (`public/_index/`) a partir do commit publicado. O commit é resolvido de `GITHUB_SHA`, depois `CF_PAGES_COMMIT_SHA`, depois `git rev-parse HEAD`. A visibilidade dos novos materiais só ocorre após o deploy terminar.

## Provedores de IA

Duas especificações aprovadas, ambas em `docs/superpowers/specs/`:

- `2026-09-28-dsm-atlas-public-ai-provider.md` — tutor público. Groq, modelo primário `openai/gpt-oss-120b`, modelo de degradação `openai/gpt-oss-20b` (usado somente em 5xx/falha de transporte; um `429` nunca é repetido).
- `2026-09-28-dsm-atlas-admin-ai-provider.md` — classificação administrativa. Groq com `GROQ_ADMIN_API_KEY` (credencial separada), modelo `openai/gpt-oss-120b`, saída estruturada por JSON schema, sem modelo de degradação.

Constantes editáveis no código:

- Modelo do tutor público: `GROQ_PRIMARY_MODEL` e `GROQ_FALLBACK_MODEL` em `src/integrations/ai/groq-public-tutor-ai.ts`.
- Modelo administrativo: `GROQ_ADMIN_MODEL` em `src/integrations/ai/admin-classifier-ai.ts`.
- Tetos: `USAGE_POLICIES` em `src/modules/tutor/usage-policy.ts`, com escopos `public` e `admin`.

Operação: trocar um modelo ou baixar um teto é uma edição direta dessas constantes. **Baixar** tetos é permitido operacionalmente; **subir** qualquer teto exige evidência de custo medida — o comentário do módulo declara que eles são tetos de segurança, não promessas de produto.

## Limites operacionais

| Limite | Valor | Definido em |
| --- | --- | --- |
| Tamanho por arquivo | 10 MiB (`MAX_FILE_BYTES`) | `src/modules/publication/validate-upload.ts` |
| Tamanho por lote | 25 MiB (`MAX_BATCH_BYTES`) | `src/modules/publication/validate-upload.ts` |
| Arquivos por lote | 100 (`MAX_FILES_PER_BATCH`) | `src/modules/publication/batch-create.ts` |
| Turnos/hora por visitante (público) | 5 | `src/modules/tutor/usage-policy.ts` |
| Turnos/dia por visitante (público) | 15 | `src/modules/tutor/usage-policy.ts` |
| Turnos globais/dia (público) | 30 | `src/modules/tutor/usage-policy.ts` |
| Tokens globais/dia (público) | 150.000 | `src/modules/tutor/usage-policy.ts` |
| Turnos simultâneos (público) | 1 | `src/modules/tutor/usage-policy.ts` |
| Entrada/saída por turno (público) | 4.000 / 1.000 tokens | `src/modules/tutor/usage-policy.ts` |
| Turnos/ferramentas por turno (público) | 4 | `src/modules/tutor/usage-policy.ts` |
| Prazo por turno (público) | 30 s | `src/modules/tutor/usage-policy.ts` |
| Turnos/hora e /dia (admin) | 10 / 60 | `src/modules/tutor/usage-policy.ts` |
| Turnos globais/dia (admin) | 100 | `src/modules/tutor/usage-policy.ts` |
| Tokens globais/dia (admin) | 500.000 | `src/modules/tutor/usage-policy.ts` |
| Turnos simultâneos (admin) | 2 | `src/modules/tutor/usage-policy.ts` |
| Entrada/saída por turno (admin) | 8.000 / 2.000 tokens | `src/modules/tutor/usage-policy.ts` |
| Ferramentas por turno (admin) | 8 | `src/modules/tutor/usage-policy.ts` |
| Prazo por turno (admin) | 60 s | `src/modules/tutor/usage-policy.ts` |

Os tetos patrocinados (`public`) são dimensionados para caber no tier gratuito do Groq com margem de 25% (especificação do provedor público §2.1). Nenhuma forma de pagamento é associada à conta do Groq (especificação do provedor §3): a proteção real é o teto interno.
