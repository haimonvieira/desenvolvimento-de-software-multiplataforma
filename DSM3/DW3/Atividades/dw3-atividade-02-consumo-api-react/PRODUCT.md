# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primário: o professor/avaliador da disciplina DW3 (Fatec, curso DSM3), que abre o app para verificar se o consumo de API com React/Next foi implementado corretamente. O critério de sucesso dele é técnico e verificável, não comercial.

Quem usa o app na prática consulta duas bases: corretoras registradas na CVM e dados cadastrais de qualquer CNPJ na Receita. *Inferido do código e do README; não confirmado com o usuário.*

## Product Purpose

Demonstrar, como entrega de disciplina, o consumo de uma API pública em React + Next.js: listar corretoras da CVM em formato de catálogo e abrir o detalhe cadastral de uma empresa pelo CNPJ. Sucesso = a avaliação reconhece o consumo de API funcionando, com os dados exibidos de forma legível e completa.

## Positioning

Não há posicionamento de mercado — é uma entrega acadêmica. O mecanismo que a distingue é o fluxo de duas etapas: catálogo navegável (`/`) → detalhe (`/empresa/[cnpj]`), com atalho para consultar qualquer CNPJ fora do catálogo. *Derivado do código; não é uma reivindicação de produto.*

## Operating Context

- Disciplina DW3 do curso Desenvolvimento de Software Multiplataforma (Fatec).
- Roda localmente: `npm run dev`, acessível em `http://localhost:3000`.
- Sem autenticação, sem backend próprio, sem persistência: tudo vem da BrasilAPI em tempo de requisição.
- Avaliação acontece lendo o código e navegando as duas rotas.

## Capabilities and Constraints

Confirmado:

- Stack fixa: React 18 + Next.js 14 (Pages Router) + Axios + Tailwind CSS 3. Sem novas dependências de UI.
- Fontes de dados: `GET https://brasilapi.com.br/api/cvm/corretoras/v1` (listagem) e `GET https://brasilapi.com.br/api/cnpj/v1/{cnpj}` (detalhe).
- Rotas: `/` (catálogo com busca por nome ou CNPJ e carregamento progressivo de 60 em 60) e `/empresa/[cnpj]` (detalhe completo: cadastro, endereço, atividades, sócios, opções tributárias).
- Campos ausentes na API aparecem como "Não informado" — nunca preenchidos com valor inventado.

Decisão em aberto — troca de fonte de dados:

- O usuário considera substituir/complementar a BrasilAPI pelo FreeAPI (https://freeapi.app/docs), um hub com vários endpoints que poderia ser apresentado como coleção de APIs.
- Fatos relevantes: a instância pública (`api.freeapi.app`) reinicia a cada 2 horas, apagando escritas e arquivos enviados, com 1–2 min de indisponibilidade; o projeto recomenda uso local via clone/Docker ou self-host no Railway. Swagger em `api.freeapi.app`.
- Restrição declarada: exibir apenas o conteúdo que a API realmente retorna.
- Não decidido: adotar, complementar ou descartar. Nenhum código ou tela deve assumir a troca antes dessa decisão.

## Evidence on Hand

- Dados reais servidos pela BrasilAPI em tempo de execução (catálogo de corretoras e cadastro de CNPJ).
- Implementação existente em `src/pages/index.js`, `src/pages/empresa/[cnpj].js`, `src/components/HomeContent`, `src/components/DetailsContent`.
- Não existem: logo, identidade visual definida, depoimentos, cases, métricas de uso ou material de imprensa. Trabalho futuro não deve inventá-los.

## Product Principles

1. **Dado real ou nada.** Todo valor exibido vem da API; ausência vira "Não informado", nunca um preenchimento plausível.
2. **A consulta é o produto.** Buscar e ler um registro é a única tarefa; nada na tela compete com ela.
3. **Falha da API é estado de primeira classe.** Carregando, erro e vazio fazem parte do fluxo, não são exceções escondidas.
4. **Português do Brasil, vocabulário de CNPJ.** Termos, rótulos e formatação (CNPJ, CNAE, moeda, data) seguem o domínio brasileiro.
5. **Demonstração técnica legível.** O código precisa deixar visível, para quem avalia, como o consumo de API foi feito.

## Accessibility & Inclusion

Nenhum padrão formal foi exigido. A implementação atual já traz rótulos associados aos campos, `aria-invalid`/`aria-describedby` no erro de CNPJ, `role="alert"`, contagem com `aria-live`, alvos de toque de 44px e anéis de foco visíveis — trabalho futuro deve preservar esses comportamentos.
