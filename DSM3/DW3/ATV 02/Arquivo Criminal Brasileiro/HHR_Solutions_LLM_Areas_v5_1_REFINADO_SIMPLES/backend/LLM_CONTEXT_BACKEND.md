# Contexto completo para LLM - Backend

Este arquivo consolida o mapa da área, as instruções específicas do agente e o guia humano.
Use também o `AGENTS.md` da raiz para regras globais do projeto.

---

# HHR Solutions - Backend

> Mapa de contexto para LLMs que auxiliam o responsável pelo Backend do Arquivo Criminal Brasileiro.

Use o guia como contrato da área. Mantenha o padrão Route -> Controller -> Service -> Model, use as aulas como principal referência e trate Argon2id e TMDB como extensões aprovadas.

## Project documentation

- [Guia de Backend](./01_BACKEND.md): escopo, rotas, responsabilidades, arquivos, autenticação, TMDB, Swagger e critérios de conclusão.
- [Instruções do agente de Backend](./AGENTS.md): comportamento e regras específicas para a área.
- [Contrato global](../shared/01_CONTRATO_GLOBAL.md): entidades, rotas e decisões compartilhadas.
- [Atividade oficial](../shared/00_ATIVIDADE_OFICIAL.md): requisitos obrigatórios da disciplina.

## Classroom references

