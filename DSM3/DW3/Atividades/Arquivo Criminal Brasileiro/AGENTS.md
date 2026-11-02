# Repository Guidelines

REST API for **Arquivo Criminal Brasileiro** — public information about Brazilian criminal cases, linked to films, series and documentaries via TMDB. Academic project (FATEC Registro, DSM / Desenvolvimento Web III, ATV02), team HHR Solutions. Evaluated by a live 5–7 minute demo, not by CI.

Stack: Node.js + Express 5 + Mongoose + MongoDB Atlas, ESM, JWT Bearer (48h), Argon2id password hashing. Backend only — the Figma prototype is not implemented.

## Project Overview

Two entities, eight routes, manual verification. The API stores users and criminal cases; each case embeds its own details and its list of related audiovisual productions. There is no frontend, no background processing, no caching layer.

Everything is deliberately at the complexity level of the professor's classes (reference repo `dw3-api-express-mongodb`). The code must stay explainable in a 5–7 minute presentation and recognizable next to the class code. That constraint, not elegance, decides what belongs here.

**Read before changing anything**, in this order:

1. `docs/architecture.md` — layers, per-module layout, request flow.
2. `docs/domain.md` — entity vocabulary, invariants, lifecycle, open points.
3. `docs/decisions/` — accepted ADRs (001–005). Read before "improving" anything.
4. `docs/operations.md` — run, configure, debug.
5. HTTP contract — `docs/swaggerDocs.yaml`, browsable at `GET /api-docs`.

## Architecture & Data Flow

Fixed chain, no exceptions:

```
Route → Controller → Service → Model → MongoDB
```

One `route`/`controller`/`service` trio per domain, plus `middleware/Auth.js`. There are **no** repositories, DTOs, dependency injection, or central error handler — their absence is a decision (`docs/decisions/005-escopo-travado-2-entidades.md`), not an oversight.

Request flow for a protected route:

```
index.js (express.json / urlencoded)
  → app.use('/', <entity>Routes)        # all three routers mounted at '/'
    → Auth.Authorization                # per-route guard, never app.use
      → controller                       # reads req.body / req.params / req.query
        → service                        # positional args, not objects
          → Mongoose model
            → MongoDB Atlas
```

Facts that follow from that wiring:

- All three routers mount at `'/'`, so a route path is exactly the string in its router file. No prefix is added at mount time.
- `Auth.Authorization` is attached per route (`casoRoutes.js`, `tmdbRoutes.js`), never globally. `userRoutes.js` does not import it at all — `/user` and `/login` are public by construction.
- `index.js` registers no 404 handler, no error middleware, no CORS/helmet/rate limiter. Unmatched paths fall through to Express's default HTML 404.
- The TMDB module has no Model and persists nothing — it only normalizes search results so the client can compose `producoes[]` when creating or updating a case.

### Scope lock (hard rules)

The assignment contract in `HHR_Solutions_LLM_Areas_v5_1_REFINADO_SIMPLES/shared/01_CONTRATO_GLOBAL.md` fixes entities, fields, routes and auth. Treat it as binding:

- Domain is exactly `User` and `Caso`. `detalhes` (object) and `producoes` (array) are **embedded subdocuments** inside `Caso`. Only the `users` and `casos` collections exist. Embedded, never `ref`/`populate`, never separate Pessoa/Evento/Fonte/Produção collections (`docs/decisions/003-documentos-aninhados-sem-ref-populate.md`).
- The graded CRUD is over **`casos` only**. `User` is deliberately limited to `POST /user` and `POST /login` — it is not an entity with its own read/update/delete routes, and the checklist marks "CRUD de `casos` funcionando", "Cadastro de usuário" and "Login" as separate items (`shared/02_CHECKLIST_ENTREGA.md:4,7,8`). The assignment ships an eval asserting `GET /user/:id` must **not** be invented (`shared/03_LLM_EVALS.md:24`).
- Production subdocument fields, exactly: `tmdbId` (not `tmbId`), `titulo`, `tipo` ∈ `filme` | `série` | `documentário` (accents included), `ano`, `sinopse`, `poster`. Nothing enforces these at the interface yet — `docs/swaggerDocs.yaml` is still a placeholder — so a wrong field name fails only at runtime.
- Write idiomatic class-level Express/Mongoose code in the style of the neighbouring module. Mirror it; do not introduce a second pattern beside it.
- When a task seems to call for anything outside that frame — a new layer, a validation library, an abstraction, a new entity — state the reason and the impact on Banco/Backend/Documentação/Design instead of implementing it. Contract changes pass through `shared/01_CONTRATO_GLOBAL.md` first (`HHR_Solutions_LLM_Areas_v5_1_REFINADO_SIMPLES/AGENTS.md:23`).

