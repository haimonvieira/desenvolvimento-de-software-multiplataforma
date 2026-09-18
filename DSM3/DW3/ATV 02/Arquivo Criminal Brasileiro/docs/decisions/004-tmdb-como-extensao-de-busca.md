# ADR 004 — TMDB como extensão de busca, sem entidade própria

- **Status:** aceita
- **Data:** 2026-09 (contrato global v5.1)
- **Contexto:** o projeto precisa relacionar casos a filmes/séries/documentários sem manter catálogo próprio.
- **Decisão:** `GET /tmdb/buscar` (protegida) proxia o TMDB Search Multi e normaliza cada resultado para `tmdbId, titulo, tipo, ano, sinopse, poster` (`services/tmdbService.js`). O resultado serve apenas para compor `producoes[]` no cadastro/atualização de um caso. Sem Model, sem collection, sem cache local.
- **Consequências:** dependência de API externa com token (`TMDB_API_TOKEN`); indisponibilidade do TMDB vira 500 na rota; sem token válido, a rota não funciona — mas o CRUD de casos continua operando.
- **O que quebra se violar:** persistir resultados TMDB localmente ou criar entidade de produção introduz estado que o contrato não prevê e diverge do OpenAPI.
