# Arquivo Criminal Brasileiro — API

API REST do projeto acadêmico **Arquivo Criminal Brasileiro** (FATEC DSM3/DW3, ATV02 — equipe HHR Solutions): organiza informações públicas sobre casos criminais brasileiros e os relaciona a filmes, séries e documentários via TMDB.

Stack: Node.js + Express + Mongoose + MongoDB Atlas. Autenticação JWT (Bearer) com hash de senha Argon2id.

## Setup

```bash
npm install
cp .env.example .env   # se existir; senão crie com as variáveis abaixo
npm start              # API em http://localhost:4000
```

## Variáveis de ambiente

Crie um `.env` na raiz (gitignored) com:

```
PORT=4000
JWT_SECRET=sua-chave-secreta
TMDB_API_TOKEN=seu-token-do-tmdb
MONGODB_USERNAME=usuario-do-atlas
MONGODB_PASSWORD=senha-do-atlas
```

## Uso

- Swagger UI: `http://localhost:4000/api-docs` (contrato em `docs/swaggerDocs.yaml`)
- Testes manuais: coleção Insomnia **"Arquivo Criminal Brasileiro"** (pastas `Usuários` e `Casos`)
- Fluxo: `POST /user` → `POST /login` (recebe o JWT) → rotas de `/casos` e `/tmdb/buscar` com `Authorization: Bearer TOKEN`

## Para agentes de IA

Leia `AGENTS.md` primeiro — ele é a porta de entrada (mapa de leitura, regras, comandos, estado atual).
