---
disciplina: DSM3/GAPS
titulo: GAPS Modulo 06   AT1 Planejamento e Gestao Agil
fonte: DSM3/GAPS/notebook-sources/GAPS-Modulo 06 - AT1 Planejamento e Gestao Agil.txt
tipo: txt
paginas: 0
extraido_em: 2026-10-24
---

# Modulo 06 - AT1 Planejamento e Gestao Agil
Fonte: https://i-davies.github.io/conteudo-fatec-2026-2/GAPS/06_AT1_Planejamento_e_Gestao_Agil/


## Pagina: (AT1): Planejamento, Decomposição e Gestão Ágil no GitHub
(06_AT1_Planejamento_e_Gestao_Agil/01_Atividade_Avaliativa)

(AT1): Planejamento, Decomposição e Gestão Ágil no GitHub

 Trabalho prático para estruturação do Product Backlog, refinamento de Épicos em fatias verticais, estimativas e governança de projeto no GitHub com entrega e apresentação individual em vídeo.

 Orientações Gerais
 Esta atividade avaliativa tem como objetivo consolidar de forma integrada os fundamentos e práticas de gestão ágil de projetos desenvolvidos na disciplina GAPS , cobrindo o ecossistema do GitHub Projects :

 Papéis Ágeis e Governança: Organização da squad, definição de papéis (PO, PM e Desenvolvedores) e taxonomia padronizada de etiquetas ( Labels ).
 Funil de Estimativas Ágeis: Aplicação de T-Shirt Sizing (`PP , `P , `M , `G , `GG / `S , `M , `L , `XL ) para a macroestimativa de Épicos e itens de longo prazo, combinada com a escala de Fibonacci (`1 , `2 , `3 , `5 , `8 ) para o microdimensionamento de Histórias de Usuário na Sprint.
 Decomposição Hierárquica e INVEST: Estruturação de Épicos e fatiamento vertical ( Vertical Slicing ) em Histórias de Usuário atômicas e testáveis.
 Qualidade e Critérios de Conclusão: Aplicação rigorosa da Definição de Preparado (DoR) e Definição de Pronto (DoD) .
 Gestão Visual e Planejamento da Sprint: Configuração de quadros Kanban, campos de prioridade, tamanho e iteração (`Sprint ), somatório numérico de Story Points, visualizações agrupadas por Épicos e alocação de tarefas na Sprint 1.

 Opções de Tema para o Projeto
 A atividade pode ser desenvolvida com base em:

 Opção A: Projeto Integrador (PI): Estruturação real do Backlog, papéis e planejamento da squad para o projeto interdisciplinar do curso.
 Opção B: Projeto Fictício de Software: Criação e estruturação completa de um novo produto de software (ex: plataforma de e-commerce de nicho, aplicativo de caronas solidárias, sistema de agendamento de consultas ou hub de voluntariado).

 Trabalho em Equipe vs. Entrega Individual

 Configuração do Ecossistema no GitHub (Equipe ou Individual): A organização do repositório, labels, quadro no GitHub Projects, cadastro de Épicos, fatiamento de Issues e estimativas podem ser realizados em grupo (pela squad do PI ou grupo de estudo) ou individualmente.
 Gravação de Vídeo e Submissão (Estritamente Individual): Cada estudante deve gravar e submeter o seu próprio vídeo explicativo demonstrando o projeto e detalhando com suas próprias palavras a estrutura ágil construída.

 Mapa Geral dos Requisitos da Atividade
 `graph TD
 subgraph Fase1 [1. Governança e Papéis]
 P1["Definição de Papéis: PO, PM e Devs"]
 P2["Repositório / Organização Pública"]
 P3["Taxonomia de Labels Padronizada"]
 end

 subgraph Fase2 [2. Macroplanejamento e Épicos]
 E1["No mínimo 2 Épicos Estruturados"]
 E2["Macroestimativa em T-Shirt Sizing (S, M, L, XL)"]
 E3["Rastreamento de Sub-issues (Tasklists)"]
 end

 subgraph Fase3 [3. Decomposição Vertical e Refinamento]
 D1["6 a 8 Histórias de Usuário (Fatias Verticais)"]
 D2["Critérios INVEST + Formato Como/Desejo/Para"]
 D3["Checklist de Definição de Pronto (DoD)"]
 D4["Microestimativa: Story Points (Fibonacci 1 a 8)"]
 end

 subgraph Fase4 [4. GitHub Projects e Visualizações]
 G1["Colunas de Fluxo Kanban (Backlog a Done)"]
 G2["Campos: Priority, Size e Story Points"]
 G3["Visão em Tabela Agrupada por Parent Issue"]
 G4["Campo Sprint com Somatório de Pontos"]
 end

 Fase1 --> Fase2
 Fase2 --> Fase3
 Fase3 --> Fase4

 Requisitos Técnicos Detalhados
 1. Definição de Papéis e Repositório

 Identificação dos Papéis da Squad: Documentar no README ou na descrição inicial quem desempenha os papéis de Product Owner (PO) , Product Manager (PM) e Desenvolvedores .
 Repositório Público: Repositório ou Organização no GitHub acessível publicamente.
 Taxonomia Padronizada de Etiquetas ( Labels ): Criar e utilizar etiquetas estruturadas por escopo e tipo, contendo no mínimo:

 Categoria
 Etiquetas Obrigatórias
 Finalidade

 Hierarquia
 `epic
 Identifica iniciativas e pacotes macro de entrega.

 Frentes Técnicas
 `backend , `frontend , `database , `ui (ou equivalentes)
 Identifica as camadas e especialidades envolvidas.

 Tipagem
 `documentation , `bug , `enhancement
 Classifica a natureza da demanda.

 Prioridade
 `priority: high , `priority: medium , `priority: low (ou campo Priority)
 Sinaliza o nível de urgência e valor de negócio.

 2. Macroplanejamento com Épicos e T-Shirt Sizing

 Mínimo de 2 Épicos Cadastrados:
 Título padronizado com prefixo `[Épico] e etiqueta `epic .
 Descrição contendo a Visão Geral da funcionalidade, o Valor de Negócio gerado e a lista de rastreamento das sub-issues vinculadas.
 Macroestimativa em Tamanhos de Camiseta ( T-Shirt Sizing ):
 Atribuir uma estimativa de alto nível para cada Épico (`M , `G / `L , `GG / `XL ) no campo `Size ou no corpo do Épico, justificando a complexidade macro antes da decomposição.

 3. Decomposição Vertical e Refinamento de Histórias (INVEST e Fibonacci)

 Mínimo de 6 a 8 Histórias de Usuário no Total (3 a 4 por Épico):
 Fatiamento Vertical ( Vertical Slicing ): Cada história deve atravessar as camadas necessárias (banco, API e tela) para entregar um incremento utilizável e testável de ponta a ponta, evitando tarefas puramente horizontais e isoladas.
 Estrutura Obrigatória no Corpo de Cada História:
 Declaração Formal: Sintaxe `Como [persona], Desejo [ação/funcionalidade], Para [benefício/valor] .
 Regras de Negócio e Critérios de Aceitação: Lista objetiva dos comportamentos esperados.
 Checklist de Definição de Pronto (DoD): Critérios técnicos verificáveis para conclusão (ex: código tipado, validações de campos, testes manuais/unitários, responsividade da interface).
 Microestimativa em Story Points (Fibonacci): Atribuição de pontos na escala `1 , `2 , `3 , `5 ou `8 . Nenhuma tarefa na iteração ativa pode ter 13 pontos ou mais (caso atinja 13+, deve ser fatiada novamente).
 Responsável ( Assignee ), Labels e Prioridade: Preenchimento completo dos metadados da Issue.

 4. Configuração do GitHub Projects e Visualizações

 Colunas de Fluxo Kanban:
 `Backlog -> `Ready (DoR) -> `In Progress -> `In Review -> `Done (DoD) .
 Campos do Quadro no GitHub Projects:
 `Story Points (Tipo: Number ) com cálculo de somatório (`Calculate -> `Sum ) habilitado nas colunas.
 `Priority (Tipo: Single select - `High , `Medium , `Low ).
 `Size (Tipo: Single select - `PP , `P , `M , `G , `GG ou `S , `M , `L , `XL ).
 `Sprint (Tipo: Iteration - Ex: `Sprint 1 , `Sprint 2 com períodos definidos).
 Duas Visualizações Obrigatórias:
 Visualização 1 (Quadro Kanban / Board): Exibição dos cards com responsáveis, labels semânticas, prioridade, Sprint e selo de Story Points.
 Visualização 2 (Tabela Hierárquica / Table): Agrupamento por `Parent issue (ou `Tracked by ), permitindo visualizar os Épicos colapsáveis e suas respectivas sub-issues aninhadas com seus pontos.
 Alocação de Tarefas na Sprint 1:
 Configuração da Sprint 1 no campo `Sprint com o período do ciclo inicial.
 Associação das histórias prioritárias à Sprint 1, com o somatório total de Story Points planejado visível no topo da visualização.

 Modelos de Referência para as Issues
 Modelo de Issue de Épico Modelo de História de Usuário (Sub-issue Fatiada)

 ` ## Visão Geral do Épico
 Implementar o módulo completo de gamificação e ranking para engajar os usuários voluntários na realização de ações sociais recorrentes.

 ## Valor de Negócio
 Aumentar a retenção de voluntários através do reconhecimento de horas doadas com insígnias e pódio mensal.

 ## Macroestimativa (T-Shirt Sizing)
 - Tamanho Macro: `G` (Large) - Requer modelagem de dados, regras de pontuação automática e componentes visuais de pódio.

 ## Sub-issues Vinculadas (Tasklists)
 - [ ] organizacao/projeto-api#10 - Modelagem e persistência de pontos e insígnias (3 pts)
 - [ ] organizacao/projeto-api#11 - Endpoint de consulta de ranking com paginação (2 pts)
 - [ ] organizacao/projeto-web#12 - Componente de pódio visual e tabela de ranking (3 pts)
 - [ ] organizacao/projeto-web#13 - Grid de badges de conquista no perfil do usuário (2 pts)

 ` ### História de Usuário
 **Como** voluntário ativo na plataforma,
 **Desejo** visualizar minha posição no ranking mensal com base nas horas doadas,
 **Para** acompanhar meu progresso e comparar minha contribuição com a comunidade.

 ### Regras de Negócio e Critérios de Aceitação
 - Exibir os 3 primeiros colocados em destaque visual (pódio com ouro, prata e bronze).
 - Exibir a lista das posições de 4 a 10 em formato de tabela responsiva.
 - Atualizar a pontuação em tempo real quando o endpoint `GET /ranking?tipo=mensal` responder.
 - Exibir mensagem amigável de estado vazio caso não haja ações registradas no mês corrente.

 ### Checklist de Definição de Pronto (DoD)
 - [ ] Componente React tipado com TypeScript ( `RankingTable.tsx` )
 - [ ] Estilização responsiva testada em dispositivos móveis e desktop
 - [ ] Tratamento de loading ( *skeleton* ) e mensagem de erro de API
 - [ ] Teste unitário de renderização ou validação funcional realizada
 - [ ] Revisão por pares efetuada

 Instruções para Gravação e Entrega
 Cada estudante deve gravar um vídeo de até 4 minutos navegando pelo ambiente do GitHub Projects e explicando a estrutura com suas próprias palavras.
 Não é obrigatório aparecer na câmera, porém a explicação em áudio com gravação de tela é mandatória.

 Itens de Submissão
 Envie no ambiente acadêmico:

 Link do Repositório / GitHub Projects Público: URL direta para a organização, repositório e quadro no GitHub.
 Link do Vídeo Individual: URL do vídeo hospedado em plataforma de compartilhamento (YouTube como "Não Listado", Google Drive com acesso público liberado para leitura, Loom ou similar).

 Atenção aos Prazos e Visibilidade

 Certifique-se de que o repositório, o GitHub Projects e o link do vídeo estejam configurados com acesso público antes de submeter.
 Commits, edições em issues, alterações no quadro e uploads de vídeo realizados após o prazo estipulado serão desconsiderados.
