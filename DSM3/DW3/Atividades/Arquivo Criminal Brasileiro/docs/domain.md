# Domínio

Entidades e regras de negócio da API. O contrato HTTP (endpoints, schemas, status) está em `docs/swaggerDocs.yaml` — aqui vai o que o OpenAPI não expressa: significado, invariantes e ciclo de vida.

## Entidades

- **User**: `email`, `password` (armazena o hash Argon2id, nunca a senha em claro). `_id` gerado pelo MongoDB.
- **Caso**: `titulo`, `resumo`, `categorias` (array de textos, ex. `Fuga`, `Repercussão nacional`), `detalhes` (documento aninhado), `producoes` (array de documentos aninhados).
- **Detalhes** (aninhado em Caso): `cidade`, `estado` (UF), `anoInicio`, `anoFim`, `situacaoJudicial` (texto simples com a situação judicial geral do caso).
- **Producao** (item de `producoes[]`): `tmdbId`, `titulo`, `tipo` (`filme`, `série` ou `documentário`), `ano`, `sinopse`, `poster` (URL completa da imagem).

## Invariantes (não quebrar)

1. `_id` nunca é enviado pelo cliente em POST ou PUT — o MongoDB gera.
2. `detalhes` e `producoes` vivem **dentro** do documento `Caso`. Proibido extrair para collections próprias ou usar `ref/populate`.
3. Senha só persiste como hash Argon2id; comparação sempre via `argon2.verify`.
4. Rotas `/casos` e `/tmdb/buscar` exigem `Authorization: Bearer TOKEN` válido; `/user` e `/login` são públicas.
5. `tipo` de produção só admite `filme`, `série` ou `documentário`. O TMDB retorna `movie`/`tv` em `media_type`; `services/tmdbService.js` normaliza para `filme`/`série` e usa `genre_ids` contendo 99 (Documentary) para identificar `documentário` — séries documentais permanecem `série`, pois o contrato não prevê esse valor.
6. A busca TMDB é apenas auxiliar de preenchimento — nunca cria entidade nem persiste nada.

## Ciclo de vida

Cadastro de usuário → login (recebe JWT de 48h) → operações em casos com o token → opcionalmente buscar produções no TMDB para compor `producoes[]` antes de cadastrar/atualizar um caso.

## Pontos a confirmar (não documentados como regra)

- **E-mail duplicado**: `userService.Create` não verifica se o e-mail já existe antes de salvar. Comportamento atual: permite duplicatas. Decidir se isso vira validação (409) ou permanece como está — precisa de confirmação do grupo.
- **`anoFim`**: opcional "quando fizer sentido" segundo o contrato; hoje o schema não impõe presença nem relação com `anoInicio`.
- **`poster`**: hoje é URL completa (`https://image.tmdb.org/...`); não há regra sobre o que fazer se o TMDB não retornar imagem (o service grava `null`).
