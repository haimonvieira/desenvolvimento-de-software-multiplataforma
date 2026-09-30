# Arquivo Criminal Brasileiro — API

API REST do projeto acadêmico **Arquivo Criminal Brasileiro** (FATEC DSM3/DW3, ATV02 — equipe HHR Solutions): organiza informações públicas sobre casos criminais brasileiros, com os detalhes de cada caso e as produções audiovisuais (filmes, séries e documentários) a ele relacionadas.

Stack: Node.js + Express + Mongoose + MongoDB Atlas. Autenticação JWT (Bearer, 48h) com hash de senha Argon2id.

## Setup

```bash
npm install
npm start              # API em http://localhost:4000
```

Crie um `.env` a partir do modelo:

```bash
cp .env.example .env   # depois preencha com seus valores reais
```

O `.env` é gitignored (nunca vai para o repositório); o `.env.example` é o modelo commitado com as variáveis que o código lê.

**Requisito de versão:** Node ≥ 20.19.0 (imposto por `mongoose`/`mongodb`; nada no repo fixa isso).

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `PORT` | Porta da API (padrão `4000`) |
| `JWT_SECRET` | Segredo de assinatura/verificação do JWT |
| `MONGODB_USERNAME` / `MONGODB_PASSWORD` | Credenciais do usuário do Atlas |
| `MONGODB_CLUSTER` | Host do cluster Atlas |
| `MONGODB_DATABASE` | Nome do banco |

Nunca publique valores reais. Se um segredo vazar, remova e rotacione.

O banco é hospedado no **MongoDB Atlas** (requisito da atividade). Se a API iniciar mas as rotas de banco falharem, verifique as credenciais e se o IP da máquina está liberado no *Network Access* do cluster.

## Rotas

### Públicas

| Método | Rota | Descrição | Entrada (body) | Sucesso | Erros |
|---|---|---|---|---|---|
| `POST` | `/user` | Cadastra usuário (senha recebe hash Argon2id) | `email`, `password` | `201` | `500` |
| `POST` | `/login` | Autentica e retorna JWT (48h) | `email`, `password` | `200` `{token}` | `400`, `401`, `404`, `500` |

### Protegidas (exigem `Authorization: Bearer TOKEN`)

| Método | Rota | Descrição | Sucesso | Erros |
|---|---|---|---|---|
| `GET` | `/casos` | Lista todos os casos | `200` `{casos: [...]}` | `401`, `500` |
| `POST` | `/casos` | Cadastra caso | `201` | `401`, `500` |
| `GET` | `/casos/:id` | Consulta um caso | `200` `{caso}` | `400` (id inválido), `401`, `404`, `500` |
| `PUT` | `/casos/:id` | Atualiza um caso | `200` | `400` (id inválido), `401`, `500` |
| `DELETE` | `/casos/:id` | Exclui um caso | `204` (sem corpo) | `400` (id inválido), `401`, `500` |

### Documentação

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api-docs` | Swagger UI renderizando `docs/swaggerDocs.yaml` — contrato completo com schemas e testável pelo botão **Authorize** |

### Body de `Caso`

```json
{
  "caso": "Caso Tremembé",
  "descricao": "Fuga no complexo de Tremembé em São Paulo.",
  "categorias": ["Fuga", "Repercussão nacional"],
  "detalhes": {
    "cidade": "São Paulo",
    "estado": "SP",
    "anoInicio": 2019,
    "anoFim": 2020,
    "situacaoJudicial": "Investigação em andamento"
  },
  "producoes": [
    {
      "titulo": "Blindados",
      "tipo": "documentário",
      "ano": 2023,
      "sinopse": "Série documental sobre fugas e o sistema prisional.",
      "poster": "https://exemplo.com/poster.jpg"
    }
  ]
}
```

`detalhes` (objeto) e `producoes` (array) são **documentos aninhados** dentro de `Caso` — não há `ref`/`populate` nem collections separadas. Regras dos campos:

- `tipo` aceita apenas `filme`, `série` ou `documentário`
- `detalhes.estado` é gravado em maiúsculas e limitado a 2 caracteres (UF)
- `anoFim`, `ano`, `sinopse` e `poster` são opcionais
- `_id` é gerado pelo MongoDB e **não** vai no body de POST/PUT

## Uso

### Swagger UI — `http://localhost:4000/api-docs`

O contrato completo (7 rotas, schemas, status codes) está em `docs/swaggerDocs.yaml` e é renderizado pelo Swagger UI. Para testar por lá:

1. `POST /login` → **Try it out** → informe `email`/`password` → **Execute**
2. Copie o valor de `token` da resposta (só o `eyJ...`, sem aspas)
3. Botão **Authorize** (candado, no topo) → cole o token → **Authorize**
4. Pronto: qualquer **Try it out** em rota protegida envia `Authorization: Bearer` automaticamente

O token expira em 48h — `401 Token inválido` depois disso é só refazer o login.

### Insomnia

Coleção **"Crimes"** (pastas `Usuários` e `Casos`) — URLs e auth usam as variáveis de ambiente da coleção (`base_url`, `token`, `caseId`), definidas em *Manage Environments*.

Fluxo: `01 Cadastrar usuário` → `02 Fazer login` (copie o token para a variável `token`) → `03/04` (copie um `_id` para `caseId`) → demais requests funcionam direto.

- Os requests `05`, `06` e `07` usam `{{ caseId }}`; com a variável vazia, a URL vira `/casos/` e o Express responde 404 HTML (`cannot PUT /casos/`)
- O request `08 Buscar produção no TMDB` ficou **obsoleto** (a rota não existe mais) e deve ser removido da coleção

### Fluxo geral

```
01 Cadastrar usuário → 02 Fazer login (token) → 03/04 (caseId) → 05..07
```

## Estrutura

```
index.js                  entrada: parsers, mounts, Swagger, listen
routes/                   1 router por domínio (user, caso)
controllers/              HTTP: leem req, validam, chamam service
services/                 Mongoose (classes, export singleton)
models/                   Users.js, Casos.js (schemas)
middleware/Auth.js        JWT Bearer -> req.loggedUser
config/db-connection.js   conexão com o MongoDB Atlas
config/swagger-config.js  metadados OpenAPI, securitySchemes, globs do contrato
docs/swaggerDocs.yaml     fonte da verdade do contrato HTTP (7 rotas, 4 schemas)
docs/                     arquitetura, domínio, operações, ADRs
```

Arquitetura fixa: `Route → Controller → Service → Model → MongoDB`. Para agentes de IA, leia `AGENTS.md` primeiro — ele é a porta de entrada (mapa de leitura, regras, comandos, estado atual).
