# ADR 005 — Escopo travado em duas entidades, complexidade nível-aula

- **Status:** aceita
- **Data:** 2026-09 (contrato global v5.1)
- **Contexto:** projeto acadêmico avaliado por demonstração (CRUD + Atlas + TMDB + Swagger + Insomnia + Figma em 5–7 min). A tentação natural de um agente é "profissionalizar" a base.
- **Decisão:** escopo fixo em `User` e `Caso`; arquitetura `Route → Controller → Service → Model` sem camadas extras; complexidade e estilo espelhando as aulas do professor. Lista explícita de proibições: TypeScript, Prisma, Repository Pattern, Clean/hexagonal, DI, Zod/Joi, Redis, Docker, microserviços, GraphQL.
- **Consequências:** soluções devem ser explicáveis em apresentação e comparáveis com o código da aula. Qualquer item da lista de proibições exige avaliação inter-áreas antes de entrar (controle de mudança do contrato global).
- **O que quebra se violar:** cada abstração adicionada afasta o código do padrão avaliado e cria divergência com a Documentação e com os guias das outras áreas.
