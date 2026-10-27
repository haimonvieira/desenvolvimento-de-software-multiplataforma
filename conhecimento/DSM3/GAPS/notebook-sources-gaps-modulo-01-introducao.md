---
disciplina: DSM3/GAPS
titulo: GAPS Modulo 01   Introducao
fonte: DSM3/GAPS/notebook-sources/GAPS-Modulo 01 - Introducao.txt
tipo: txt
paginas: 0
extraido_em: 2026-10-24
---

# Modulo 01 - Introducao
Fonte: https://i-davies.github.io/conteudo-fatec-2026-2/GAPS/01_Introducao/


## Pagina: Introdução à Gestão de Agilidade e Projetos de Software (GAPS)
(01_Introducao/01_Introducao)

Introdução à Gestão de Agilidade e Projetos de Software (GAPS)

 Material didático para disciplina de Gestão de Agilidade e Projetos de Software.
Referências principais: Guia Scrum (Scrum Guide) , Manifesto Ágil e Guia PMBOK (Project Management Body of Knowledge) .

 Ferramentas e Tecnologias

 Stack de Gestão e Desenvolvimento

 Gestão de Tarefas e Projetos : GitHub Projects (Kanban / Sprints)
 Controle de Versão : Git e GitHub (Organizations, Repositories, Issues e Pull Requests)
 Gerenciadores de Pacotes e Ambientes : npm / UV
 Infraestrutura e Nuvem : AWS Academy e Oracle Academy
 Ambiente de Desenvolvimento : VS Code

 Apresentação da Disciplina
 A disciplina de Gestão de Agilidade e Projetos de Software (GAPS) tem como objetivo capacitar os alunos a planejarem, executarem e entregarem projetos de software modernos utilizando metodologias ágeis e boas práticas do mercado de tecnologia.
 Diferente da gestão tradicional de projetos de engenharia, o desenvolvimento de software exige flexibilidade, capacidade de adaptação a mudanças e entregas incrementais frequentes. Ao longo do semestre, o aprendizado será pautado na prática real dentro do ecossistema do GitHub.
 O que veremos em GAPS?

 Engenharia de Software Prática: Aplicação dos conceitos do Manifesto Ágil, Scrum e Kanban no fluxo de desenvolvimento diário.
 Gestão de Projetos no GitHub: Uso avançado de GitHub Organizations, Repositories, Issues, Labels e GitHub Projects.
 Engajamento e Qualidade Técnica: Definição de critérios de pronto (Definition of Done), revisão de código via Pull Requests e estimativas ágeis.
 Infraestrutura e Custos: Dimensionamento de infraestrutura em nuvem e planejamento financeiro de software.
 Soft Skills e Trabalho em Equipe: Organização em squads, dinâmicas de retrospectiva e liderança colaborativa.

 Conceitos-Chave da Agilidade

 O Modelo Cascata vs O Modelo Ágil
 No modelo tradicional em Cascata (Waterfall), cada fase do projeto (Requisitos, Design, Codificação, Testes) ocorre em sequência. Se um requisito mudar durante a codificação, o impacto no custo e no prazo é imenso.
 No modelo Ágil, o desenvolvimento é realizado em ciclos curtos e iterativos. O software é construído em pequenos incrementos funcionais, permitindo ajustes constantes com base no feedback real.

 Definição: O que é uma Issue e um Pull Request?

 Issue: É o registro de um trabalho a ser feito no GitHub. Pode ser a implementação de uma funcionalidade, a correção de um bug ou a escrita de uma documentação.
 Pull Request (PR): É a proposta de inclusão de alterações de código de uma branch secundária para a branch principal (`main ). Permite a revisão de código por outros membros da equipe antes do merge.

 Conteúdos do Módulo Inicial

 Aula 01: O Modelo Tradicional e a Tríplice Restrição
 Aula 02: Estudo de Caso - O Projeto Hub Solidário
 Aula 03: Setup Prático do Projeto no GitHub

 Próximo Passo
 Inicie o estudo pela primeira aula teórica:
 Ir para a Aula 01: O Modelo Tradicional e a Tríplice Restrição


## Pagina: O Modelo Tradicional e a Tríplice Restrição
(01_Introducao/02_Modelo_Tradicional)

O Modelo Tradicional e a Tríplice Restrição

 Material didático para a disciplina de Gestão de Agilidade e Projetos de Software.
Referências principais: Guia PMBOK (Project Management Body of Knowledge) e Manifesto Ágil .

 O que é um Projeto de Software?
 Um projeto é um esforço temporário empreendido para criar um produto, serviço ou resultado único.
 Diferente de uma operação contínua (como manter um servidor no ar ou prestar suporte), um projeto tem início, meio e fim , além de objetivos e recursos delimitados.
 Comparativo: Operação vs Projeto

 Conceito
 Exemplo
 Característica

 Operação
 Atendimento diário ao cliente de uma ONG
 Atividade contínua e repetitiva

 Projeto
 Desenvolvimento do aplicativo Hub Solidário
 Esforço temporário para criar um novo software

 A Visão Tradicional (PMBOK e o Modelo Cascata)
 Na engenharia tradicional (como na construção civil), os projetos costumam seguir a abordagem PMBOK clássica organizada no formato Cascata (Waterfall) .
 No modelo Cascata, uma fase só começa quando a anterior estiver totalmente concluída e aprovada.
 `graph TD
 A[Levantamento de Requisitos] --> B[Design e Arquitetura]
 B --> C[Codificação e Implementação]
 C --> D[Testes e Homologação]
 D --> E[Implantação e Entrega]

 style A fill:#e8eaf6,stroke:#3949ab,stroke-width:2px,color:#1a237e
 style B fill:#e8eaf6,stroke:#3949ab,stroke-width:2px,color:#1a237e
 style C fill:#e8eaf6,stroke:#3949ab,stroke-width:2px,color:#1a237e
 style D fill:#e8eaf6,stroke:#3949ab,stroke-width:2px,color:#1a237e
 style E fill:#e8eaf6,stroke:#3949ab,stroke-width:2px,color:#1a237e

 A Tríplice Restrição (Triângulo de Ferro)
 Todo projeto tradicional é sustentado por três pilares interligados conhecidos como Tríplice Restrição :

 Escopo: O que exatamente será construído (todas as funcionalidades do software).
 Tempo: O prazo final para a entrega do projeto.
 Custo: O orçamento disponível para equipe, ferramentas e infraestrutura.

 ESCOPO
 Funcionalidades

 TEMPO
 Prazo

 CUSTO
 Orçamento

 QUALIDADE

 A Dinâmica da Tríplice Restrição
 Em um projeto com premissas rígidas, o Escopo fica no topo e o Tempo e o Custo na base. Quando há uma expansão no Escopo (novas funcionalidades adicionadas), ocorre uma pressão proporcional que exige maior investimento financeiro ( Custo ) ou extensão do prazo final ( Tempo ).

 O Problema da Tríplice Restrição Fixa
 Se o cliente decide alterar o Escopo no meio do projeto (adicionando novas telas), obrigatoriamente o Tempo aumentará ou o Custo subirá. Tentar manter o prazo e o custo fixos alterando o escopo gera o Caos no Desenvolvimento .

 Por que o Modelo Tradicional Falha em Software?
 Software é um produto intangível e de alta incerteza. Diferente de construir uma ponte, onde o terreno e a planta são conhecidos previamente, o cliente raramente sabe exatamente o que precisa antes de ver o sistema funcionando.
 Exemplo Real: O Risco das Mudanças Tardias
 Em um projeto tradicional de 6 meses:

 Mês 1 a 2: O analista escreve um documento extenso detalhando todas as regras de negócio.
 Mês 3 a 4: A equipe desenvolve o banco de dados e o sistema base.
 Mês 5: Na apresentação da primeira versão funcional, o cliente identifica necessidades reais que não estavam no documento inicial.
 O Resultado: Semanas de trabalho descartadas, código refatorado às pressas, estouro de orçamento e atraso na entrega.

 Próximo Passo
 Entendidos os limites do modelo tradicional, vamos analisar o nosso projeto prático do semestre no próximo capítulo:
 Ir para o Estudo de Caso: Hub Solidário


## Pagina: Estudo de Caso: O Projeto Hub Solidário
(01_Introducao/03_Estudo_de_Caso_Hub_Solidario)

Estudo de Caso: O Projeto Hub Solidário

 Material didático para a disciplina de Gestão de Agilidade e Projetos de Software.
Estudo de caso prático para fundamentação de desenvolvimento ágil.

 Apresentação do Projeto "Hub Solidário"
 Para vivenciar os desafios reais de desenvolvimento de software e aplicação de metodologias ágeis, trabalharemos ao longo do semestre no projeto Hub Solidário .

 Escopo Geral do Hub Solidário
 Uma plataforma inteligente de geolocalização que conecta voluntários a ONGs da região, exibindo chamados solidários, eventos e oportunidades de atuação voluntária em um mapa interativo.

 O Choque de Realidade: O Exercício da Lista Completa
 Ao olhar para os protótipos do Hub Solidário , a tendência inicial da gestão tradicional seria tentar listar de uma só vez todas as tarefas e requisitos necessários antes de escrever a primeira linha de código.
 No entanto, ao tentar detalhar tudo antecipadamente, surgem centenas de perguntas imprevisíveis:

 Como validar a autenticidade e o CNPJ de uma ONG cadastrada?
 Qual serviço de mapas utilizar (Google Maps, OpenStreetMap/Leaflet)?
 Como calcular a distância entre o voluntário e o local do trabalho voluntário?
 O voluntário precisa de autenticação por redes sociais (Google/GitHub)?
 Como funciona o sistema de presença e check-in em eventos comunitários?

 Paralisação por Análise vs Fatiamento Ágil
 Tentar prever e documentar todas essas respostas no primeiro dia gera paralisação por análise (incapacidade de avançar pelo excesso de incertezas).
 A Abordagem Tradicional vs A Abordagem Ágil

 Abordagem
 Estratégia
 Resultado em Software

 Tradicional
 Tentar planejar 100% do app no início
 Bloqueio, documentos desatualizados e atraso

 Ágil
 Fatiar o app em entregas pequenas e funcionais
 Evolução contínua, feedback rápido e código rodando

 A Solução: Organização e Fatiamento no GitHub
 Em vez de tentar engolir o elefante inteiro, fatiamos o Hub Solidário em pequenas partes funcionais (incrementos).
 Cada funcionalidade ou tarefa será cadastrada e gerenciada de forma transparente dentro do ecossistema do GitHub , permitindo que o time evolua o software passo a passo.

 Próximo Passo
 Agora que compreendemos a necessidade de fatiar o projeto, vamos colocar a mão na massa e estruturar o ambiente do Hub Solidário no GitHub:
 Ir para o Setup Prático no GitHub


## Pagina: Setup Prático do Projeto no GitHub
(01_Introducao/04_Setup_do_Projeto_no_GitHub)

Setup Prático do Projeto no GitHub

 Material didático para o laboratório de Gestão de Agilidade e Projetos de Software.
Roteiro prático para criação da Organização, repositórios base e quadro Kanban.

 Passo a Passo Prático
 Nesta aula prática, estruturaremos o ecossistema de desenvolvimento e gestão do projeto Hub Solidário no GitHub.

 Passo: Criando a Organização no GitHub
 Uma GitHub Organization centraliza os repositórios da equipe, os membros do squad e os quadros de projetos.

 Acesse o GitHub e clique no botão de menu do seu perfil no canto superior direito.
 Selecione a opção Your organizations e clique em New organization .
 Escolha o plano Free (Gratuito).
 Defina o nome da organização (exemplo: `hub-solidario-fatec-squad1 ).
 Insira o e-mail de contato e conclua a criação.
 Convide os integrantes da sua equipe como membros da Organização.

 Passo: Inicializando os Repositórios Base
 O projeto do Hub Solidário será estruturado em dois repositórios fundamentais: um para a API (Back-end) e outro para a Aplicação Web (Front-end).
 Repositório Back-end (Python com `uv )
 No terminal do seu computador, crie a pasta do projeto de API e inicialize com o gerenciador `uv :
 ` uv init hub-solidario-api
 cd hub-solidario-api

 Crie o repositório na sua Organização no GitHub com o nome `hub-solidario-api e publique o código base:
 ` git init
 git add .
 git commit -m "chore: commit inicial da API com uv"
 git branch -M main
 git remote add origin https://github.com/SUA-ORGANIZACAO/hub-solidario-api.git
 git push -u origin main

 Repositório Front-end (TypeScript e React com `npm )
 No terminal, em uma pasta paralela, crie a aplicação Web utilizando `npm :
 ` npm create vite@latest hub-solidario-web --template react-ts
 cd hub-solidario-web
 npm install

 Crie o repositório na sua Organização no GitHub com o nome `hub-solidario-web e envie o código:
 ` git init
 git add .
 git commit -m "chore: commit inicial do frontend com npm"
 git branch -M main
 git remote add origin https://github.com/SUA-ORGANIZACAO/hub-solidario-web.git
 git push -u origin main

 Padrões de Mensagens de Commit (Conventional Commits)
 Utilizamos mensagens padronizadas como `chore: , `feat: e `fix: . Para consultar boas práticas e exemplos de mensagens de commit no mercado, acesse o guia de Padrões de Commits .

 Passo: Criando o Primeiro Quadro Kanban no GitHub Projects
 Com a Organização e os repositórios criados, vamos estruturar o gerenciamento visual de tarefas.

 Dentro da página da sua Organização no GitHub , clique na aba Projects .
 Clique no botão New project .
 Selecione o modelo Board (Kanban) e clique em Create .
 Nomeie o projeto como `Hub Solidário - Gestão Geral .
 Verifique a estrutura das colunas padrão do Kanban:
 Todo: Tarefas pendentes a serem iniciadas.
 In Progress: Tarefas em desenvolvimento ativo.
 Done: Tarefas concluídas e integradas.

 Cadastrando as Primeiras Tarefas (Draft Issues)
 No quadro Kanban recém-criado, adicione as primeiras tarefas na coluna Todo para organizar a arrancada do projeto:

 `Configurar ambiente base da API com UV e FastAPI
 `Criar estrutura inicial da aplicação Web com npm e Vite
 `Mapear entidades básicas: Voluntário, ONG e Vaga
 `Pesquisar integração com serviço de mapas (OpenStreetMap / Leaflet)

 Atividade Prática: Do Bloco de Notas para o Kanban

 Objetivo: Converter a lista inicial de requisitos e ideias do projeto Hub Solidário em cartões rascunho ( Draft Issues ) organizados no quadro Kanban da equipe.

 Nesta atividade, a equipe deve recuperar todas as ideias e funcionalidades anotadas no exercício inicial e transformá-las em Draft Issues na coluna `Todo do GitHub Projects .
 Passo a Passo da Atividade:

 Revisar as Anotações: Cada integrante do squad resgata as ideias de funcionalidades mapeadas ao analisar as telas do Hub Solidário (mapa de ONGs, eventos, voluntariado, parceiros, histórico, etc.).
 Cadastrar Draft Issues no Kanban: No quadro Kanban do GitHub Projects, adicione cada funcionalidade como uma Draft Issue no final da coluna `Todo .
 Formatar Títulos Claros: Escreva os títulos das tarefas de maneira simples e direta, descrevendo a ação esperada.

 Exemplo de Conversão de Ideias para Draft Issues

 Anotação Inicial (Bloco de Notas)
 Draft Issue no Kanban

 "O voluntário precisa ver onde tem ONG perto dele"
 `Implementar mapa interativo com marcadores de ONGs

 "Cadastrar as ONGs no sistema"
 `Criar formulário e rota de cadastro de ONGs

 "Ter um calendário de mutirões e doações"
 `Desenvolver tela de calendário de eventos solidários

 "Login para os voluntários"
 `Configurar autenticação de usuários (Voluntários)

 "Exibir parceiros que dão desconto para voluntários"
 `Criar listagem de empresas parceiras e benefícios

 Exercícios de Fixação

 Responda às questões abaixo para verificar a fixação dos tópicos da aula.

Qual é a principal característica que diferencia um Projeto de uma Operação contínua?

* [ ] Um projeto utiliza ferramentas de software, enquanto a operação é feita manualmente.
* [x] Um projeto é um esforço temporário com início, meio e fim definidos para criar um produto único.
* [ ] A operação sempre possui um orçamento maior que o de um projeto.

-->

 #
 Questão 1

 Qual é a principal característica que diferencia um Projeto de uma Operação contínua?

 Um projeto utiliza ferramentas de software, enquanto a operação é feita manualmente. Um projeto é um esforço temporário com início, meio e fim definidos para criar um produto único. A operação sempre possui um orçamento maior que o de um projeto.

No modelo tradicional de gerenciamento de projetos, o que compõe a Tríplice Restrição?

* [x] Escopo, Tempo e Custo.
* [ ] Código, Testes e Documentação.
* [ ] Git, GitHub e VS Code.

-->

 #
 Questão 2

 No modelo tradicional de gerenciamento de projetos, o que compõe a Tríplice Restrição?

 Escopo, Tempo e Custo. Código, Testes e Documentação. Git, GitHub e VS Code.

Por que o modelo Cascata (Waterfall) apresenta altas taxas de falha em desenvolvimento de software?

* [ ] Porque proíbe o uso de gerenciadores de pacotes como npm e UV.
* [x] Porque assume que todos os requisitos podem ser previstos no início, dificultando adaptações a mudanças.
* [ ] Porque exige a criação de uma Organização no GitHub.

-->

 #
 Questão 3

 Por que o modelo Cascata (Waterfall) apresenta altas taxas de falha em desenvolvimento de software?

 Porque proíbe o uso de gerenciadores de pacotes como npm e UV. Porque assume que todos os requisitos podem ser previstos no início, dificultando adaptações a mudanças. Porque exige a criação de uma Organização no GitHub.

Qual é a utilidade do recurso GitHub Projects em um time de desenvolvimento?

* [ ] Compilar o código-fonte da aplicação automaticamente.
* [ ] Armazenar o banco de dados do projeto na nuvem.
* [x] Oferecer um quadro visual (Kanban) para organização, distribuição e acompanhamento de tarefas.

-->

 #
 Questão 4

 Qual é a utilidade do recurso GitHub Projects em um time de desenvolvimento?

 Compilar o código-fonte da aplicação automaticamente. Armazenar o banco de dados do projeto na nuvem. Oferecer um quadro visual (Kanban) para organização, distribuição e acompanhamento de tarefas.

 Progresso do quiz

 0 / 0 questões respondidas
 ( 0% )

 0 correto

 Quiz completo!

 0%

 Reiniciar quiz

 Próximo Passo
 Na próxima aula, aprenderemos a transformar essas ideias e cartões do Kanban em Issues oficiais do GitHub , aplicando os valores e princípios do Manifesto Ágil :
 Ir para o Manifesto Ágil e a Mentalidade Incremental
