# DSM Atlas

Aplicação mínima App Router/TypeScript para validar o runtime do DSM Atlas no Cloudflare Workers.

## Decisões de runtime

- **Adapter:** `vinext` 1.0 beta com `@vinext/cloudflare`, Vite e Wrangler. Em 27/09/2026, a documentação da Cloudflare recomenda vinext para novos apps Next.js em Workers e declara App Router e route handlers suportados. O adapter ainda é beta; execute `pnpm exec vinext check` ao atualizar. Fonte: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- **Banco:** `@neondatabase/serverless` 1.1 via HTTP e query parametrizada ``sql`SELECT 1` ``. O HTTP é a opção documentada para consultas one-shot em ambientes edge e evita TCP. Fonte: https://neon.com/docs/serverless/serverless-driver
- **Plano gratuito:** o caminho não exige recurso pago. Workers Free documenta 100.000 requests/dia, 10 ms de CPU por request, 128 MB, 50 subrequests e seis conexões de saída simultâneas. Espera por `fetch` não conta como CPU. Fonte: https://developers.cloudflare.com/workers/platform/limits/
- **Saúde honesta:** `/api/health` retorna `ok` somente após Neon e GitHub responderem. Sem configuração retorna HTTP 503 e `unconfigured`; falhas externas retornam HTTP 503 e `error` sem detalhes ou segredos.

## Configuração

Defina `DATABASE_URL`, `TUTOR_SUBJECT_SECRET` (32+ bytes, usado para derivar a chave anônima da cota de IA), `GROQ_API_KEY` (chave do tutor público patrocinado) e `TURNSTILE_SECRET_KEY` (verificação do primeiro uso patrocinado) como secrets do Worker (`wrangler secret put ...`). Defina `GITHUB_REPOSITORY` como `owner/repository` em configuração de ambiente.

A autenticação no GitHub usa um **GitHub App**, não um token pré-emitido: `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY` (chave privada em PEM, aceita PKCS#1 e PKCS#8) e `GITHUB_INSTALLATION_ID` são secrets do Worker; o token de instalação é assinado (`RS256`) e trocado no endpoint `/app/installations/{id}/access_tokens` a cada requisição, mantido apenas em memória do isolate até pouco antes de `expires_at` e nunca persistido, registrado em log ou devolvido ao cliente. O App precisa das permissões **Contents: read and write** no repositório de `GITHUB_REPOSITORY`. Nenhum desses valores pertence ao bundle cliente ou ao repositório. Nenhuma forma de pagamento é associada à conta do Groq (especificação do provedor §3): a proteção real é o teto interno (150.000 tokens/dia, 30 turnos/dia, 1 turno por vez), que falha fechado.

## Comandos

- `pnpm dev`: desenvolvimento com vinext/Vite.
- `pnpm typecheck`: TypeScript estrito.
- `pnpm test`: contrato de saúde com adapters injetados.
- `pnpm build`: gera o Worker em `dist/`.
- `pnpm preview`: executa o Worker gerado localmente.
- `pnpm test:e2e tests/e2e/health.spec.ts`: valida o endpoint no preview sem secrets.
- `pnpm deploy`: deploy explícito; não é executado por testes.

O smoke real de Neon e GitHub exige credenciais configuradas e deve produzir `{ "status": "ok", "runtime": "cloudflare", "database": "ok", "github": "ok" }`. Sem elas, o resultado esperado é `unconfigured`.
