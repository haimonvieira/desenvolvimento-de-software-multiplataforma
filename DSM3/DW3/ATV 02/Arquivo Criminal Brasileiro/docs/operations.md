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
| `TMDB_API_TOKEN` | Chave do TMDB — aceita API Key v3 (32 hex) ou Read Access Token v4 (`eyJ...`) |
| `MONGODB_USERNAME` / `MONGODB_PASSWORD` | Credenciais do Atlas |
| `MONGODB_CLUSTER` | Host do cluster Atlas |
| `MONGODB_DATABASE` | Nome do banco |
| `MONGODB_URI` | **Opcional.** Se definida, ignora as quatro acima e conecta nessa URI (modo de teste local) |

Nunca publique valores reais. Se um segredo vazar, remova e rotacione.

## Banco local (apenas para testes)

A atividade exige o banco **hospedado no MongoDB Atlas** — é requisito avaliado na apresentação. O `MONGODB_URI` existe só para destravar testes quando o Atlas estiver indisponível (ex.: IP não liberado no cluster):

```bash
# no .env — descomente para testar contra o MongoDB da máquina
MONGODB_URI=mongodb://127.0.0.1:27017/arquivo_criminal_brasileiro
```

O log de conexão indica qual banco está em uso: `Conectado ao MongoDB com sucesso! (LOCAL)` ou `(Atlas)`. **Comente a linha antes de entregar/apresentar.**

## Depurar

Percorra a cadeia `Route → Controller → Service → Model → Atlas` e procure a menor correção (regra da área de Backend).

Sintomas conhecidos:

| Sintoma | Causa provável |
|---|---|
| `Erro ao conectar com o MongoDB.` (seguido de `MongooseServerSelectionError`) no log | Credenciais do Atlas ausentes/erradas ou **IP da máquina não liberado no cluster**. A API continua no ar (`config/db-connection.js` trata a falha) — rotas que tocam o banco vão expirar até a conexão funcionar |
| `401 Token nao informado` | Falta o header `Authorization: Bearer TOKEN` |
| `401 Token inválido` | Token expirado (48h) ou assinado com outro `JWT_SECRET` |
| `400` em rota com `:id` | ID não é um ObjectId válido (validação em `casoController.js`) |
| `404` em `GET /casos/:id` | ID válido, mas documento inexistente |
| Login retorna 404 | Usuário não existe (ou banco inacessível — ver primeiro sintoma) |

## Dependências externas

- **MongoDB Atlas** (persistência) — sem ele, nada que toque o banco funciona; o resto da API (boot, `/api-docs`, validação de auth) continua operando.
- **TMDB Search Multi** (busca de produções) — requer `TMDB_API_TOKEN`; falha externa vira 500 na rota `/tmdb/buscar`.