- [Aula 02 - CRUD da API](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-02-crud-da-api): referência para Routes, Controllers, Services, CRUD e ObjectId.
- [Aula 04 - Autenticação JWT](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-04-autenticacao-na-api-jwt): referência para JWT e middleware.
- [Aula 05 - Hash e variáveis de ambiente](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente): referência principal para cadastro, login, autenticação e segredos.
- [Swagger do professor](https://github.com/maxxdiego/17_documentacao_de_api_com_swagger): referência de integração Swagger.

## External references

- [node-argon2](https://github.com/ranisalt/node-argon2): referência para hash e verificação com Argon2id.
- [TMDB Search Multi](https://developer.themoviedb.org/reference/search-multi): referência para pesquisa externa de produções.
- [Express Routing](https://expressjs.com/en/guide/routing.html): referência oficial de rotas Express.

## Optional

- [PDF do guia](./01_BACKEND_HHR_SOLUTIONS.pdf): versão diagramada para leitura humana.
- [Checklist geral](../shared/02_CHECKLIST_ENTREGA.md): itens finais da atividade.


---

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


---

# HHR SOLUTIONS
## Arquivo Criminal Brasileiro
**ATV02 - API REST + MongoDB**

> Material de orientação. Define o que deve ser construído e onde consultar exemplos, sem entregar a implementação pronta.


# GUIA 01 - BACKEND

## 1. Responsabilidade

Construir a API REST seguindo a organização estudada em aula:

```text
Route -> Controller -> Service -> Model -> MongoDB
```

Também será responsável por integrar autenticação, Argon2id, JWT, TMDB e a infraestrutura do Swagger.

O guia informa o contrato esperado. A lógica de cada função deve ser desenvolvida pelo responsável.

> **Referencia para esta secao**  
> **Aula 05 - estrutura geral da API:** [https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente)  
> **O que procurar:** Observe a separação entre rotas, controllers, services, models, usuário e middleware.  
> **Express - roteamento:** [https://expressjs.com/pt-br/guide/routing/](https://expressjs.com/pt-br/guide/routing/)  
> **O que procurar:** Use para entender método HTTP, caminho e handler sem copiar uma solução pronta.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 2. Estrutura esperada

O projeto deve possuir uma organização equivalente à usada nas aulas.

| Área | Arquivos esperados |
|---|---|
| entrada da aplicação | `index.js` |
| rotas | `casoRoutes.js`, `userRoutes.js`, `tmdbRoutes.js` |
| controllers | `casoController.js`, `userController.js`, `tmdbController.js` |
| services | `casoService.js`, `userService.js`, `tmdbService.js` |
| models | `Casos.js`, `Users.js` |
| autenticação | `middleware/Auth.js` |
| banco | `config/db-connection.js` |
| Swagger | `config/swagger-config.js` |
| documentação Swagger | consumir `docs/swaggerDocs.yaml` criado pela Documentação |

> **Referencia para esta secao**  
> **Aula 05 - organização de arquivos:** [https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente)  
> **O que procurar:** Compare a estrutura de Games e Users com a estrutura esperada neste projeto.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 3. Dependências do projeto

O Backend deve utilizar as mesmas tecnologias centrais das aulas e as extensões escolhidas pelo grupo.

| Dependência | Uso |
|---|---|
| Express | API e rotas |
| Mongoose | comunicação com MongoDB |
| MongoDB | validação/utilidades usadas no padrão da aula |
| dotenv | variáveis de ambiente |
| jsonwebtoken | geração e validação de JWT |
| argon2 | hash Argon2id e verificação de senha |
| swagger-jsdoc | leitura da especificação Swagger/OpenAPI |
| swagger-ui-express | interface `/api-docs` |
| nodemon | execução durante desenvolvimento |

> **Referencia para esta secao**  
> **Aula 05 - package.json:** [https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente)  
> **O que procurar:** Use a lista de dependências da aula como base.  
> **node-argon2:** [https://github.com/ranisalt/node-argon2](https://github.com/ranisalt/node-argon2)  
> **O que procurar:** Consulte a documentação da biblioteca adotada no lugar do bcrypt.  
> **Swagger do professor:** [https://github.com/maxxdiego/17_documentacao_de_api_com_swagger](https://github.com/maxxdiego/17_documentacao_de_api_com_swagger)  
> **O que procurar:** Consulte as dependências usadas para publicar o Swagger UI.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 4. Variáveis de ambiente

O Backend deve prever:

| Variável | Finalidade |
|---|---|
| `PORT` | porta da API |
| `JWT_SECRET` | segredo usado pelo JWT |
| `TMDB_API_TOKEN` | token da API TMDB |
| `MONGODB_USERNAME` | usuário do Atlas |
| `MONGODB_PASSWORD` | senha do Atlas |

O padrão da Aula 03.2 pode ser usado como referência para separar as credenciais do Atlas.

> **Referencia para esta secao**  
> **Aula 03.2 - MongoDB Atlas e variáveis:** [https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-03.2-hospedagem-no-mongodb-atlas](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-03.2-hospedagem-no-mongodb-atlas)  
> **O que procurar:** Observe como as credenciais do Atlas são lidas por variáveis de ambiente.  
> **Aula 05 - JWT_SECRET:** [https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente)  
> **O que procurar:** Observe onde o segredo JWT é lido no fluxo de autenticação.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 5. Contrato de autenticação

## Cadastro

| Item | Definição |
|---|---|
| Método | POST |
| Rota | `/user` |
| Autenticação | pública |
| Entrada | `email`, `password` |
| Processo esperado | gerar hash Argon2id e persistir usuário |
| Sucesso | 201 |
| Falha geral | 500 |

A senha recebida deve ser transformada em hash antes da persistência.

Referência de fluxo semelhante: `userController.js` da Aula 05.  
Troca definida pelo grupo: bcrypt da aula por Argon2id.

## Login

| Item | Definição |
|---|---|
| Método | POST |
| Rota | `/login` |
| Autenticação | pública |
| Entrada | `email`, `password` |
| Busca | localizar usuário pelo e-mail |
| Verificação | comparar senha com hash Argon2id |
| Saída de sucesso | token JWT |
| Expiração de referência | 48 horas, seguindo a Aula 05 |
| Possíveis status | 200, 400, 401, 404, 500 |

## Middleware

Criar um middleware equivalente ao `Auth.Authorization` da Aula 05.

Ele deve:

1. ler o cabeçalho `Authorization`;
2. trabalhar com o formato `Bearer TOKEN`;
3. validar o JWT;
4. liberar a requisição quando o token estiver válido;
5. responder com 401 quando a autenticação falhar.

> **Referencia para esta secao**  
> **Aula 05 - userController e Auth:** [https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente)  
> **O que procurar:** Use como referência do fluxo cadastro, login, JWT e middleware.  
> **node-argon2:** [https://github.com/ranisalt/node-argon2](https://github.com/ranisalt/node-argon2)  
> **O que procurar:** Pesquise hash e verify para implementar a troca de bcrypt por Argon2id.  
> **jsonwebtoken:** [https://github.com/auth0/node-jsonwebtoken/blob/master/README.md](https://github.com/auth0/node-jsonwebtoken/blob/master/README.md)  
> **O que procurar:** Consulte sign e verify.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 6. Contrato das rotas de Caso

Todas as rotas abaixo são protegidas por Bearer Token.

## GET `/casos`

| Item | Definição |
|---|---|
| Finalidade | listar todos os casos |
| Entrada | nenhuma |
| Retorno | coleção/lista de casos |
| Sucesso | 200 |
| Erro geral | 500 |

## POST `/casos`

| Item | Definição |
|---|---|
| Finalidade | cadastrar um caso |
| Body | estrutura completa de Caso |
| Sucesso | 201 |
| Erro geral | 500 |

Campos esperados no Body:

```text
titulo
resumo
categorias[]
detalhes
    cidade
    estado
    anoInicio
    anoFim
    situacaoJudicial
producoes[]
    tmdbId
    titulo
    tipo
    ano
    sinopse
    poster
```

Significado dos campos que podem gerar dúvida:

- `categorias[]`: lista de classificações do caso. Pode receber mais de um texto.
- `detalhes`: objeto aninhado com informações gerais do próprio caso.
- `situacaoJudicial`: texto simples com a situação judicial geral registrada para o caso.
- `producoes[]`: lista de filmes, séries ou documentários relacionados. Cada item segue o formato de Produção definido pelo Banco.
- `_id`: não deve vir no Body. O MongoDB gera esse identificador automaticamente quando o documento é salvo.

## GET `/casos/:id`

| Item | Definição |
|---|---|
| Finalidade | consultar um caso específico |
| Parâmetro | `id` |
| Validação | ObjectId válido |
| Sucesso | 200 |
| ID inválido | 400 |
| Caso inexistente | 404 |
| Erro geral | 500 |

## PUT `/casos/:id`

| Item | Definição |
|---|---|
| Finalidade | atualizar um caso |
| Parâmetro | `id` |
| Body | campos do Caso |
| Validação | ObjectId válido |
| Sucesso | 200 |
| ID inválido | 400 |
| Erro geral | 500 |

## DELETE `/casos/:id`

| Item | Definição |
|---|---|
| Finalidade | excluir um caso |
| Parâmetro | `id` |
| Validação | ObjectId válido |
| Sucesso | 204 |
| ID inválido | 400 |
| Erro geral | 500 |

> **Referencia para esta secao**  
> **Aula 05 - CRUD de Games:** [https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente)  
> **O que procurar:** Use gameRoutes, gameController e gameService como padrão para estruturar o CRUD de Caso.  
> **Express - roteamento:** [https://expressjs.com/pt-br/guide/routing/](https://expressjs.com/pt-br/guide/routing/)  
> **O que procurar:** Consulte parâmetros de rota como :id e métodos GET, POST, PUT e DELETE.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 7. Organização Controller, Service e Model

Seguir o padrão dos Games da aula.

## Route

Responsável por associar:

```text
método HTTP + caminho + middleware + função do controller
```

## Controller

Responsável por:

```text
receber req
ler params/body/query
validar dados necessários
chamar Service
montar resposta HTTP
```

## Service

Responsável por:

```text
operações de consulta e persistência
comunicação com Model
```

## Model

É fornecido pelo responsável do Banco e define a estrutura persistida.

Referência para essa separação: arquivos `gameRoutes.js`, `gameController.js` e `gameService.js` das aulas.

> **Referencia para esta secao**  
> **Aula 05 - Route, Controller e Service:** [https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente)  
> **O que procurar:** Compare as responsabilidades de cada camada nos arquivos de Games.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 8. Integração TMDB

A integração é uma extensão do projeto.

## Rota

| Item | Definição |
|---|---|
| Método | GET |
| Rota | `/tmdb/buscar` |
| Autenticação | Bearer Token |
| Query string | `query` |
| Exemplo de chamada | `/tmdb/buscar?query=Tremembé` |
| Origem externa | TMDB Search Multi |
| Sucesso | 200 |
| Erro geral | 500 |

## Resultado que interessa ao projeto

Normalizar cada produção para:

| Campo | Tipo |
|---|---|
| `tmdbId` | Number |
| `titulo` | String |
| `tipo` | String |
| `ano` | Number |
| `sinopse` | String |
| `poster` | String |

A busca apenas retorna opções para auxiliar o preenchimento. Quando o usuário escolher uma produção, os campos usados pelo projeto podem ser aproveitados no cadastro ou atualização de `producoes[]` dentro do Caso. A busca TMDB não cria uma entidade ou collection separada.

Referência:
https://developer.themoviedb.org/reference/search-multi

> **Referencia para esta secao**  
> **TMDB - Search Multi:** [https://developer.themoviedb.org/reference/search-multi](https://developer.themoviedb.org/reference/search-multi)  
> **O que procurar:** Consulte parâmetros, autenticação da API e estrutura do resultado da pesquisa.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 9. Swagger - responsabilidade do Backend

O Backend é responsável por fazer a infraestrutura do Swagger funcionar.

Deve:

1. adicionar as dependências de Swagger usadas no repositório do professor;
2. criar a configuração equivalente a `swagger-config.js`;
3. apontar a configuração para `docs/swaggerDocs.yaml`;
4. integrar o Swagger ao Express;
5. disponibilizar a interface em `/api-docs`;
6. configurar suporte a Bearer/JWT.

A pessoa de Documentação é responsável pelo conteúdo do `swaggerDocs.yaml`.

Referência:
https://github.com/maxxdiego/17_documentacao_de_api_com_swagger

> **Referencia para esta secao**  
> **Swagger do professor:** [https://github.com/maxxdiego/17_documentacao_de_api_com_swagger](https://github.com/maxxdiego/17_documentacao_de_api_com_swagger)  
> **O que procurar:** Siga o padrão de swagger-jsdoc, swagger-ui-express, swagger-config.js e /api-docs.  
> **Swagger - Bearer Authentication:** [https://swagger.io/docs/specification/v3_0/authentication/bearer-authentication/](https://swagger.io/docs/specification/v3_0/authentication/bearer-authentication/)  
> **O que procurar:** Use para configurar/documentar o esquema Bearer JWT.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 10. Dependência do Banco

O Backend pode iniciar rotas, controllers, services, autenticação, TMDB e Swagger antes do Banco terminar.

Para realizar os testes reais de persistência, deve receber:

```text
config/db-connection.js
models/Casos.js
models/Users.js
credenciais do MongoDB Atlas
```

> **Referencia para esta secao**  
> **Aula 03.2 - conexão Atlas:** [https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-03.2-hospedagem-no-mongodb-atlas](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-03.2-hospedagem-no-mongodb-atlas)  
> **O que procurar:** Mostra o arquivo de conexão que o Banco precisa fornecer.  
> **Aula 03.1 - Model aninhado:** [https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-03.1-documentos-aninhados](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-03.1-documentos-aninhados)  
> **O que procurar:** Mostra o tipo de Model que o Backend consumirá.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 11. Entregas para a Documentação

Quando as rotas estiverem definidas, informar:

- método HTTP;
- rota;
- se é pública ou protegida;
- parâmetros;
- query strings;
- campos do Body;
- formato geral da resposta;
- códigos HTTP utilizados.

A Documentação usa isso para Swagger, README e Insomnia.

> **Referencia para esta secao**  
> **Swagger do professor:** [https://github.com/maxxdiego/17_documentacao_de_api_com_swagger](https://github.com/maxxdiego/17_documentacao_de_api_com_swagger)  
> **O que procurar:** Ajuda a entender quais informações de rota a Documentação precisa receber.  
> **OpenAPI - Paths and Operations:** [https://swagger.io/docs/specification/v3_0/paths-and-operations/](https://swagger.io/docs/specification/v3_0/paths-and-operations/)  
> **O que procurar:** Use como checklist de método, caminho, parâmetros e respostas.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 12. Critério de conclusão

O Backend está concluído quando for possível demonstrar:

```text
cadastrar usuário
fazer login
receber JWT
acessar rota protegida com Bearer Token
listar casos
cadastrar caso
consultar caso por ID
atualizar caso
excluir caso
buscar produção no TMDB
abrir /api-docs
```

> **Referencia para esta secao**  
> **Insomnia - Requests:** [https://developer.konghq.com/insomnia/requests/](https://developer.konghq.com/insomnia/requests/)  
> **O que procurar:** Use como referência para validar cada operação antes de considerar o Backend concluído.  
> **Insomnia - autenticação:** [https://developer.konghq.com/insomnia/request-authentication/](https://developer.konghq.com/insomnia/request-authentication/)  
> **O que procurar:** Use para testar Bearer Token nas rotas protegidas.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 13. Onde estudar para implementar

## Estrutura Route -> Controller -> Service -> Model
https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente

Consultar principalmente:

```text
routes/gameRoutes.js
controllers/gameController.js
services/gameService.js
```

## Usuário e JWT
https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente

Consultar:

```text
models/Users.js
services/userService.js
controllers/userController.js
routes/userRoutes.js
middleware/Auth.js
```

## MongoDB Atlas
https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-03.2-hospedagem-no-mongodb-atlas

## Argon2id
https://github.com/ranisalt/node-argon2

## TMDB
https://developer.themoviedb.org/reference/search-multi

## Swagger
https://github.com/maxxdiego/17_documentacao_de_api_com_swagger

> **Referencia para esta secao**  
> **Aula 05:** [https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente)  
> **O que procurar:** Referência principal para o padrão da disciplina.  
> **Aula 03.2:** [https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-03.2-hospedagem-no-mongodb-atlas](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-03.2-hospedagem-no-mongodb-atlas)  
> **O que procurar:** Referência de Atlas.  
> **Swagger do professor:** [https://github.com/maxxdiego/17_documentacao_de_api_com_swagger](https://github.com/maxxdiego/17_documentacao_de_api_com_swagger)  
> **O que procurar:** Referência de documentação técnica.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.