## Key Directories

| Path | Purpose |
|---|---|
| `index.js` | Entry point: body parsers, router mounts, Swagger mount, `app.listen`. |
| `routes/` | `express.Router()` instances declaring method + path + guard + controller. |
| `controllers/` | HTTP layer: read request, validate, call service, choose status code. |
| `services/` | Mongoose calls. One class per domain, exported as a singleton instance. |
| `models/` | `Users.js`, `Casos.js` — schemas and compiled models. |
| `middleware/` | `Auth.js` only: JWT verification, injects `req.loggedUser`. |
| `config/` | `db-connection.js` (Atlas connection), `swagger-config.js` (OpenAPI skeleton). |
| `docs/` | Architecture, domain, operations, ADRs, and the HTTP contract YAML. |
| `HHR_Solutions_LLM_Areas_v5_1_REFINADO_SIMPLES/` | The assignment specification. Reference material — never treat its snippets as this repo's source, and never edit it as code. |

## Development Commands

```bash
npm install        # argon2 is a native dependency and builds on install
npm start          # npx nodemon index.js — API on http://localhost:4000
node index.js      # same without nodemon
```

Swagger UI: `http://localhost:4000/api-docs`

- Run from the repository root. Both `dotenv` and the Swagger `apis` globs resolve relative to the current working directory, so starting from elsewhere silently loses `.env` and the spec file.
- Port: `process.env.PORT || 4000` (`index.js:38`).
- `npm test` is the untouched npm-init stub (`echo "Error: no test specified" && exit 1`). It fails by construction — a red `npm test` is not a regression you caused. There is no test suite, no linter, and no build step to run.

## Code Conventions & Common Patterns

**Module system.** ESM only: `import` / `export default`. No `require`, no `module.exports`.

**Exports follow the layer**, and this shape is itself the convention:

```js
routes/       export default router;                  // the Router object
controllers/  export default { createUser, loginUser, JWTSecret };   // plain object of functions
services/     export default new casoService();       // a class INSTANCE (singleton)
models/       export default Caso;                    // the compiled Mongoose model
middleware/   export default { Authorization };       // plain object of functions
```

**Naming.**

- Files: camelCase with a layer suffix — `<entity>Routes.js`, `<entity>Controller.js`, `<entity>Service.js`.
- Models are the exception: plural-capitalized **filenames** holding singular model names — `models/Casos.js` → `mongoose.model("Caso", casoSchema)`; `models/Users.js` → `mongoose.model("User", userSchema)`.
- Controller handlers are arrow-function consts: `const createCaso = async (req, res) => { … }`, declared without `export` and collected in the default-export object.
- Service methods use mixed casing on both sides — PascalCase for writes (`Create`, `Update`, `Delete`) and camelCase for reads (`getAll`, `getOne`). Keep it; do not normalize to one case.
- Domain language is Portuguese: `Caso`, `detalhes`, `producoes`, `titulo`, `resumo`, `categorias`, `situacaoJudicial`. Preserve it exactly — identifiers, field names and user-facing messages.

**Twin-module pattern.** `User` and `Caso` are structural twins. To add behaviour, copy the shape of the neighbouring file rather than inventing one:

| Layer | User side | Caso side |
|---|---|---|
| Route | `routes/userRoutes.js` | `routes/casoRoutes.js` (+ `import Auth`) |
| Controller | `controllers/userController.js` | `controllers/casoController.js` |
| Service | `services/userService.js` | `services/casoService.js` |
| Model | `models/Users.js` | `models/Casos.js` |

`middleware/Auth.js` and the `tmdb*` trio have no twin.

**Async.** `async`/`await` for every database and service call. The only callback style is `jwt.sign` / `jwt.verify` — leave them as callbacks, they are not awaiting targets.

**Error handling.** Each controller wraps its body in `try { … } catch (error) { console.log(error); res.status(500).json({ error: "Erro interno do servidor." }); }`. No `next(err)`, no custom error classes, no `throw`.

**Responses.** Writes → `{ message: <string> }`; reads → `{ casos: [...] }` / `{ caso: {...} }` / `{ producoes: [...] }`; login → a bare `{ token }`; errors → `{ error: <string> }`. `DELETE /casos/:id` returns 204 via `res.sendStatus(204)` with no body — the only non-JSON response. Messages are Portuguese, and documented status codes are inlined as comments beside the call (`// Cod. 201: CREATED`).

