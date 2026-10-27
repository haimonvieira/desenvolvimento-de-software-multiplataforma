---
disciplina: DSM3/GAPS
titulo: GAPS Modulo 05   Atividades e Cronogramas
fonte: DSM3/GAPS/notebook-sources/GAPS-Modulo 05 - Atividades e Cronogramas.txt
tipo: txt
paginas: 0
extraido_em: 2026-10-24
---

# Modulo 05 - Atividades e Cronogramas
Fonte: https://i-davies.github.io/conteudo-fatec-2026-2/GAPS/05_Atividades_e_Cronogramas/


## Pagina: Atividades, Cronogramas e Estimativas no Desenvolvimento Ágil
(05_Atividades_e_Cronogramas/01_Atividades_Cronogramas_e_Estimativas)

Atividades, Cronogramas e Estimativas no Desenvolvimento Ágil

 Como o modelo ágil substitui cronogramas fixos e gráficos de Gantt por estimativas relativas, Story Points, Fibonacci e métricas de fluxo empíricas.

 A Ilusão do Cronograma Rígido: Por que Gráficos de Gantt Falham em Software
 No gerenciamento tradicional de projetos de engenharia civil ou manufatura, o Gráfico de Gantt é amplamente utilizado para traçar um cronograma linear com tarefas encadeadas por dependências rígidas (fim-início).
 Em projetos de construção física, esse modelo funciona porque a planta do edifício é conhecida previamente, os materiais possuem comportamento previsível e a tarefa de assentar tijolos já foi executada milhões de vezes com pouca variação.
 No desenvolvimento de software, no entanto, a construção de cada sistema é um processo intelectual, criativo e único. A tentativa de criar cronogramas longos e detalhados gera a chamada ilusão de precisão :
 `flowchart LR
 subgraph MP["Modelo Preditivo (Gráfico de Gantt)"]
 direction TB
 G1["Cronograma Linear de Longo Prazo"] --> G2["Requisito Inicial Impreciso"]
 G2 --> G3["Atraso na Primeira Atividade"]
 G3 --> G4["Efeito Dominó: Todas as Atividades Atrasam"]
 G4 --> G5["Replanejamento Constante e Desgaste"]
 end

 subgraph MA["Modelo Ágil (Fluxo Empírico)"]
 direction TB
 A1["Iterações Curtas (Sprints)"] --> A2["Estimativa Relativa do Ciclo"]
 A2 --> A3["Software Funcional Entregue"]
 A3 --> A4["Inspeção da Velocidade Real"]
 A4 --> A5["Previsão Atualizada com Dados Reais"]
 end

 MP ~~~ MA

 O Efeito Dominó das Dependências em Cascata
 Quando um cronograma preditivo em software prevê que a fase de banco de dados durará exatamente 12 dias e a implementação de APIs levará 20 dias:

 Qualquer bloqueio técnico imprevisto (como uma biblioteca incompatível ou uma mudança de regra tributária) atrasa a etapa em andamento.
 Como as etapas seguintes dependem do término da anterior, todo o cronograma em cascata é quebrado.
 A equipe gasta mais tempo atualizando barras no gráfico de Gantt e justificando desvios do que programando e entregando valor.

 Dimensão
 Gráfico de Gantt Tradicional
 Planejamento Ágil e Adaptativo

 Premissa Central
 O futuro é previsível se analisado com detalhes suficientes.
 O futuro é incerto; software é construído por experimentação e aprendizado contínuo.

 Unidade de Medida
 Horas e datas de calendário fixas por tarefa.
 Esforço relativo (Story Points) e vazão de entregas por ciclo (Throughput).

 Impacto de Mudanças
 Gera replanejamento traumático e sensação de falha.
 Incorporado naturalmente no início da próxima iteração.

 Indicador de Sucesso
 Cumprimento exato do cronograma original no papel.
 Software funcionando em produção gerando valor real para o usuário.

 Estimativa Absoluta vs Estimativa Relativa
 Uma das maiores armadilhas no planejamento de software é tentar estimar tarefas diretamente em horas de relógio (estimativa absoluta).
 Os Problemas da Estimativa em Horas
 Estimar tarefas intelectuais em horas ignora aspectos fundamentais do comportamento humano e da engenharia:

 Diferenças de Habilidade e Experiência: Uma tarefa que leva 3 horas para um desenvolvedor sênior pode levar 16 horas para um desenvolvedor iniciante. Se a tarefa for estimada em 5 horas no cronograma, ela estará errada para ambos.
 Viés de Otimismo: Desenvolvedores tendem a estimar o tempo ideal de desenvolvimento, desconsiderando interrupções, reuniões, tempo de configuração de ambiente, testes de integração e depuração de bugs.
 Efeito de Ancoragem ( Anchoring Effect ): Quando um líder técnico afirma em voz alta "acho que isso leva 4 horas", todos os demais integrantes são influenciados psicologicamente a estimar valores próximos, suprimindo preocupações técnicas legítimas.
 Lei de Hofstadter: "Tudo leva mais tempo do que você espera, mesmo quando você leva em consideração a Lei de Hofstadter."

 O Conceito de Estimativa Relativa
 O cérebro humano é pouco preciso para estimar grandezas absolutas (como dizer com precisão o peso exato de um objeto em gramas), mas é excelente para comparações relativas (dizer se um objeto é o dobro ou o triplo mais pesado que outro).
 `flowchart LR
 subgraph EA["Estimativa Absoluta (Falha)"]
 direction TB
 A1["Esta tela leva exatamente 14 horas"] --> A2["Ignora imprevistos e experiência individual"]
 end

 subgraph ER["Estimativa Relativa (Eficiente)"]
 direction TB
 R1["Cadastrar usuário (Tamanho 2)"] -.->|4x mais complexo e incerto| R2["Checkout com antifraude (Tamanho 8)"]
 end

 EA ~~~ ER

 Na estimativa relativa, a equipe não debate quantas horas de relógio uma tarefa vai consumir. O time compara a dificuldade de uma nova história com tarefas já conhecidas e executadas anteriormente pelo próprio grupo.

 Story Points e os Três Pilares da Estimativa
 O Story Point é uma unidade abstrata de medida utilizada pelas equipes ágeis para expressar o esforço total necessário para transformar uma História de Usuário ou Issue em um incremento de software pronto.
 A pontuação de uma história não representa apenas o tempo digitando código. Ela é o resultado da combinação de três pilares:
 `graph TD
 E["Story Points (Esforço Total)"] --> C["1. Complexidade Técnica"]
 E --> V["2. Volume de Trabalho"]
 E --> I["3. Incerteza e Risco"]

 C --- C1["Arquitetura, integrações e algoritmos"]
 V --- V1["Quantidade de telas, rotas e componentes"]
 I --- I1["Falta de clareza nas regras ou tecnologia nova"]

 Complexidade Técnica: Qual é a dificuldade algorítmica ou arquitetural? Envolve chamadas a múltiplos microsserviços, criptografia, concorrência ou regras de negócio intrincadas?
 Volume de Trabalho: Quanto código precisa ser escrito e testado? Mesmo que uma tarefa seja simples (como criar 10 telas com o mesmo formulário repetitivo), o volume físico de trabalho eleva a pontuação.
 Incerteza e Risco: A tecnologia utilizada é nova para a equipe? A documentação da API externa é estável? Quanto maior o desconhecimento, maior deve ser a margem de pontuação.

 A Sequência de Fibonacci Modificada
 Para atribuir Story Points, as equipes utilizam uma escala baseada na Sequência de Fibonacci :
 \[\{1, 2, 3, 5, 8, 13, 21, 34, 55, 89\}\]
 Por que Não Usar uma Escala Linear (1, 2, 3, 4, 5, 6, 7...)?
 Quando as opções são muito próximas, a equipe perde tempo discutindo detalhes irrelevantes (como debater se uma tarefa vale 6 ou 7 pontos).
 A sequência de Fibonacci aplica o princípio psicofísico da Lei de Weber-Fechner : a percepção humana de diferença entre dois estímulos é proporcional à magnitude do estímulo.

 Entre uma tarefa de peso 1 e outra de peso 2 , a diferença é o dobro (100% de aumento). É fácil perceber a diferença.
 Entre uma tarefa de peso 20 e outra de peso 21 , a diferença de 5% é imperceptível para o cérebro humano.
 Por isso, conforme os números crescem, os saltos aumentam: \(1 \rightarrow 2 \rightarrow 3 \rightarrow 5 \rightarrow 8 \rightarrow 13 \rightarrow 21\) .

 Pontuação (Story Points)
 Significado Prático no Contexto da Squad
 Ação Recomendada

 1
 Tarefa trivial, sem incertezas e com esforço mínimo (ex: alterar texto de um botão ou ajustar um campo no formulário).
 Pronta para desenvolvimento imediato.

 2 a 3
 Funcionalidade simples e bem compreendida (ex: endpoint CRUD básico com validação padrão).
 Tamanho ideal para desenvolvimento na Sprint.

 5
 Tarefa de complexidade média, envolvendo regras de negócio claras e integração entre camadas (ex: tela de busca com filtros e paginação).
 Tamanho saudável para a Sprint.

 8
 Tarefa complexa no limite da capacidade de uma única pessoa na Sprint (ex: autenticação completa com JWT, recuperação de senha e refresh token).
 Recomenda-se fatiar se houver incertezas.

 13 a 21
 Alerta de Épico / Tarefa Gigante: Incerteza elevada, dependências externas ou volume excessivo de código (ex: "Fazer todo o módulo de relatórios financeiros").
 Obrigatório fatiar em Issues menores antes de iniciar o ciclo.

 Técnicas de Estimativa Ágil
 Planning Poker (Pôquer do Planejamento)
 O Planning Poker é uma técnica colaborativa e baseada em consenso para estimar o esforço de itens do Backlog, eliminando influências e viés de autoridade.
 `sequenceDiagram
 autonumber
 actor PO as Product Owner
 actor Devs as Time de Desenvolvimento
 PO->>Devs: Apresenta a História de Usuário e Critérios de Aceitação
 Devs->>PO: Esclarecem dúvidas de negócio e regras técnicas
 Note over Devs: Cada dev escolhe sua carta em segredo (sem revelar)
 Devs->>Devs: Todos revelam as cartas simultaneamente
 alt Consenso nos Votos
 Devs->>PO: Registra a pontuação na Issue
 else Divergência de Votos
 Note over Devs: O menor voto e o maior voto explicam seus motivos
 Devs->>Devs: Realizam nova rodada de votação rápida
 end

 Regras de Ouro do Planning Poker

 Votação Secreta e Revelação Simultânea: Nenhum membro pode falar sua pontuação antes da contagem ("1, 2, 3 e já!"). Isso impede que a opinião do desenvolvedor mais experiente influencie os demais.
 Ouvir os Extremos: Quem votou no menor valor explica por que achou tão simples; quem votou no maior valor alerta sobre riscos técnicos ou regras ocultas que os outros não enxergaram.
 Convergência Rápida: Após um breve alinhamento, uma nova rodada é realizada. O objetivo não é a precisão matemática perfeita, mas o alinhamento de entendimento entre todos os membros.

 T-Shirt Sizing (Tamanhos de Camiseta)
 Ideal para refinamentos de alto nível de Épicos e visões de longo prazo:

 PP (Extra Small): Pequenos ajustes de interface ou correção pontual.
 P (Small): Funcionalidade isolada e simples.
 M (Medium): Funcionalidade padrão com integração de backend e frontend.
 G (Large): Grande módulo que requer decomposição técnica.
 GG (Extra Large): Épico ou iniciativa inteira que precisa ser dividida em múltiplos pacotes de entrega.

 Previsibilidade sem Gantt: Velocidade e Métricas de Fluxo
 Como uma equipe ágil consegue prever entregas para os clientes e stakeholders sem um cronograma de Gantt rígido? Através da Velocidade da Squad ( Velocity ) e métricas empíricas de fluxo.
 Velocidade da Squad ( Velocity )
 A Velocidade é a soma de todos os Story Points correspondentes às Issues totalmente concluídas (que atenderam 100% da Definição de Pronto - DoD) ao final de uma Sprint.
 \[\text{Velocidade da Sprint} = \sum \text{Story Points das Issues em 'Done'}\]

 Importante: Tarefas Incompletas Não Contam Pontos
 Se uma Issue de 8 pontos estiver 90% pronta no último dia da Sprint, a pontuação contabilizada para a velocidade é zero . No Ágil, o valor só existe quando a entrega está concluída e utilizável. A pontuação será creditada no ciclo em que a tarefa for de fato finalizada.

 Após alguns ciclos, a squad estabelece sua velocidade média histórica (exemplo: 24 pontos por Sprint). A partir desse dado concreto, a previsão de entregas torna-se matemática e realista:
 \[\text{Sprints Necessárias} = \frac{\text{Total de Story Points do Backlog}}{\text{Velocidade Média da Squad}}\]
 O Gráfico Burndown da Sprint
 `xychart-beta
 title "Burndown Chart da Sprint (10 Dias / Meta: 30 Story Points)"
 x-axis ["Dia 1", "Dia 2", "Dia 3", "Dia 4", "Dia 5", "Dia 6", "Dia 7", "Dia 8", "Dia 9", "Dia 10"]
 y-axis "Story Points Restantes" 0 --> 35
 line [30, 27, 24, 21, 18, 15, 12, 9, 6, 0]
 line [30, 30, 25, 25, 17, 17, 12, 7, 2, 0]

 Dia da Sprint
 Pontos Restantes (Ideal)
 Pontos Restantes (Real)
 O que aconteceu na Squad

 Dia 1
 30 pts
 30 pts
 Início da Sprint. Tarefas puxadas para In Progress .

 Dia 2
 27 pts
 30 pts
 Desenvolvimento em andamento, nenhum PR mesclado ainda.

 Dia 3
 24 pts
 25 pts
 PR de autenticação aprovado e Issue de 5 pts movida para Done .

 Dia 4
 21 pts
 25 pts
 Revisão de código e testes em andamento.

 Dia 5
 18 pts
 17 pts
 Duas Issues de Front (8 pts) concluídas antes da metade do ciclo.

 Dia 6
 15 pts
 17 pts
 Ajuste de integração de API e refatoração de testes.

 Dia 7
 12 pts
 12 pts
 PR de filtros de busca mesclado (5 pts concluídos).

 Dia 8
 9 pts
 7 pts
 Issue de listagem e paginação concluída (5 pts).

 Dia 9
 6 pts
 2 pts
 Ajustes finais e testes de regressão (5 pts).

 Dia 10
 0 pts
 0 pts
 Última Issue de documentação finalizada. Meta atingida (100% DoD).

 Linha Ideal (Cinza / Guia Linear): Representa a queima uniforme perfeita de pontos dia a dia ( \(-3\text{ pts/dia}\) ).
 Linha Real (Azul / Evolução Efetiva): Representa a quantidade real de trabalho pendente após o fechamento de Pull Requests. Em projetos de software reais, ela avança em formato de degraus , já que os pontos só são queimados quando a Issue é totalmente concluída.
 Linha Real acima da Ideal: Indica acúmulo de bloqueios técnicos ou subestimação de complexidade, exigindo negociação de escopo com o PO.
 Linha Real abaixo da Ideal: Indica que a squad está entregando com velocidade superior à média e pode adiantar itens prioritários do Product Backlog.

 O Cone da Incerteza
 No início de qualquer projeto de software, o nível de incerteza sobre o tempo total de desenvolvimento pode variar expressivamente.
 À medida que o software é construído, testado e colocado em produção ciclo a ciclo, as incertezas são eliminadas e as estimativas tornam-se altamente confiáveis.

 Próximo Passo
 Agora que você domina a teoria de estimativas relativas, Story Points, Fibonacci e dinâmicas de Planning Poker, avance para a aula prática de refinamento e aprenda a quebrar tarefas gigantes no GitHub Projects:
 Ir para o Laboratório: Refinamento e Decomposição de Backlog


## Pagina: Laboratório: Refinamento e Decomposição de Backlog
(05_Atividades_e_Cronogramas/02_Refinamento_e_Decomposicao_de_Backlog)

Laboratório: Refinamento e Decomposição de Backlog

 Guia prático para conduzir sessões de refinamento de backlog, quebrar tarefas grandes em fatias verticais, gerenciar Épicos e configurar estimativas no GitHub Projects.

 O que é o Refinamento de Backlog?
 O Refinamento de Backlog (historicamente chamado de Backlog Grooming ) é uma atividade colaborativa contínua em que a squad analisa, detalha, fatia e estima os itens do Product Backlog antes que eles entrem na reunião de planejamento da Sprint.
 O objetivo central do refinamento é assegurar que a equipe sempre disponha de um conjunto saudável de tarefas que cumpram a Definição de Preparado (DoR - Definition of Ready) .
 `graph LR
 Ideas["Ideias Brutas e Épicos"] --> Refinement["Sessão de Refinamento"]
 Refinement --> Slices["Histórias Fatiadas e Estimadas (DoR Atendido)"]
 Slices --> Planning["Sprint Planning"]
 Planning --> Dev["Desenvolvimento Fluido"]

 O Risco das Tarefas Monolíticas ("Pedras Brutas")
 Quando uma equipe cadastra itens genéricos e gigantescos no GitHub (como "Fazer a gamificação" , "Criar o painel administrativo" ou "Sistema de pagamentos" ), vários problemas operacionais surgem:

 Sensação de Estagnação: O card fica semanas na coluna `In Progress , impedindo a visualização do progresso real.
 Pull Requests Gigantescos e Inauditáveis: Tarefas gigantes geram alterações com dezenas de arquivos e milhares de linhas de código, tornando a revisão por pares ( Code Review ) superficial ou propensa a bugs graves.
 Dificuldade de Estimativa: Ninguém consegue prever com precisão o esforço de uma tarefa vaga, elevando o risco de estouro do ciclo.
 Bloqueio entre Integrantes: Múltiplos desenvolvedores tentam mexer no mesmo código ao mesmo tempo, gerando conflitos complexos no Git ( merge conflicts ).

 Princípios de Fatiamento Vertical ( Vertical Slicing )
 A engenharia de software ágil prioriza a entrega de fatias verticais em vez de divisões horizontais por camadas técnicas:
 `graph TD
 subgraph FH["Fatiamento Horizontal (Evitar)"]
 H1["Issue 1: Criar todas as tabelas do banco de dados"]
 H2["Issue 2: Criar todos os endpoints de backend"]
 H3["Issue 3: Criar todas as telas de frontend"]
 end

 subgraph FV["Fatiamento Vertical (Recomendado)"]
 V1["Fatia 1: Listagem simples de ranking (Banco + Rota GET + Tabela Web)"]
 V2["Fatia 2: Filtro mensal no ranking (Query param + Dropdown Web)"]
 V3["Fatia 3: Renderização de badges de conquista (Schema + Ícones no Perfil)"]
 end

 Fatia Horizontal (Camada Técnica): Produz código isolado que não pode ser testado pelo usuário final até que todas as camadas estejam prontas.
 Fatia Vertical (Valor de Negócio): Atravessa todas as camadas técnicas (banco, API e interface) para entregar uma funcionalidade pequena, testável e utilizável de ponta a ponta.

 O Modelo INVEST para Histórias de Usuário
 Ao decompor tarefas no refinamento, cada nova Issue deve buscar atender aos critérios INVEST :

 Letra
 Critério
 Significado Prático

 I
 Independent (Independente)
 A história deve ter o mínimo de dependência com outras tarefas para poder ser desenvolvida e entregue em qualquer ordem.

 N
 Negotiable (Negociável)
 Os detalhes de implementação e interface podem ser ajustados entre PO e desenvolvedores durante a construção.

 V
 Valuable (Valiosa)
 A entrega precisa trazer benefício perceptível para o usuário final ou para a arquitetura do sistema.

 E
 Estimable (Estimável)
 A equipe compreende o escopo e a tecnologia suficientemente bem para atribuir Story Points.

 S
 Small (Pequena)
 O esforço deve caber confortavelmente dentro de uma Sprint (idealmente de 1 a 5 Story Points).

 T
 Testable (Testável)
 Possui critérios de aceitação objetivos que permitem validar se o requisito funciona como esperado.

 Estudo de Caso: Decompondo a Gamificação no Hub Solidário
 Para compreender o fatiamento na prática, acompanhe a evolução de um Épico no projeto Hub Solidário :
 A Macro-tarefa Original (Inadequada)

 Título: `Issue #50 - Fazer a gamificação da plataforma
 Problema: Escopo gigantesco, estimativa superior a 21 Story Points, envolve regras de negócio complexas, renderização visual de insígnias, cálculos em background e componentes de interface.

 A Decomposição em Fatias Verticais
 Durante o refinamento, a squad transforma a tarefa monolítica em um Épico e cria seis Issues atômicas orientadas a valor:
 `graph TD
 Epic["Épico: Gamificação de Voluntários"] --> I1["Issue 1: Modelagem e persistência de pontos (3 pts)"]
 Epic --> I2["Issue 2: Endpoint de ranking geral e mensal (2 pts)"]
 Epic --> I3["Issue 3: Componente de tabela e pódio no frontend (3 pts)"]
 Epic --> I4["Issue 4: Visualização de badges no perfil (2 pts)"]
 Epic --> I5["Issue 5: Regra de pontuação automática por ação (5 pts)"]
 Epic --> I6["Issue 6: Renderização do mascote com feedback (3 pts)"]

 Issue 1: Modelagem de Dados de Pontuação (`hub-solidario-api )
 Escopo: Criação das tabelas de pontos, conquistas e histórico de transações de pontuação no banco de dados.

 Estimativa: 3 Story Points | Labels: `backend , `database

 Issue 2: Endpoint de Consulta do Ranking (`hub-solidario-api )

 Escopo: Rota `GET /voluntarios/ranking com suporte a paginação e filtro por período (geral e mensal).

 Estimativa: 2 Story Points | Labels: `backend , `api

 Issue 3: Tabela de Classificação e Pódio (`hub-solidario-web )

 Escopo: Componente React com os 3 primeiros colocados em destaque visual e listagem tabular paginada.

 Estimativa: 3 Story Points | Labels: `frontend , `ui

 Issue 4: Exibição de Badges de Conquista no Perfil (`hub-solidario-web )

 Escopo: Grade visual no perfil do voluntário exibindo insígnias desbloqueadas e bloqueadas com balão explicativo ( tooltip ).

 Estimativa: 2 Story Points | Labels: `frontend , `ui

 Issue 5: Motor de Atribuição Automática de Pontos (`hub-solidario-api )

 Escopo: Regra de negócio que credita pontos automaticamente ao voluntário quando a ONG confirma a presença em uma ação.

 Estimativa: 5 Story Points | Labels: `backend , `core

 Issue 6: Mascote Animado com Mensagens de Incentivo (`hub-solidario-web )

 Escopo: Componente visual do mascote da plataforma que renderiza saudações dinâmicas de acordo com o nível do voluntário.
 Estimativa: 3 Story Points | Labels: `frontend , `design

 Estruturação de Épicos e Sub-issues no GitHub
 Um Épico representa uma iniciativa ampla que engloba várias Histórias de Usuário complementares. No ecossistema do GitHub, a equipe organiza essa relação hierárquica por meio de Issues Principais (Parent Issues) e Sub-issues / Tasklists .
 `graph TD
 Parent["Issue Principal (Épico #50: Gamificação)"]
 Parent -->|Tracks| Child1["Issue #51: Modelagem de Pontos"]
 Parent -->|Tracks| Child2["Issue #52: Endpoint de Ranking"]
 Parent -->|Tracks| Child3["Issue #53: Tabela de Ranking"]
 Parent -->|Tracks| Child4["Issue #54: Badges no Perfil"]
 Parent -->|Tracks| Child5["Issue #55: Regra de Pontuação"]
 Parent -->|Tracks| Child6["Issue #56: Mascote Animado"]

 1. Criar a Issue do Épico

 Acesse o repositório principal da squad (ou o repositório de documentação/gestão da organização).
 Abra uma nova Issue com um título claro que represente a funcionalidade macro:
 Exemplo: `[Épico] Sistema de Gamificação e Engajamento de Voluntários .
 Adicione a etiqueta `epic .

 2. Vincular as Issues Filhas no Corpo do Épico (Tasklists e Rastreamento)
 O GitHub possui suporte nativo para vincular e rastrear Issues filhas diretamente na descrição do Épico.
 Método A: Utilizando Tasklists de Issues em Markdown
 Insira a lista de referências das Issues filhas com a sintaxe de checklist. Se as Issues pertencerem a repositórios diferentes da mesma organização, informe o nome do repositório:
 ` ## Objetivo do Épico
 Implementar o ecossistema completo de pontuação, badges de conquista e ranking para engajar os voluntários do Hub Solidário.

 ## Histórias e Tarefas Integradas (Sub-issues)
 - [ ] organizacao/hub-solidario-api#51
 - [ ] organizacao/hub-solidario-api#52
 - [ ] organizacao/hub-solidario-web#53
 - [ ] organizacao/hub-solidario-web#54
 - [ ] organizacao/hub-solidario-api#55
 - [ ] organizacao/hub-solidario-web#56

 Assim que a Issue do Épico é salva, o GitHub gera automaticamente:
- O indicador visual "Tracks 6 issues" (ou "Tracked by" na visualização de cada tarefa filha).
- Uma barra de progresso nativa ( ex: "0 of 6 tasks completed" ), que avança automaticamente à medida que os Pull Requests são mesclados e as sub-issues são encerradas.
 Método B: Utilizando o Recurso Nativo de Sub-issues

 Na página da Issue do Épico, localize a seção Sub-issues abaixo da descrição (ou na barra lateral direita).
 Clique no botão `+ Add sub-issue .
 Digite o número ou título da Issue filha já criada e confirme o vínculo.

 3. Visualizar a Hierarquia de Épicos no GitHub Projects
 No GitHub Projects , a squad pode acompanhar a evolução do Épico e de suas tarefas de forma agrupada:

 No quadro do GitHub Projects, crie uma nova visualização em formato de Tabela (Table) ou Quadro (Board) .
 Clique no menu `Group by (Agrupar por) no canto superior da visualização.
 Selecione o campo `Parent issue (ou `Tracked by ).
 O GitHub Projects exibirá cada Épico como um cabeçalho colapsável, listando todas as sub-issues aninhadas abaixo dele com seus respectivos status (`Todo , `In Progress , `Done ) e Story Points.

 Configurando Story Points e Estimativas no GitHub Projects
 Para registrar e somar as estimativas das Issues no quadro da squad, configure um campo customizado no GitHub Projects :
 1. Criar o Campo Customizado de Estimativa

 No GitHub Projects da sua organização, clique no botão `+ (New field) no canto superior direito da tabela ou quadro Kanban.
 Selecione a opção `New field .
 Defina as seguintes configurações:
 Field name: `Story Points (ou `Estimate ).
 Field type: `Number .
 Clique em Save .

 2. Habilitar a Visualização no Quadro Kanban

 No quadro Kanban, clique no menu de opções da visualização ( `... no canto superior direito da aba do quadro).
 Acesse `Card fields .
 Marque a caixa de seleção correspondente ao campo `Story Points .
 Agora, cada cartão exibirá um selo numérico com a pontuação estimada.

 3. Exibir Somatório de Pontos por Coluna

 Na visualização de quadro ou tabela, clique no botão de opções da coluna (ex: coluna In Progress ou Sprint 1 ).
 Selecione a opção `Calculate -> `Sum -> `Story Points .
 O GitHub Projects passará a exibir o total consolidado de pontos alocados em cada estado do fluxo de trabalho.

 Modelos de Issues Refinadas com Histórias de Usuário e DoD
 Abaixo estão exemplos completos de como documentar o Épico e as Issues fatiadas no GitHub para guiar o desenvolvimento:
 Épico: Visão Geral de Gamificação Backend: Endpoint de Ranking Frontend: Componente de Tabela de Ranking Frontend / Design: Componente do Mascote

 ` ## Visão Geral do Épico
 Proporcionar aos voluntários do Hub Solidário uma experiência gamificada que reconheça o engajamento através de pontos por horas doadas, badges de conquista e pódio mensal.

 ## Valor de Negócio
 Aumentar a taxa de retorno dos voluntários em ações recorrentes e dar visibilidade comunitária aos membros mais participativos.

 ## Sub-issues Vinculadas
 - [ ] hub-solidario-api#51 - Modelagem e persistência de pontos e conquistas
 - [ ] hub-solidario-api#52 - Endpoint de consulta de ranking com paginação
 - [ ] hub-solidario-web#53 - Componente visual de pódio e tabela de classificação
 - [ ] hub-solidario-web#54 - Grid de visualização de badges no perfil
 - [ ] hub-solidario-api#55 - Motor de atribuição automática de pontuação
 - [ ] hub-solidario-web#56 - Componente interativo do mascote animado

 ` ### História de Usuário
 **Como** voluntário cadastrado na plataforma Hub Solidário,
 **Desejo** consultar a lista dos voluntários com maior pontuação,
 **Para** acompanhar meu posicionamento e incentivar meu engajamento em ações sociais.

 ### Regras de Negócio e Contrato da API
 - Rota: `GET /voluntarios/ranking`
 - Query Params opcionais: `tipo=geral` ou `tipo=mensal` (padrão: `geral` )
 - Paginação: `page=1&limit=10`
 - Resposta HTTP 200: Lista com `id` , `nome` , `pontos_totais` , `posicao` e `avatar_url` .

 ### Checklist de Desenvolvimento (DoD)
 - [ ] Model e consulta otimizada com agregação de pontos
 - [ ] Controller com validação de parâmetros de consulta
 - [ ] Testes unitários cobrindo ranking geral e mensal
 - [ ] Documentação de exemplo de resposta adicionada ao README

 ` ### História de Usuário
 **Como** usuário do Hub Solidário,
 **Desejo** visualizar o ranking de voluntários em uma interface organizada com pódio,
 **Para** identificar facilmente os colaboradores de maior destaque.

 ### Requisitos Visuais e Funcionais
 - Destaque especial para as 3 primeiras posições (1º, 2º e 3º lugares) com ícones metálicos (ouro, prata e bronze)
 - Tabela responsiva com as posições de 4 a 10
 - Tratamento de estado de carregamento ( *skeleton loading* ) durante a requisição
 - Tratamento de estado de erro caso a API esteja indisponível

 ### Checklist de Desenvolvimento (DoD)
 - [ ] Componente React tipado com TypeScript ( `RankingTable.tsx` )
 - [ ] Estilização responsiva validada em mobile e desktop
 - [ ] Integração com o endpoint `GET /voluntarios/ranking`
 - [ ] Teste de renderização com dados simulados ( *mocks* )

 ` ### História de Usuário
 **Como** voluntário que acessa o painel principal,
 **Desejo** visualizar o mascote do Hub Solidário interagindo comigo,
 **Para** receber mensagens motivacionais personalizadas sobre o meu progresso.

 ### Requisitos Visuais e Funcionais
 - Renderização da ilustração SVG do mascote
 - Balão de fala dinâmico com mensagem baseada no nível do usuário (ex: "Faltam apenas 20 pontos para o próximo nível!")
 - Animação sutil de entrada (fade-in / float)

 ### Checklist de Desenvolvimento (DoD)
 - [ ] Componente `MascotBadge.tsx` estruturado
 - [ ] Variações visuais testadas para níveis Iniciante, Bronze, Prata e Ouro
 - [ ] Ausência de impacto negativo no desempenho da página

 Roteiro de Laboratório Prático para as Squads
 As squads devem executar as quatro etapas práticas abaixo para auditar, estruturar Épicos, decompor e pontuar o Backlog oficial do projeto no GitHub.

 Atividade Prática 1: Auditoria do Backlog e Criação de Épicos

 Reúna a squad e abra o quadro GitHub Projects da equipe.
 Percorra todas as Issues atualmente cadastradas no Backlog.
 Identifique itens com descrições vagas, títulos genéricos ou escopos excessivamente amplos (como "Gamificação" , "Área do usuário" , "Configurar banco de dados" ).
 Converta ou crie uma Issue Principal para cada funcionalidade macro identificada, adicionando o prefixo `[Épico] no título e a etiqueta `epic .

 Atividade Prática 2: Fatiamento em Fatias Verticais e Vínculo de Sub-issues

 Para cada Épico identificado, discuta em grupo a divisão em pelo menos 2 a 5 fatias verticais menores .
 Crie as novas Issues nos repositórios adequados (`*-api para backend, `*-web para frontend) com Histórias de Usuário ( Como / Desejo / Para ) e checklists técnicos de DoD.
 Edite a Issue do Épico e inclua a lista de links das novas sub-issues (ou utilize o botão `Add sub-issue ), garantindo que a barra de progresso de rastreamento seja ativada.

 Atividade Prática 3: Sessão de Planning Poker da Squad

 O Product Owner (PO) ou Scrum Master lê a primeira sub-issue em voz alta.
 A equipe tira dúvidas sobre regras técnicas e critérios de validação.
 Cada desenvolvedor escolhe sua estimativa na escala de Fibonacci modificada (`1 , `2 , `3 , `5 , `8 ) sem revelar aos colegas.
 Ao sinal do Scrum Master, todos revelam os valores simultaneamente.
 Se houver divergência acentuada (ex: um voto `2 e um voto `8 ), o menor e o maior voto explicam seus argumentos por 1 minuto.
 Realiza-se uma nova rodada rápida até alcançar o consenso da squad.

 Atividade Prática 4: Atualização e Visualização no GitHub Projects

 Registre o valor acordado no campo `Story Points de cada sub-issue.
 Certifique-se de que nenhuma Issue individual dentro da Sprint possua estimativa igual ou superior a 13 pontos (se houver, fatie novamente).
 No GitHub Projects, crie uma visualização agrupada por `Parent issue para validar a árvore hierárquica dos Épicos e confirme o somatório de pontos planejados para o ciclo.

 Exercícios de Fixação

 Responda às questões abaixo para verificar a assimilação dos conceitos de refinamento de backlog, fatiamento vertical, Épicos e estimativas relativas.

Como uma equipe pode estruturar um Épico no GitHub e acompanhar visualmente o progresso das tarefas que fazem parte dele?
* [ ] Enviando um e-mail diário com a lista de commits realizados na branch principal.
* [x] Criando uma Issue principal com a etiqueta 'epic' e inserindo a lista de links das sub-issues na descrição (Tasklists), ativando a barra de progresso automática de rastreamento.
* [ ] Deletando todas as tarefas antigas do repositório a cada nova funcionalidade iniciada.
* [ ] Escrevendo o nome de todos os desenvolvedores no título do repositório.

-->

 #
 Questão 1

 Como uma equipe pode estruturar um Épico no GitHub e acompanhar visualmente o progresso das tarefas que fazem parte dele?

 Enviando um e-mail diário com a lista de commits realizados na branch principal. Criando uma Issue principal com a etiqueta 'epic' e inserindo a lista de links das sub-issues na descrição (Tasklists), ativando a barra de progresso automática de rastreamento. Deletando todas as tarefas antigas do repositório a cada nova funcionalidade iniciada. Escrevendo o nome de todos os desenvolvedores no título do repositório.

Qual é a principal vantagem de realizar o fatiamento vertical (Vertical Slicing) em vez de fatiar tarefas por camadas técnicas horizontais (banco de dados, rotas de backend e telas separadas)?
* [ ] Permite que o projeto não precise de testes automatizados nem de revisões de código.
* [x] Garante que cada entrega represente uma funcionalidade utilizável de ponta a ponta, permitindo validação precoce com o usuário e evitando dependências bloqueantes.
* [ ] Elimina a necessidade de utilizar o framework Scrum e dispensa o papel do Product Owner.
* [ ] Garante que todo o banco de dados do sistema fique pronto antes de qualquer interface ser desenhada.

-->

 #
 Questão 2

 Qual é a principal vantagem de realizar o fatiamento vertical (Vertical Slicing) em vez de fatiar tarefas por camadas técnicas horizontais (banco de dados, rotas de backend e telas separadas)?

 Permite que o projeto não precise de testes automatizados nem de revisões de código. Garante que cada entrega represente uma funcionalidade utilizável de ponta a ponta, permitindo validação precoce com o usuário e evitando dependências bloqueantes. Elimina a necessidade de utilizar o framework Scrum e dispensa o papel do Product Owner. Garante que todo o banco de dados do sistema fique pronto antes de qualquer interface ser desenhada.

Durante a sessão de Planning Poker, um desenvolvedor vota '2' e outro desenvolvedor vota '8' para a mesma Issue. Qual é a conduta ágil correta a ser adotada pela squad?
* [ ] Adotar a média aritmética simples (5 pontos) imediatamente sem qualquer discussão.
* [ ] O Scrum Master decide a pontuação final sozinho, sem consultar a equipe de desenvolvimento.
* [x] Ouvir os argumentos do menor voto (por que achou tão simples) e do maior voto (quais riscos ou complexidades identificou), realizando em seguida uma nova rodada rápida para buscar o consenso.
* [ ] Cancelar o desenvolvimento da funcionalidade e excluí-la do Backlog do Produto.

-->

 #
 Questão 3

 Durante a sessão de Planning Poker, um desenvolvedor vota '2' e outro desenvolvedor vota '8' para a mesma Issue. Qual é a conduta ágil correta a ser adotada pela squad?

 Adotar a média aritmética simples (5 pontos) imediatamente sem qualquer discussão. O Scrum Master decide a pontuação final sozinho, sem consultar a equipe de desenvolvimento. Ouvir os argumentos do menor voto (por que achou tão simples) e do maior voto (quais riscos ou complexidades identificou), realizando em seguida uma nova rodada rápida para buscar o consenso. Cancelar o desenvolvimento da funcionalidade e excluí-la do Backlog do Produto.

Por que uma equipe ágil deve evitar manter tarefas estimadas em 13, 21 ou mais Story Points dentro da Sprint?
* [ ] Porque o GitHub Projects não suporta números com dois dígitos em campos numéricos customizados.
* [x] Porque pontuações altas indicam incerteza elevada, escopo excessivo e alto risco de bloqueio, exigindo a decomposição da tarefa em fatias menores e mais previsíveis.
* [ ] Porque tarefas de 13 pontos só podem ser programadas por desenvolvedores seniores em servidores de homologação.
* [ ] Porque a pontuação 13 traz azar para a entrega final da Sprint.

-->

 #
 Questão 4

 Por que uma equipe ágil deve evitar manter tarefas estimadas em 13, 21 ou mais Story Points dentro da Sprint?

 Porque o GitHub Projects não suporta números com dois dígitos em campos numéricos customizados. Porque pontuações altas indicam incerteza elevada, escopo excessivo e alto risco de bloqueio, exigindo a decomposição da tarefa em fatias menores e mais previsíveis. Porque tarefas de 13 pontos só podem ser programadas por desenvolvedores seniores em servidores de homologação. Porque a pontuação 13 traz azar para a entrega final da Sprint.

No acrônimo INVEST para boas Histórias de Usuário, o que representa a letra 'S' (Small)?
* [ ] Que a história deve ser escrita utilizando apenas sentenças curtas de no máximo 10 palavras.
* [ ] Que a funcionalidade só pode ser acessada em telas de celulares pequenos (smartphones).
* [x] Que o esforço e a complexidade da história devem ser pequenos o suficiente para que ela seja desenvolvida, testada e concluída com tranquilidade dentro de um único ciclo (Sprint).
* [ ] Que a história deve ser atribuída exclusivamente ao estagiário da squad.

-->

 #
 Questão 5

 No acrônimo INVEST para boas Histórias de Usuário, o que representa a letra 'S' (Small)?

 Que a história deve ser escrita utilizando apenas sentenças curtas de no máximo 10 palavras. Que a funcionalidade só pode ser acessada em telas de celulares pequenos (smartphones). Que o esforço e a complexidade da história devem ser pequenos o suficiente para que ela seja desenvolvida, testada e concluída com tranquilidade dentro de um único ciclo (Sprint). Que a história deve ser atribuída exclusivamente ao estagiário da squad.

 Progresso do quiz

 0 / 0 questões respondidas
 ( 0% )

 0 correto

 Quiz completo!

 0%

 Reiniciar quiz
