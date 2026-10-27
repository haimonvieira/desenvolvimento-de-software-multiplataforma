---
disciplina: DSM3/GAPS
titulo: GAPS Modulo 02   Manifesto Agil
fonte: DSM3/GAPS/notebook-sources/GAPS-Modulo 02 - Manifesto Agil.txt
tipo: txt
paginas: 0
extraido_em: 2026-10-24
---

# Modulo 02 - Manifesto Agil
Fonte: https://i-davies.github.io/conteudo-fatec-2026-2/GAPS/02_Manifesto_Agil/


## Pagina: O Manifesto Ágil e a Mentalidade Incremental
(02_Manifesto_Agil/01_Manifesto_Agil)

O Manifesto Ágil e a Mentalidade Incremental

 Material didático para a disciplina de Gestão de Agilidade e Projetos de Software.
Referências principais: Manifesto para o Desenvolvimento Ágil de Software e Mentalidade Ágil .

 O Caos da Entrega Única vs A Mentalidade Incremental
 No modelo tradicional em Cascata, o desenvolvimento de software tenta planejar e construir o produto completo antes de mostrá-lo ao cliente. Essa abordagem é conhecida na engenharia como tentar "engolir o elefante inteiro".
 Tentar entregar tudo de uma vez gera um risco altíssimo: se o cliente perceber que algo não atende às suas necessidades apenas no final do desenvolvimento, o custo e o esforço para refazer o projeto são gigantescos.
 A mentalidade ágil propõe o oposto: fatiar o desenvolvimento em pequenas partes e entregar valor continuamente por meio de incrementos frequentes.
 Fatiamento Incremental: Fatiando o Elefante
 Fatiar o projeto significa dividir o escopo em partes menores que possam ser desenvolvidas, testadas e validadas em ciclos curtos.

 Fatias Verticais vs Fatias Horizontais

 Fatia Horizontal (Camadas): Desenvolver todo o banco de dados primeiro, depois toda a API e, por fim, todas as telas. Isso não gera valor imediato para o usuário, que não consegue usar o software até que todas as camadas estejam prontas.
 Fatia Vertical (Funcionalidade): Desenvolver uma funcionalidade básica de ponta a ponta (Banco de Dados + API + Interface), como o cadastro de uma ONG. O usuário já pode interagir com essa fatia, gerando feedback imediato para guiar os próximos passos.

 O Manifesto Ágil
 Em 2001, um grupo de 17 profissionais de desenvolvimento de software se reuniu nos Estados Unidos para discutir alternativas aos processos tradicionais e burocráticos de gestão de projetos. Dessa reunião nasceu o Manifesto para o Desenvolvimento Ágil de Software .
 O Manifesto Ágil estabelece quatro valores fundamentais e doze princípios que guiam a cultura de entrega rápida e adaptável. Você pode consultar a publicação oficial na página do Manifesto para Desenvolvimento Ágil de Software .
 Os Quatro Valores Fundamentais
 Estes valores ditam as prioridades de uma equipe ágil:

 Valores do Manifesto Ágil

 Indivíduos e interações mais que processos e ferramentas.
 Software em funcionamento mais que documentação abrangente.
 Colaboração com o cliente mais que negociação de contratos.
 Responder a mudanças mais que seguir um plano.

 Isso significa que, mesmo havendo valor nos itens à direita, valorizamos mais os itens à esquerda.
 Resumo dos Doze Princípios
 Os princípios traduzem os valores em comportamentos práticos para o dia a dia do desenvolvimento. A lista original detalhada está disponível na página de Princípios do Manifesto Ágil :

 Satisfação do cliente: Entregar valor o mais cedo possível e de forma contínua.
 Aceitar mudanças: Requisitos novos ou alterados são bem-vindos, mesmo no final do projeto.
 Entregas frequentes: Disponibilizar software funcional em intervals curtos de tempo.
 Trabalho conjunto: Desenvolvedores e pessoas de negócios devem colaborar diariamente.
 Indivíduos motivados: Dar suporte, confiança e autonomia para a equipe realizar o trabalho.
 Comunicação eficiente: Priorizar a conversa direta e colaborativa como principal meio de alinhamento.
 Software funcional: A principal medida de progresso de um projeto é o software funcionando.
 Desenvolvimento sustentável: Manter um ritmo de trabalho constante e saudável para a equipe.
 Excelência técnica: Focar na qualidade do código e do design para facilitar mudanças futuras.
 Simplicidade: Maximizar a quantidade de trabalho que não precisa ser feito.
 Auto-organização: As melhores soluções emergem de equipes autônomas e organizadas.
 Melhoria contínua: Em intervalos regulares, a equipe reflete sobre como ser mais eficaz e ajusta suas práticas.

 Próximo Passo
 Agora que compreendemos a base teórica e de mentalidade da agilidade, veremos como traduzir essa filosofia de fatiamento de tarefas na prática usando o GitHub:
 Ir para a Aula: Issues e Gestão de Backlog no GitHub