**Validation** lives in controllers only, and only where it currently exists: `ObjectId.isValid(id)` on `:id` routes and a non-empty `query` check on `/tmdb/buscar`. No validation library is imported anywhere.

### Known traps

These are real divergences in the current tree. Do not "fix" them silently — flag them, because field names and enum values are contract-bound (`docs/domain.md`, `shared/01_CONTRATO_GLOBAL.md:32`).

- **Services swallow errors.** Every service method catches and only `console.log`s, returning `undefined` (`services/casoService.js`, `services/userService.js`). Controllers therefore answer 201/200 regardless of whether the write succeeded. Treat a 201 as "request accepted", not "document persisted".
- **`PUT`/`DELETE` on a nonexistent `:id` still report success** — `findByIdAndUpdate` has no options and `findByIdAndDelete`'s result is discarded.
- `models/Users.js` and `models/Casos.js` are **provisional** and owned by the Banco area; their field names and types are contract-bound, so changes there need the area's sign-off rather than a local edit.

## Important Files

| File | Why it matters |
|---|---|
| `index.js` | Load order, the three `'/'` mounts, Swagger mount, port selection. |
| `config/db-connection.js` | Builds the Atlas URI from four env vars, **connects at import time**, and on failure only logs — the process keeps serving without a database. |
| `middleware/Auth.js` | Reads `authorization`, splits on space, verifies with the secret borrowed from the controller. |
| `controllers/userController.js` | Where `dotenv.config()` actually runs, where `JWT_SECRET` is read and re-exported, Argon2id hashing, JWT signing. |
| `models/Casos.js` | The embedded `detalhes` / `producaoSchema` subdocument definitions. |
| `config/swagger-config.js` | Spec globs, hardcoded `servers: http://localhost:4000`, `bearerAuth` scheme. |
| `docs/swaggerDocs.yaml` | Declared source of truth for the HTTP contract — currently a placeholder with `paths: {}`. |
| `services/tmdbService.js` | The only outbound HTTP call. Accepts either TMDB credential form; throws on any non-2xx; maps `genre_ids` containing 99 to `documentário`; drops `media_type: 'person'`. |
| `controllers/tmdbController.js` | Validates `query` with `typeof query !== 'string'`, which is load-bearing: `?query=a&query=b` makes Express build an **array**, and `.trim()` on an array is a TypeError that surfaces as a 500. |

Two structural notes worth knowing before you touch auth: the environment is loaded as an **import side effect** of `controllers/userController.js` (not by `index.js`), and `JWT_SECRET` is exported from the controller and consumed by the middleware rather than being read from `process.env` in both places. Both work, and both are load-bearing for the current import graph.

## Runtime/Tooling Preferences

- **Runtime:** Node.js, ESM (`"type": "module"`). No TypeScript, ever — it is explicitly forbidden by the spec.
- **Node floor:** ≥ 20.19.0, imposed by `mongoose` / `mongodb`. Nothing pins it (`no engines`, no `.nvmrc`), so verify the local version rather than assuming.
- **Package manager:** npm. `package-lock.json` is committed (`lockfileVersion: 3`).
- **Dependencies are fixed:** `express`, `mongoose`, `mongodb`, `jsonwebtoken`, `argon2`, `dotenv`, `swagger-jsdoc`, `swagger-ui-express`, plus `nodemon` as a devDependency. Adding a dependency is a contract-level decision — check the spec's prohibition list first (TypeScript, Prisma, Repository Pattern, Clean/hexagonal, DI, Zod/Joi, Redis, Docker, microservices, GraphQL).
- **No build, lint, or format tooling exists** — verified absent: bundlers, CI configs, ESLint, Prettier, EditorConfig, tsconfig, pre-commit hooks. Match the surrounding file's formatting by hand; note that indentation is currently 2 spaces in controllers/models and 4 in services/middleware.
- **Environment variables:** `PORT`, `JWT_SECRET`, `TMDB_API_TOKEN`, `MONGODB_USERNAME`, `MONGODB_PASSWORD`, `MONGODB_CLUSTER`, `MONGODB_DATABASE`, plus optional `MONGODB_URI`. The Atlas ones are documented in `docs/operations.md` §Variáveis de ambiente; `TMDB_API_TOKEN` accepts either credential form.
- **Atlas is a graded requirement** (`shared/00_ATIVIDADE_OFICIAL.md:12,17`; `shared/02_CHECKLIST_ENTREGA.md:5`), so never replace it. `MONGODB_URI` exists only as an opt-in testing escape hatch: when set, `config/db-connection.js` uses that URI verbatim and ignores the Atlas variables, logging `(LOCAL)` or `(Atlas)` on connect so the active target is never ambiguous. It ships commented out in `.env` — leave it that way unless actively testing locally.
- **Secrets:** `.env` is gitignored (and untracked, with no history). Never print, echo, or commit `JWT_SECRET`, `TMDB_API_TOKEN`, or Atlas credentials. There is no `.env.example` — create the variables by hand. If a secret is ever exposed, rotate it.

