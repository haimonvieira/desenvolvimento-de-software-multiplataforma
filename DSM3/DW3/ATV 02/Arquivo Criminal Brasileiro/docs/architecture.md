# Arquitetura

## Camadas

A API segue `Route → Controller → Service → Model → MongoDB`, espelhando as aulas do professor (`dw3-api-express-mongodb`, aula 05). Não há repositories, DTOs, injeção de dependência ou error handler central.

| Camada | Responsabilidade | Exemplo |
|---|---|---|
| **Route** | Associa método HTTP + caminho + middleware + função do controller. Não contém lógica | `routes/casoRoutes.js` |
| **Controller** | Lê `req` (params/body/query), valida o mínimo necessário, chama o Service, monta a resposta HTTP com o status do contrato | `controllers/casoController.js` |
| **Service** | Operações de consulta e persistência; fala com o Model. Não conhece HTTP | `services/casoService.js` |
| **Model** | Schema Mongoose; define a estrutura persistida | `models/Casos.js` |
| **Middleware** | `middleware/Auth.js`: lê `Authorization: Bearer TOKEN`, valida o JWT, injeta `req.loggedUser` ou responde 401 | — |

## Módulos

Um trio route/controller/service por domínio. `User` e `Caso` são gêmeos estruturais — para adicionar comportamento, espelhe o módulo vizinho.

- **User** (público): `userRoutes.js`, `userController.js` (hash Argon2id no cadastro, verificação + JWT de 48h no login), `userService.js`, `models/Users.js`.
- **Caso** (protegido): `casoRoutes.js` (todas as rotas com `Auth.Authorization`), `casoController.js` (valida `ObjectId.isValid` antes de chamar o service), `casoService.js`, `models/Casos.js`.
- **TMDB** (protegido, extensão): `tmdbRoutes.js`, `tmdbController.js` (valida a query string), `tmdbService.js` (fetch no Search Multi + normalização). Não tem Model — não persiste nada.
- **Infra**: `config/db-connection.js` (conexão Atlas via env, não derruba o processo se falhar), `config/swagger-config.js` + `docs/swaggerDocs.yaml` (Swagger UI em `/api-docs`), `index.js` (monta Express + rotas + Swagger).

## Fluxo de uma request

```
Cliente → Route (middleware Auth, se protegida) → Controller (valida, chama Service)
→ Service (opera via Model) → MongoDB (Atlas)
← resposta HTTP com status do contrato
```

Exemplo concreto: `GET /casos/:id` → `casoRoutes` aplica `Auth.Authorization` → `getOneCaso` valida o ObjectId (400 se inválido) → `casoService.getOne` faz `findOne` → 404 se não achou, 200 com `{caso}` se achou.

## Limitações conhecidas (não são decisões — são dívidas)

- **Erros tratados ad-hoc**: cada função de controller tem seu try/catch com `console.log(error)` + resposta 500 genérica. Não há middleware de erro central nem logging estruturado.
- **Sem autorização**: existe apenas autenticação (token válido ou não). Não há roles, permissões ou dono de recurso.
- **Sem testes automatizados**: validação é manual (boot + Insomnia). Ver `operations.md`.
- **Services engolem erros**: `userService`/`casoService` capturam exceções com `console.log` e retornam `undefined` — o controller não distingue "não achou" de "falhou". Herdado do padrão da aula; manter consciente.
