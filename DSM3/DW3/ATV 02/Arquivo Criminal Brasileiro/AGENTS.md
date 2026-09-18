# AGENTS.md — Arquivo Criminal Brasileiro (API)

API REST de casos criminais brasileiros relacionados a produções audiovisuais (filmes, séries, documentários). Projeto acadêmico FATEC ATV02, equipe HHR Solutions. Express + Mongoose + MongoDB Atlas, autenticação JWT com Argon2id.

## Ordem de leitura

1. `docs/architecture.md` — camadas, módulos e fluxo de dados.
2. `docs/domain.md` — entidades, regras de negócio e invariantes.
3. `docs/decisions/` — decisões arquiteturais (ADRs); leia antes de "melhorar" qualquer coisa.
4. `docs/operations.md` — como rodar, configurar e depurar.
5. Contrato HTTP: `docs/swaggerDocs.yaml` (interface em `GET /api-docs`).

## Regras inegociáveis

- **`docs/swaggerDocs.yaml` é a fonte de verdade do contrato HTTP** (endpoints, métodos, parâmetros, bodies, schemas, códigos de status, marcação pública/protegida). Não duplique essas informações em Markdown — referencie.
- Arquitetura fixa: `Route → Controller → Service → Model → MongoDB`. Não introduza camadas (repository, DTO, DI) nem frameworks.
- Escopo travado: apenas as entidades `User` e `Caso`. `detalhes` e `producoes` vivem dentro de `Caso` (proibido `ref/populate` ou collections separadas).
- Proibições: TypeScript, Prisma, Clean/hexagonal, Zod/Joi, Redis, Docker, GraphQL, microserviços. Complexidade no nível das aulas (referência: repositório `dw3-api-express-mongodb` do professor).
- Não invente rotas, campos ou status. Toda mudança de contrato (rotas, campos, auth, Models) precisa passar pelo contrato global (`HHR_Solutions_LLM_Areas_v5_1_REFINADO_SIMPLES/shared/01_CONTRATO_GLOBAL.md`) antes de virar código.
- Nunca exponha `JWT_SECRET`, `TMDB_API_TOKEN` ou credenciais do Atlas. Segredos só via `.env` (gitignored).
- Padrão de módulo: para adicionar comportamento, espelhe o módulo vizinho — `User` e `Caso` são gêmeos estruturais (routes/controllers/services).

## Comandos

```bash
npm install        # instala dependências
npm start          # nodemon index.js — API na porta 4000
```

Swagger UI: `http://localhost:4000/api-docs`. Testes manuais: coleção Insomnia "Arquivo Criminal Brasileiro" (8 requests). Não há testes automatizados nem linter.

## Estado atual e pendências (não confundir com bugs)

- `models/Users.js` e `models/Casos.js` são **provisórios** — a serem assumidos pelo responsável do Banco (ver cabeçalho dos arquivos).
- `docs/swaggerDocs.yaml` é **placeholder** — o conteúdo real é responsabilidade da área de Documentação.
- Conexão com Atlas depende de `MONGODB_USERNAME`/`MONGODB_PASSWORD` reais no `.env`; sem elas, o log mostra `bad auth` e a API sobe mesmo assim (intencional, ver `config/db-connection.js`).
- `HHR_Solutions_LLM_Areas_v5_1_REFINADO_SIMPLES/` é a especificação da atividade (spec externa, não tocar como código).
