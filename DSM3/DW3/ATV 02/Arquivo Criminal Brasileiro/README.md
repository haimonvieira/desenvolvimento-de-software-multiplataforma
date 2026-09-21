# Arquivo Criminal Brasileiro — API

API REST do projeto acadêmico **Arquivo Criminal Brasileiro** (FATEC DSM3/DW3, ATV02 — equipe HHR Solutions): organiza informações públicas sobre casos criminais brasileiros e os relaciona a filmes, séries e documentários via TMDB.

Stack: Node.js + Express + Mongoose + MongoDB Atlas. Autenticação JWT (Bearer, 48h) com hash de senha Argon2id.

## Setup

```bash
npm install
npm start              # API em http://localhost:4000
```

Crie um `.env` na raiz (gitignored — não existe `.env.example`) com as variáveis listadas abaixo.

**Requisito de versão:** Node ≥ 20.19.0 (imposto por `mongoose`/`mongodb`; nada no repo fixa isso).

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `PORT` | Porta da API (padrão `4000`) |
| `JWT_SECRET` | Segredo de assinatura/verificação do JWT |
| `TMDB_API_TOKEN` | Chave do TMDB — aceita API Key v3 (32 hex) ou Read Access Token v4 (`eyJ...`) |
| `MONGODB_USERNAME` / `MONGODB_PASSWORD` | Credenciais do Atlas |
| `MONGODB_CLUSTER` | Host do cluster Atlas |
| `MONGODB_DATABASE` | Nome do banco |
| `MONGODB_URI` | **Opcional** — se definida, conecta nessa URI ignorando as de Atlas (modo de teste local) |

Nunca publique valores reais. Se um segredo vazar, remova e rotacione.

**Banco local (só para testes):** a atividade exige o banco no Atlas. Para destravar testes locais, descomente no `.env`:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/arquivo_criminal_brasileiro
```

O log de conexão indica o alvo: `Conectado ao MongoDB com sucesso! (LOCAL)` ou `(Atlas)`. **Comente de volta antes da apresentação.**

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
| `GET` | `/casos/:id` | Consulta um caso | `200` `{caso}` | `400` (id inválido), `404`, `401`, `500` |
| `PUT` | `/casos/:id` | Atualiza um caso | `200` | `400` (id inválido), `401`, `500` |
| `DELETE` | `/casos/:id` | Exclui um caso | `204` (sem corpo) | `400` (id inválido), `401`, `500` |
| `GET` | `/tmdb/buscar?query=texto` | Busca produções no TMDB | `200` `{producoes: [...]}` | `400` (query ausente), `401`, `500` |

### Documentação

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api-docs` | Swagger UI (contrato em `docs/swaggerDocs.yaml`) |

### Body de `Caso`

```json
{
  "titulo": "Caso Tremembé",
  "resumo": "Fuga no complexo de Tremembé em São Paulo.",
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
      "tmdbId": 532321,
      "titulo": "Blindados",
      "tipo": "documentário",
      "ano": 2023,
      "sinopse": "Série documental sobre fugas.",
      "poster": "https://image.tmdb.org/t/p/w500/exemplo.jpg"
    }
  ]
}
```

`detalhes` (objeto) e `producoes` (array) são **documentos aninhados** dentro de `Caso` — não há `ref`/`populate` nem collections separadas. `tipo` aceita apenas `filme`, `série` ou `documentário`. O `_id` é gerado pelo MongoDB e **não** vai no body de POST/PUT.

## Uso

- Swagger UI: `http://localhost:4000/api-docs` (contrato em `docs/swaggerDocs.yaml`)
- Testes manuais: coleção Insomnia **"Crimes"** (pastas `Usuários` e `Casos`, 8 requests) — as URLs e o token usam as variáveis de ambiente da coleção (`base_url`, `token`, `caseId`)
- Fluxo: `01 Cadastrar usuário` → `02 Fazer login` (copie o token) → cole o token → `03/04` (copie um `_id` para `caseId`) → demais requests

## Estrutura

```
index.js                  entrada: parsers, mounts, Swagger, listen
routes/                   1 router por domínio (user, caso, tmdb)
controllers/              HTTP: leem req, validam, chamam service
services/                 Mongoose (classes, export singleton)
models/                   Users.js, Casos.js (schemas)
middleware/Auth.js        JWT Bearer -> req.loggedUser
config/db-connection.js   conexão Atlas (ou MONGODB_URI)
docs/                     arquitetura, domínio, operações, ADRs, swagger
```

Arquitetura fixa: `Route → Controller → Service → Model → MongoDB`. Para agentes de IA, leia `AGENTS.md` primeiro — ele é a porta de entrada (mapa de leitura, regras, comandos, estado atual).
