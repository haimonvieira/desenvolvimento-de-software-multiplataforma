# HHR SOLUTIONS
## Arquivo Criminal Brasileiro
**ATV02 - API REST + MongoDB**

> Material de orientação. Define o que deve ser construído e onde consultar exemplos, sem entregar a implementação pronta.


# GUIA 03 - DOCUMENTAÇÃO

## 1. Responsabilidade

Definir e manter o contrato da API de forma que Backend, Banco, materiais de entrega e apresentação trabalhem com os mesmos nomes e comportamentos.

A pessoa de Documentação não precisa implementar a lógica da API.

Ela deve registrar:

- entidades;
- atributos e tipos;
- endpoints;
- parâmetros;
- Body;
- autenticação;
- respostas;
- status HTTP;
- Swagger;
- README;
- coleção de testes do Insomnia.

> **Referencia para esta secao**  
> **Swagger do professor:** [https://github.com/maxxdiego/17_documentacao_de_api_com_swagger](https://github.com/maxxdiego/17_documentacao_de_api_com_swagger)  
> **O que procurar:** Use como referência principal do padrão de documentação adotado na disciplina.  
> **OpenAPI - Paths and Operations:** [https://swagger.io/docs/specification/v3_0/paths-and-operations/](https://swagger.io/docs/specification/v3_0/paths-and-operations/)  
> **O que procurar:** Mostra quais informações uma documentação de endpoint deve conter.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 2. Momento de início

A Documentação começa junto com Banco e Backend.

A primeira entrega é uma **Documentação v1**, criada a partir do contrato do grupo.

Essa versão libera o Design para trabalhar antes da API estar finalizada.

Depois, quando o Backend estiver funcionando, a pessoa revisa tudo e produz a versão final.

> **Referencia para esta secao**  
> **00_COMECE_AQUI.md:** `00_COMECE_AQUI.md`  
> **O que procurar:** Consulte o fluxo de dependências do grupo para saber quando publicar a versão v1 e quando fechar a versão final.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 3. Contrato de entidades

## User

| Atributo | Tipo | Observação |
|---|---|---|
| `_id` | ObjectId | MongoDB |
| `email` | String | cadastro/login |
| `password` | String | no banco contém hash Argon2id |

## Caso

| Atributo | Tipo | Significado |
|---|---|---|
| `_id` | ObjectId | gerado automaticamente pelo MongoDB; aparece nas respostas, mas não deve ser enviado no cadastro/edição |
| `titulo` | String | nome do caso |
| `resumo` | String | descrição informativa |
| `categorias` | Array<String> | classificações do caso |
| `detalhes` | Object | local, período e situação judicial geral |
| `producoes` | Array<Producao> | filmes, séries ou documentários relacionados |

## Detalhes

| Atributo | Tipo | Significado |
|---|---|---|
| `cidade` | String | cidade relacionada ao caso |
| `estado` | String | estado/UF |
| `anoInicio` | Number | ano inicial |
| `anoFim` | Number | ano final, quando fizer sentido |
| `situacaoJudicial` | String | texto simples com a situação judicial geral registrada para o caso |

## Producao

| Atributo | Tipo | Significado |
|---|---|---|
| `tmdbId` | Number | identificador retornado pelo TMDB |
| `titulo` | String | título da produção |
| `tipo` | String | filme, série ou documentário |
| `ano` | Number | ano de lançamento |
| `sinopse` | String | resumo da produção |
| `poster` | String | endereço da imagem/poster |

> **Referencia para esta secao**  
> **OpenAPI - Data Models:** [https://swagger.io/docs/specification/v3_0/data-models/](https://swagger.io/docs/specification/v3_0/data-models/)  
> **O que procurar:** Use para descrever entidades, propriedades e tipos.  
> **02_BANCO_DE_DADOS.md:** `02_BANCO_DE_DADOS.md`  
> **O que procurar:** Use como fonte interna dos nomes e tipos definidos pelo Banco.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 4. Catálogo de endpoints

## Rotas públicas

| Método | Rota | Body/entrada | Resultado esperado |
|---|---|---|---|
| POST | `/user` | `email`, `password` | confirmação de cadastro |
| POST | `/login` | `email`, `password` | JWT |

## Rotas protegidas

Todas devem ser documentadas com autenticação Bearer/JWT.

| Método | Rota | Entrada | Resultado esperado |
|---|---|---|---|
| GET | `/casos` | - | lista de casos |
| POST | `/casos` | objeto Caso | cadastro |
| GET | `/casos/:id` | `id` | um caso |
| PUT | `/casos/:id` | `id` + objeto Caso | atualização |
| DELETE | `/casos/:id` | `id` | exclusão |
| GET | `/tmdb/buscar` | query `query` | lista de produções |

## Swagger UI

| Método | Rota |
|---|---|
| GET | `/api-docs` |

> **Referencia para esta secao**  
> **OpenAPI - Paths and Operations:** [https://swagger.io/docs/specification/v3_0/paths-and-operations/](https://swagger.io/docs/specification/v3_0/paths-and-operations/)  
> **O que procurar:** Use para organizar método HTTP, rota, parâmetros e operação.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 5. Status HTTP a documentar

## Cadastro de usuário

```text
201 - criado
500 - erro interno
```

## Login

```text
200 - autenticado
400 - requisição inválida
401 - credenciais inválidas
404 - usuário inexistente
500 - erro interno
```

## CRUD de Caso

```text
200 - consulta/atualização bem-sucedida
201 - caso criado
204 - caso excluído sem conteúdo
400 - ID/requisição inválida
404 - registro não encontrado
500 - erro interno
```

A versão final deve refletir exatamente o que o Backend realmente implementar.

> **Referencia para esta secao**  
> **MDN - HTTP Status:** [https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Reference/Status)  
> **O que procurar:** Consulte o significado dos códigos HTTP antes de descrevê-los.  
> **Aula 05:** [https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente)  
> **O que procurar:** Compare os códigos usados pelo professor em cadastro, login e autenticação.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 6. Body de Caso

A Documentação deve apresentar a estrutura, sem determinar a lógica interna do Backend.

O `_id` não faz parte do Body de criação ou atualização, pois é gerado automaticamente pelo MongoDB. `categorias` é uma lista de classificações, `detalhes` reúne informações gerais do caso e `producoes` contém filmes, séries ou documentários relacionados.

```text
titulo: String
resumo: String
categorias: Array<String>

detalhes:
    cidade: String
    estado: String
    anoInicio: Number
    anoFim: Number
    situacaoJudicial: String

producoes:
    tmdbId: Number
    titulo: String
    tipo: String
    ano: Number
    sinopse: String
    poster: String
```

> **Referencia para esta secao**  
> **OpenAPI - Request Body:** [https://swagger.io/docs/specification/v3_0/describing-request-body/](https://swagger.io/docs/specification/v3_0/describing-request-body/)  
> **O que procurar:** Use para documentar o corpo enviado em POST e PUT.  
> **02_BANCO_DE_DADOS.md:** `02_BANCO_DE_DADOS.md`  
> **O que procurar:** Use como fonte da estrutura de Caso, Detalhes e Produção.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 7. Autenticação

Documentar o comportamento:

```text
Cadastro
→ senha recebida
→ Backend gera hash Argon2id
→ User é salvo

Login
→ usuário localizado pelo e-mail
→ senha verificada com Argon2id
→ Backend gera JWT

Rotas protegidas
→ cliente envia Authorization: Bearer TOKEN
→ middleware valida JWT
```

A Documentação descreve esse fluxo. O Backend decide e implementa a lógica.

> **Referencia para esta secao**  
> **Swagger - Bearer Authentication:** [https://swagger.io/docs/specification/v3_0/authentication/bearer-authentication/](https://swagger.io/docs/specification/v3_0/authentication/bearer-authentication/)  
> **O que procurar:** Use para descrever Authorization: Bearer TOKEN.  
> **Aula 05 - autenticação:** [https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente](https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente)  
> **O que procurar:** Use para entender o fluxo real que será descrito.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 8. Swagger - divisão de responsabilidade

## Backend

Responsável por:

```text
configuração do Swagger
dependências
integração com Express
rota /api-docs
leitura do swaggerDocs.yaml
Bearer/JWT na configuração
```

## Documentação

Responsável por:

```text
docs/swaggerDocs.yaml
schemas
paths
parâmetros
Bodies
responses
status HTTP
exemplos
indicação de rotas públicas e protegidas
```

> **Referencia para esta secao**  
> **Swagger do professor:** [https://github.com/maxxdiego/17_documentacao_de_api_com_swagger](https://github.com/maxxdiego/17_documentacao_de_api_com_swagger)  
> **O que procurar:** O README do repositório mostra a divisão entre configuração no Backend e conteúdo em swaggerDocs.yaml.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 9. O que deve existir no Swagger

A interface final deve permitir visualizar:

```text
POST /user
POST /login
GET /casos
POST /casos
GET /casos/:id
PUT /casos/:id
DELETE /casos/:id
GET /tmdb/buscar
```

Schemas:

```text
User
Caso
Detalhes
Producao
```

Segurança:

```text
Bearer JWT
```

`/user` e `/login` devem ser identificadas como públicas.

> **Referencia para esta secao**  
> **Swagger do professor:** [https://github.com/maxxdiego/17_documentacao_de_api_com_swagger](https://github.com/maxxdiego/17_documentacao_de_api_com_swagger)  
> **O que procurar:** Use o exemplo do swaggerDocs.yaml como referência de paths e schemas.  
> **OpenAPI - Data Models:** [https://swagger.io/docs/specification/v3_0/data-models/](https://swagger.io/docs/specification/v3_0/data-models/)  
> **O que procurar:** Use para organizar os schemas reutilizáveis.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 10. Insomnia

Organizar as requisições na ordem de demonstração:

```text
01 Cadastrar usuário
02 Fazer login
03 Listar casos
04 Cadastrar caso
05 Consultar caso por ID
06 Atualizar caso
07 Excluir registro de teste
08 Buscar produção no TMDB
```

Registrar no material como o token deve ser aplicado às rotas protegidas:

```text
Authorization
Bearer Token
```

> **Referencia para esta secao**  
> **Insomnia - Collections:** [https://developer.konghq.com/insomnia/collections/](https://developer.konghq.com/insomnia/collections/)  
> **O que procurar:** Use para organizar a coleção de requisições.  
> **Insomnia - Requests:** [https://developer.konghq.com/insomnia/requests/](https://developer.konghq.com/insomnia/requests/)  
> **O que procurar:** Use para criar e enviar as chamadas.  
> **Insomnia - Authentication:** [https://developer.konghq.com/insomnia/request-authentication/](https://developer.konghq.com/insomnia/request-authentication/)  
> **O que procurar:** Use para configurar Bearer Token.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 11. README

Deve conter pelo menos:

```text
Nome e objetivo do projeto
Tecnologias utilizadas
Como configurar variáveis de ambiente
Entidades
Estrutura de dados
Autenticação
Endpoints
MongoDB Atlas
TMDB
Swagger
Como acessar /api-docs
Figma
Integrantes
```

> **Referencia para esta secao**  
> **GitHub Docs - READMEs:** [https://docs.github.com/pt/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes](https://docs.github.com/pt/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)  
> **O que procurar:** Use para estruturar um README legível e navegável.  
> **Swagger do professor:** [https://github.com/maxxdiego/17_documentacao_de_api_com_swagger](https://github.com/maxxdiego/17_documentacao_de_api_com_swagger)  
> **O que procurar:** Use como exemplo de README técnico relacionado à disciplina.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 12. Entrega para o Design

Antes de o Design finalizar os fluxos, disponibilizar uma versão funcional do contrato contendo apenas o que interfere na experiência do usuário:

```text
funcionalidades disponíveis
campos relevantes para a interface
grupos de informações
ações que o usuário pode executar
fluxos que precisam ser representados
estados importantes, quando existirem
```

O Design usa esse recorte funcional para criar a experiência no Figma. Endpoints, métodos HTTP, Bearer Token, Swagger e detalhes internos de implementação permanecem na Documentação e no Backend.

> **Referencia para esta secao**  
> **04_DESIGN.md:** `04_DESIGN.md`  
> **O que procurar:** Consulte o brief de Design para saber quais informações o designer precisa receber.  
> **02_BANCO_DE_DADOS.md:** `02_BANCO_DE_DADOS.md`  
> **O que procurar:** Confirme nomes e tipos antes de repassar o contrato visual.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 13. Critério de conclusão

A documentação está finalizada quando:

```text
Swagger corresponde ao Backend real
README corresponde ao projeto real
Insomnia contém todas as rotas
campos e tipos estão sincronizados com o Banco
Design recebeu o recorte funcional necessário
/api-docs abre corretamente
```

> **Referencia para esta secao**  
> **Swagger do professor:** [https://github.com/maxxdiego/17_documentacao_de_api_com_swagger](https://github.com/maxxdiego/17_documentacao_de_api_com_swagger)  
> **O que procurar:** Confira se /api-docs apresenta o contrato final.  
> **Insomnia - Collections:** [https://developer.konghq.com/insomnia/collections/](https://developer.konghq.com/insomnia/collections/)  
> **O que procurar:** Confira se todas as requisições finais estão organizadas e testáveis.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.


---

# 14. Onde estudar para implementar

## Swagger do professor
https://github.com/maxxdiego/17_documentacao_de_api_com_swagger

Usar o README como referência para:

```text
swagger-jsdoc
swagger-ui-express
swagger-config.js
swaggerDocs.yaml
/api-docs
Bearer Auth
```

## Autenticação e status
https://github.com/haimonvieira/desenvolvimento-de-software-multiplataforma/tree/main/DSM3/DW3/dw3-api-express-mongodb/aula-05-hash-de-senha-e-variaveis-de-ambiente

## Estrutura de dados
Consultar `02_BANCO_DE_DADOS.md`.

> **Referencia para esta secao**  
> **Swagger do professor:** [https://github.com/maxxdiego/17_documentacao_de_api_com_swagger](https://github.com/maxxdiego/17_documentacao_de_api_com_swagger)  
> **O que procurar:** Referência principal do material da disciplina.  
> **OpenAPI:** [https://swagger.io/docs/specification/v3_0/paths-and-operations/](https://swagger.io/docs/specification/v3_0/paths-and-operations/)  
> **O que procurar:** Referência do padrão da especificação.  
> **Insomnia:** [https://developer.konghq.com/insomnia/collections/](https://developer.konghq.com/insomnia/collections/)  
> **O que procurar:** Referência dos testes documentados.  
> Use a referencia para entender o padrao e desenvolver a propria implementacao/solucao.
