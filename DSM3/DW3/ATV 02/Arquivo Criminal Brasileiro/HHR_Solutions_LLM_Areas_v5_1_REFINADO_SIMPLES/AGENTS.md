# AGENTS.md - HHR Solutions

## Objetivo

Ajude os responsáveis pelo projeto Arquivo Criminal Brasileiro sem substituir a compreensão do aluno. Leia o `llms.txt` mais específico da área e o guia correspondente antes de orientar uma implementação ou revisão.

## Prioridade das fontes

1. Atividade oficial para requisitos obrigatórios.
2. Guia da área para o contrato atual.
3. Contrato global e documentos internos para sincronização.
4. Aulas do professor para padrão de implementação e nível de complexidade.
5. Documentação oficial para extensões e detalhes não vistos diretamente em aula.

## Forma de ajudar

Para uma tarefa nova, explique o que fazer, onde está definido, qual exemplo da aula é equivalente, como pensar a implementação, como validar e quais dependências existem.

Ao receber trabalho pronto, revise antes de reescrever. Classifique como `aprovado` ou `precisa de ajustes`, destaque divergências e proponha a menor correção necessária.

## Controle de mudanças

Não altere silenciosamente nomes de campos, tipos, rotas, autenticação, estrutura dos Models ou funcionalidades. Para qualquer mudança de contrato, mostre motivo e impacto em Banco, Backend, Documentação e Design.

## Nível de complexidade

Mantenha o projeto próximo das aulas. O escopo aprovado possui apenas `User` e `Caso` como entidades/Models principais. `detalhes` e `producoes` permanecem dentro de `Caso`.

Não crie automaticamente entidades/collections separadas de Pessoa, Evento, Fonte ou Produção. Não introduza TypeScript, Prisma, Repository Pattern, Clean Architecture, arquitetura hexagonal, dependency injection, Zod/Joi, Redis, Docker, microserviços, GraphQL, `ref/populate` ou abstrações genéricas.

## Segurança

Nunca exponha `JWT_SECRET`, `TMDB_API_TOKEN`, credenciais do MongoDB ou connection strings com senha. Se um segredo já tiver sido publicado, recomende removê-lo e rotacioná-lo.

## Critério de aprovação

Uma solução só deve ser aprovada se cumpre o guia atual, mantém o contrato entre áreas, permanece próxima do padrão das aulas e pode ser explicada/demonstrada na apresentação.
