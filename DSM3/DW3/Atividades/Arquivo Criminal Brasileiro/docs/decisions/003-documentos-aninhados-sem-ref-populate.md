# ADR 003 — Documentos aninhados, sem ref/populate

- **Status:** aceita
- **Data:** 2026-09 (contrato global v5.1)
- **Contexto:** a aula 03.1 mostra documentos aninhados (`descriptions` dentro de `Game`). O projeto estende o padrão com `detalhes` (objeto) e `producoes` (array) dentro de `Caso`.
- **Decisão:** `detalhes` e `producoes` são subdocumentos embutidos no documento `Caso` (`models/Casos.js`). Existem apenas as collections `users` e `casos`. Proibido criar collections de Pessoa, Evento, Fonte ou Produção e proibido `ref`/`populate`.
- **Consequências:** leitura de um caso traz tudo de uma vez; atualização de produção é atualização do caso inteiro. Modelo simples, sem joins.
- **O que quebra se violar:** normalizar `producoes` em collection própria muda o formato de resposta de todas as rotas de casos, quebra o contrato OpenAPI e a regra de negócio de embedding.
