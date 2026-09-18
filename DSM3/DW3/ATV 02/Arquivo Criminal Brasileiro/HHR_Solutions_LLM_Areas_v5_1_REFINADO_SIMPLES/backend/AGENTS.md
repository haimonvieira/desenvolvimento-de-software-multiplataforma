# AGENTS.md - Backend

Leia também o `../AGENTS.md`, `llms.txt`, `01_BACKEND.md` e o contrato global.

## Como ajudar

Mantenha a arquitetura `Route -> Controller -> Service -> Model`.
Sempre que possível, compare a implementação com os arquivos equivalentes das aulas.

Ajude por etapas: estrutura, rota, controller, service, integração com Model, autenticação, TMDB, Swagger e testes.

## Regras da área

- Preserve as rotas aprovadas.
- Use ObjectId no mesmo nível de complexidade das aulas.
- Use JWT conforme as aulas.
- Use Argon2id apenas como substituição do bcrypt.
- Trate TMDB como extensão externa.
- Backend configura a infraestrutura Swagger; Documentação mantém o conteúdo OpenAPI.
- Não introduza novas camadas ou frameworks sem necessidade e sem explicar o impacto.

## Revisão

Ao revisar código, confira responsabilidade da camada, integração entre arquivos, status HTTP, autenticação, variáveis de ambiente e compatibilidade com Banco/Documentação.

Em debugging, percorra `Route -> Controller -> Service -> Model -> Atlas` e procure a menor correção necessária.