## Testing & QA

**There are no automated tests and no linter.** This is stated in `docs/architecture.md:38` and is a deliberate property of the project, not a gap to fill with a new framework.

Verification is manual and is the acceptance mechanism for the assignment:

1. `npm install` → `npm start`; confirm `API iniciada com sucesso na porta 4000`.
2. Open `http://localhost:4000/api-docs`.
3. Run the Insomnia collection **"Arquivo Criminal Brasileiro"** (folders `Usuários` and `Casos`) — 8 requests, external to this repo, in order: `01 Cadastrar usuário` → `02 Fazer login` → `03 Listar casos` → `04 Cadastrar caso` → `05 Consultar caso por ID` → `06 Atualizar caso` → `07 Excluir registro de teste` → `08 Buscar produção no TMDB`. Send `Authorization: Bearer TOKEN` on the protected ones.
4. Expect these statuses: `POST /user` 201; `POST /login` 200 with `{token}`; `GET /casos` 200; `POST /casos` 201; `GET /casos/:id` 200, 400 for a malformed id, 404 when absent; `PUT /casos/:id` 200; `DELETE /casos/:id` 204; `GET /tmdb/buscar?query=…` 200.

`docs/operations.md` §Depurar is the triage table — symptom → cause — covering `401 Token nao informado`, `401 Token inválido`, `400` on `:id` routes, `404` on `GET /casos/:id`, and a login that returns 404. Debug by walking the chain `Route → Controller → Service → Model → Atlas` and applying the smallest correction.

Validate the TMDB credential before demoing, before touching any code. TMDB accepts two credential forms with the same access, and `services/tmdbService.js` picks the right one automatically:

```bash
# API Key v3 (32 hex chars)
curl -s "https://api.themoviedb.org/3/authentication?api_key=$TMDB_API_TOKEN"
# Read Access Token v4 (JWT starting with eyJ)
curl -s -H "Authorization: Bearer $TMDB_API_TOKEN" https://api.themoviedb.org/3/authentication
```

`{"success":true,...}` means the credential works. `{"status_code":7,...,"success":false}` means it does not, and step 8 of the Insomnia run will return 500.

The Insomnia collection ("Crimes") drives its URLs and auth from environment variables, so a login refresh is a one-place edit:

| Variable | Purpose |
|---|---|
| `base_url` | `http://localhost:4000` — change here if the port changes. |
| `token` | Paste the JWT returned by `02 Fazer login`. |
| `caseId` | Paste the `_id` from `04 Cadastrar caso` / `03 Listar casos`. |

All eight requests use `{{ base_url }}`; the three `:id` requests use `{{ caseId }}`; the six protected ones use Bearer auth with token `{{ token }}` and prefix `Bearer` (the prefix matters — `middleware/Auth.js` splits on a space and reads index 1, so a bare token with no scheme would 401).

That JWT expires 48h after login, so `token` needs refreshing before each demo. An expired token makes all six protected requests answer `401 Token inválido`, which reads like an auth bug but is only staleness.

Practical consequences of the missing harness:

- Do not add a test framework, linter, or CI to this repo unless the user explicitly asks.
- Because services swallow errors and controllers assert success, **status codes alone do not prove persistence**. Confirm writes by reading back — `GET /casos/:id` or the Atlas UI.
- **Atlas unreachable → the API stays up, but database routes fail.** `config/db-connection.js` catches the connect rejection, so the process survives server-selection timeout; the catch logs an actionable message naming `MONGODB_USERNAME` / `MONGODB_PASSWORD` / `MONGODB_CLUSTER` and the Atlas IP whitelist. `/api-docs` and auth validation (the 401s) keep working, which is what `docs/operations.md` means by "a API continua no ar por desenho". Without that catch the rejection is unhandled and the process dies with exit code 1 on Node ≥ 15 — do not remove it.
- If `/tmdb/buscar` returns 500, the cause is logged: the service throws on any non-2xx from TMDB (invalid token, rate limit, outage). A `200` with `{"producoes":[]}` means TMDB answered but nothing matched — the two are now distinguishable.