## Pagina: Issues e Gestão de Backlog no GitHub
(02_Manifesto_Agil/02_Issues_e_Backlog)

Issues e Gestão de Backlog no GitHub

 Material didático para a disciplina de Gestão de Agilidade e Projetos de Software.
Conceitos de gerenciamento de itens de trabalho utilizando GitHub Issues.

 O que é o Backlog do Produto?
 O Product Backlog (ou simplesmente Backlog) é a lista única, dinâmica e ordenada de todo o trabalho que precisa ser realizado no produto. Ele é o ponto de partida de qualquer desenvolvimento ágil.
 No modelo tradicional, o escopo ficava congelado em um documento de requisitos. No modelo ágil, o Backlog evolui constantemente. Itens podem ser adicionados, reordenados ou removidos à medida que o time recebe novos feedbacks ou descobre novos desafios técnicos.

 Quando Esse Planejamento e Refinamento Acontecem?
 No ciclo ágil (como no framework Scrum), a organização e o detalhamento do Backlog não são atividades de uma única fase inicial do projeto. Eles ocorrem de forma contínua e em reuniões específicas:

 Momentos de Organização do Backlog

 Refinamento do Backlog (Backlog Refinement): É uma atividade contínua em que o time revisa os itens do Backlog, divide tarefas grandes em partes menores (fatiamento), detalha descrições e remove dúvidas técnicas. O objetivo é deixar as tarefas prontas e compreensíveis para o desenvolvimento.
 Planejamento da Sprint (Sprint Planning): Reunião que ocorre no início de cada ciclo (Sprint). O time de desenvolvimento seleciona as tarefas prioritárias do Backlog já refinado e se compromete a entregá-las até o fim do ciclo.

 Rascunhos (Draft Issues) vs Issues Oficiais
 Na aula anterior, você utilizou o GitHub Projects para criar cartões rápidos contendo ideias de funcionalidades. No GitHub, esses cartões rápidos são chamados de Draft Issues (rascunhos).
 Embora sejam práticos para brainstorm, os rascunhos possuem limitações e precisam ser convertidos em Issues oficiais para que o fluxo de desenvolvimento funcione de verdade.

 Característica
 Draft Issue (Rascunho)
 Issue Oficial

 Escopo
 Existe apenas dentro do quadro de projetos
 Existe no repositório de código e possui URL própria

 Detalhes
 Suporta apenas título simples
 Suporta descrição rica em Markdown, imagens e tabelas

 Atribuição
 Não permite definir quem vai programar
 Permite atribuir desenvolvedores responsáveis (Assignees)

 Metadados
 Não aceita etiquetas (Labels) ou marcos
 Permite adicionar Labels, Sprints e Milestones

 Histórico
 Não aceita comentários ou discussões
 Centraliza conversas, dúvidas e revisões de código

 Como Estruturar uma Excelente Issue
 Para evitar que as tarefas fiquem vagas ou confusas (como apenas escrever "Fazer login no site"), uma Issue oficial deve conter informações suficientes para orientar o desenvolvedor e o testador.
 Uma boa Issue é composta por três elementos fundamentais:
 Título Claro e Objetivo
 Deve indicar uma ação específica de forma concisa.

 Ruim: `Mapa
 Bom: `Implementar marcadores de ONGs no mapa interativo

 Descrição e Contexto
 Explica a necessidade sob a perspectiva de quem usará a funcionalidade ou a necessidade técnica por trás da tarefa.

 Dica: Formato da História de Usuário (User Story)
 Uma forma simples de descrever o valor de uma Issue é responder a três perguntas:

 Quem quer? (Papel do usuário)
 O que quer? (Funcionalidade)
 Por que quer? (Benefício gerado)

 Exemplo: Como voluntário do Hub Solidário, desejo filtrar ONGs por categoria para encontrar vagas de trabalho do meu interesse de forma rápida.

 Critérios de Aceitação (Checklist de Desenvolvimento)
 Um checklist de itens técnicos que precisam ser atendidos para considerar a Issue como concluída. Isso ajuda a alinhar a expectativa do time e a testar a entrega de forma objetiva.

 Exemplo de Template de Issue
 Abaixo está um exemplo de estrutura em Markdown recomendada para preencher as Issues do projeto:
 ` ### Descrição
 Como administrador da ONG Hub Solidário, desejo cadastrar novas oportunidades de voluntariado na plataforma para que potenciais voluntários possam visualizá-las no mapa.

 ### Detalhes Técnicos e Requisitos
 - A rota no backend deve aceitar dados da vaga (título, descrição, categoria, data e endereço)
 - O frontend deve validar se o campo data é posterior ao dia de hoje antes de enviar

 ### Checklist de Desenvolvimento
 - [ ] Criar endpoint POST /vagas no repositório de API
 - [ ] Criar formulário de cadastro de vaga no repositório Web
 - [ ] Integrar formulário com o endpoint da API
 - [ ] Validar campos obrigatórios no frontend e backend

 Próximo Passo
 Com os conceitos de Issues e estruturação de Backlog compreendidos, vamos para a prática ajustar o Kanban do projeto e fazer a conversão dos cartões rascunho:
 Ir para o Laboratório: Prática e Ajuste do Backlog


## Pagina: Prática: Ajuste do Backlog e Criação de Issues
(02_Manifesto_Agil/03_Pratica_e_Ajuste)

Prática: Ajuste do Backlog e Criação de Issues

 Roteiro de laboratório para a disciplina de Gestão de Agilidade e Projetos de Software.
Atividade prática de refinamento e formalização do backlog da ONG Hub Solidário no GitHub.

 Atividade Prática: Ajustando o Backlog e Criando as Primeiras Issues
 Nesta atividade prática, as squads realizarão o refinamento (ajuste) do backlog preliminar criado na aula anterior para o projeto Hub Solidário . O objetivo é transformar ideias abstratas e rascunhos simples em Issues técnicas prontas para desenvolvimento.

 Passo a Passo do Laboratório
 Alinhamento e Refinamento com a Squad
 Reúna-se com os membros do seu squad no quadro de projetos do GitHub Projects. O foco é analisar os cartões rascunho ( Draft Issues ) da coluna `Todo e validar:

 O cartão descreve uma necessidade real do projeto?
 É possível dividir essa tarefa em duas (uma para o repositório de API e outra para o repositório Web)?
 Há tarefas duplicadas ou que não fazem sentido para a versão inicial do software?

 Conversão de Rascunho para Issue Oficial
 Para cada cartão rascunho validado, faça a conversão para uma Issue oficial vinculada a um repositório específico:

 No quadro Kanban, clique sobre o cartão rascunho que deseja converter.
 No menu do cartão, clique no ícone de opções (três pontos) ou na seta ao lado do título e selecione Convert to issue .
 Selecione o repositório de destino apropriado:
 Escolha `hub-solidario-api se a tarefa envolver criação de rotas, regras de negócio ou banco de dados.
 Escolha `hub-solidario-web se a tarefa envolver telas, formulários, componentes de interface ou integração de chamadas de API no frontend.

 Detalhamento da Issue com Critérios de Aceitação
 Após converter o rascunho em uma Issue oficial, clique nela para abrir a tela de edição e preencher os detalhes:

 Clique em Edit na seção de descrição da Issue.
 Escreva o contexto da tarefa utilizando a estrutura de História de Usuário (Como/Desejo/Para).
 Adicione o checklist de desenvolvimento contendo os critérios técnicos necessários para considerar a tarefa concluída.
 Salve as alterações.

 Atribuição de Responsáveis
 Com a Issue detalhada, distribua o trabalho de forma transparente:

 Na lateral direita da Issue, localize o campo Assignees .
 Clique em Assign yourself para assumir a tarefa, ou pesquise e selecione o usuário do colega de equipe que trabalhará nela.
 Certifique-se de que o cartão agora exibe a foto do perfil do responsável no quadro Kanban.

 Exemplos Práticos de Fatiamento: Rascunhos vs Issues Reais
 Para guiar o trabalho da equipe, veja abaixo três exemplos de ideias iniciais (Draft Issues) sendo fatiadas e detalhadas como Issues oficiais para a API (Back-end) e para a Web (Front-end).

 Exemplo: Cadastro de ONGs

 Rascunho Inicial (Draft): `Cadastrar as ONGs parceiras no sistema

 Fatia Back-end (Repositório: hub-solidario-api) Fatia Front-end (Repositório: hub-solidario-web)

 Título da Issue: `Implementar endpoint de cadastro de ONGs
 Descrição:
 ` ### Descrição
 Como API do Hub Solidário, desejo receber e validar os dados de cadastro de uma nova ONG para persisti-los com segurança no banco de dados.

 ### Checklist de Desenvolvimento
 - [ ] Criar entidade/tabela de ONGs no banco de dados (Nome, CNPJ, E-mail, Telefone, Endereço, Geolocalização)
 - [ ] Criar rota POST /ongs com validação de CNPJ e campos obrigatórios
 - [ ] Escrever testes de integração básicos para a rota

 Título da Issue: `Criar formulário e página de cadastro de ONGs
 Descrição:
 ` ### Descrição
 Como gestor de uma ONG, desejo ter um formulário simples e amigável na Web para cadastrar minha organização na plataforma do Hub Solidário.

 ### Checklist de Desenvolvimento
 - [ ] Criar página de cadastro de ONG no frontend
 - [ ] Implementar campos com validação (CNPJ com máscara, formato de e-mail e telefone)
 - [ ] Integrar formulário com o endpoint POST /ongs do backend
 - [ ] Tratar mensagens de erro e feedback visual de sucesso ao usuário

 Exemplo: ONGs no Mapa

 Rascunho Inicial (Draft): `Mostrar mapa com as ONGs cadastradas

 Fatia Back-end (Repositório: hub-solidario-api) Fatia Front-end (Repositório: hub-solidario-web)

 Título da Issue: `Criar endpoint para listagem de ONGs com geolocalização
 Descrição:
 ` ### Descrição
 Como API do Hub Solidário, desejo disponibilizar uma rota para retornar todas as ONGs cadastradas contendo suas coordenadas geográficas para exibição em mapas.

 ### Checklist de Desenvolvimento
 - [ ] Criar rota GET /ongs retornando Nome, Categoria e Coordenadas (Latitude e Longitude)
 - [ ] Filtrar dados confidenciais da resposta JSON
 - [ ] Garantir o retorno correto dos dados no formato esperado pelo Leaflet

 Título da Issue: `Implementar mapa interativo e exibir marcadores de ONGs
 Descrição:
 ` ### Descrição
 Como voluntário, desejo visualizar um mapa interativo contendo marcadores com a localização das ONGs da região para encontrar oportunidades geograficamente.

 ### Checklist de Desenvolvimento
 - [ ] Instalar e configurar biblioteca de mapa (Leaflet e OpenStreetMap) no frontend
 - [ ] Consumir dados da rota GET /ongs do backend
 - [ ] Renderizar pins/marcadores customizados no mapa para cada ONG
 - [ ] Exibir popup com Nome e Categoria da ONG ao clicar no marcador

 Exemplo: Vagas de Voluntariado

 Rascunho Inicial (Draft): `Criar painel de vagas de trabalho voluntário

 Fatia Back-end (Repositório: hub-solidario-api) Fatia Front-end (Repositório: hub-solidario-web)

 Título da Issue: `Criar rotas para criação e listagem de vagas de voluntariado
 Descrição:
 ` ### Descrição
 Como API do Hub Solidário, desejo gerenciar o cadastro e a listagem de vagas de atuação voluntária vinculadas a uma ONG.

 ### Checklist de Desenvolvimento
 - [ ] Criar tabela de vagas (Título, Descrição, ONG_ID, Data, Limite de Voluntários)
 - [ ] Criar endpoint POST /ongs/{id}/vagas para cadastro de nova vaga pela ONG
 - [ ] Criar endpoint GET /vagas para listagem geral de vagas abertas

 Título da Issue: `Desenvolver tela de listagem de vagas de voluntariado
 Descrição:
 ` ### Descrição
 Como voluntário, desejo visualizar uma lista de vagas de voluntariado abertas para que eu possa escolher em qual me inscrever.

 ### Checklist de Desenvolvimento
 - [ ] Criar componente de card para renderizar as informações da vaga
 - [ ] Criar página de listagem consumindo a rota GET /vagas do backend
 - [ ] Adicionar filtros frontend para pesquisa de vagas por título ou categoria

 Exercícios de Fixação

 Responda às questões abaixo para verificar a fixação dos tópicos da aula.

Qual valor do Manifesto Ágil destaca a prioridade dada ao código executável entregue ao usuário final em relação à escrita de manuais e especificações técnicas?

* [ ] Responder a mudanças mais que seguir um plano.
* [ ] Indivíduos e interações mais que processos e ferramentas.
* [x] Software em funcionamento mais que documentação abrangente.
* [ ] Colaboração com o cliente mais que negociação de contratos.

-->

 #
 Questão 1

 Qual valor do Manifesto Ágil destaca a prioridade dada ao código executável entregue ao usuário final em relação à escrita de manuais e especificações técnicas?

 Responder a mudanças mais que seguir um plano. Indivíduos e interações mais que processos e ferramentas. Software em funcionamento mais que documentação abrangente. Colaboração com o cliente mais que negociação de contratos.

No contexto de métodos ágeis, o que significa a metáfora de fatiar o elefante?

* [ ] Escrever o código inteiro da aplicação de uma só vez para testar no final do projeto.
* [ ] Dividir a equipe em subgrupos altamente especializados que não se comunicam entre si.
* [x] Quebrar um escopo de software complexo em pequenas entregas menores, funcionais e incrementais de valor.
* [ ] Desenhar o banco de dados completo antes de iniciar a construção da interface do sistema.

-->

 #
 Questão 2

 No contexto de métodos ágeis, o que significa a metáfora de fatiar o elefante?

 Escrever o código inteiro da aplicação de uma só vez para testar no final do projeto. Dividir a equipe em subgrupos altamente especializados que não se comunicam entre si. Quebrar um escopo de software complexo em pequenas entregas menores, funcionais e incrementais de valor. Desenhar o banco de dados completo antes de iniciar a construção da interface do sistema.

Qual é a principal diferença entre uma Draft Issue (rascunho) e uma Issue Oficial no GitHub?

* [ ] Draft Issues permitem compilar o código diretamente na nuvem, enquanto as Issues oficiais não.
* [x] Issues oficiais pertencem a um repositório, aceitam descrição rica, atribuição de responsáveis e etiquetas, enquanto Draft Issues são apenas cartões de texto restritos ao quadro de projetos.
* [ ] Draft Issues só podem ser visualizadas por professores, enquanto as Issues oficiais são públicas para toda a internet.

-->

 #
 Questão 3

 Qual é a principal diferença entre uma Draft Issue (rascunho) e uma Issue Oficial no GitHub?

 Draft Issues permitem compilar o código diretamente na nuvem, enquanto as Issues oficiais não. Issues oficiais pertencem a um repositório, aceitam descrição rica, atribuição de responsáveis e etiquetas, enquanto Draft Issues são apenas cartões de texto restritos ao quadro de projetos. Draft Issues só podem ser visualizadas por professores, enquanto as Issues oficiais são públicas para toda a internet.

O que representa uma fatia vertical no fatiamento de funcionalidades de software?

* [ ] A criação de toda a arquitetura de banco de dados do sistema de uma só vez.
* [x] A entrega de uma funcionalidade completa passando por todas as camadas necessárias (banco de dados, API e interface) para que o usuário possa interagir com ela.
* [ ] O desenvolvimento exclusivo do layout de telas sem conexão com regras de negócios ou backend.

-->

 #
 Questão 4

 O que representa uma fatia vertical no fatiamento de funcionalidades de software?

 A criação de toda a arquitetura de banco de dados do sistema de uma só vez. A entrega de uma funcionalidade completa passando por todas as camadas necessárias (banco de dados, API e interface) para que o usuário possa interagir com ela. O desenvolvimento exclusivo do layout de telas sem conexão com regras de negócios ou backend.

 Progresso do quiz

 0 / 0 questões respondidas
 ( 0% )

 0 correto

 Quiz completo!

 0%

 Reiniciar quiz
