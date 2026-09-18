# Operações

## Rodar

```bash
npm install
npm start        # nodemon index.js — API na porta 4000 (ou $PORT)
```

Swagger UI: `http://localhost:4000/api-docs`. Testes manuais: coleção Insomnia "Arquivo Criminal Brasileiro" (pastas `Usuários` e `Casos`, 8 requests).

## Variáveis de ambiente (`.env`, gitignored)

| Variável | Uso |
|---|---|
| `PORT` | Porta da API (padrão 4000) |
| `JWT_SECRET` | Segredo de assinatura/verificação do JWT |
| `TMDB_API_TOKEN` | Token Bearer da API do TMDB |
| `MONGODB_USERNAME` / `MONGODB_PASSWORD` | Credenciais do Atlas |

Nunca publique valores reais. Se um segredo vazar, remova e rotacione.

## Depurar

Percorra a cadeia `Route → Controller → Service → Model → Atlas` e procure a menor correção (regra da área de Backend).

Sintomas conhecidos:

| Sintoma | Causa provável |
|---|---|
| `Erro ao conectar ao mongoDB: bad auth` no log | Credenciais do Atlas ausentes/erradas no `.env`. A API continua no ar por desenho (`config/db-connection.js` não propaga o erro) — rotas que tocam o banco vão expirar (buffering timeout) até a conexão funcionar |
| `401 Token nao informado` | Falta o header `Authorization: Bearer TOKEN` |
| `401 Token inválido` | Token expirado (48h) ou assinado com outro `JWT_SECRET` |
| `400` em rota com `:id` | ID não é um ObjectId válido (validação em `casoController.js`) |
| `404` em `GET /casos/:id` | ID válido, mas documento inexistente |
| Login retorna 404 | Usuário não existe (ou banco inacessível — ver primeiro sintoma) |

## Dependências externas

- **MongoDB Atlas** (persistência) — sem ele, nada que toque o banco funciona; o resto da API (boot, `/api-docs`, validação de auth) continua operando.
- **TMDB Search Multi** (busca de produções) — requer `TMDB_API_TOKEN`; falha externa vira 500 na rota `/tmdb/buscar`.
