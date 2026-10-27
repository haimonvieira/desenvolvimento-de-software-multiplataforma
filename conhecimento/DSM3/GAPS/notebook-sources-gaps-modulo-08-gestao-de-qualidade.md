---
disciplina: DSM3/GAPS
titulo: GAPS Modulo 08   Gestao de Qualidade
fonte: DSM3/GAPS/notebook-sources/GAPS-Modulo 08 - Gestao de Qualidade.txt
tipo: txt
paginas: 0
extraido_em: 2026-10-24
---

# Modulo 08 - Gestao de Qualidade
Fonte: https://i-davies.github.io/conteudo-fatec-2026-2/GAPS/08_Gestao_de_Qualidade/


## Pagina: Gestão de Qualidade e a Definição de Pronto (Definition of Done)
(08_Gestao_de_Qualidade/01_Gestao_de_Qualidade_e_Definition_of_Done)

Gestão de Qualidade e a Definição de Pronto (Definition of Done)

 Fundamentos da qualidade no desenvolvimento ágil, a anatomia de uma entrega concluída e a aplicação do Definition of Done (DoD) como contrato de engenharia.

 O Paradoxo do "Quase Pronto" e a Crise da Qualidade
 Em projetos de software tradicionais ou em equipes iniciantes, uma das frases mais frequentes em reuniões de status report é: "A funcionalidade já está 90% pronta, só falta testar e subir para o servidor."
 Essa afirmação revela uma grave ilusão de progresso. Se uma tarefa necessita de testes, correções de bugs, ajustes de banco de dados ou configuração de ambiente para funcionar na mão do usuário, ela não está 90% pronta — ela está incompleta e sem valor entregue .
 `flowchart TD
 subgraph Illusory["A Ilusão do Quase Pronto"]
 I1["Código digitado na máquina local"] --> I2["Falta escrever testes"]
 I2 --> I3["Falta testar com banco real"]
 I3 --> I4["Falta subir no servidor"]
 I4 --> I5["Débito Técnico e Bloqueios em Produção"]
 end

 subgraph RealDone["O Conceito Ágil de Pronto (Done)"]
 D1["Código testado e revisado"] --> D2["CI/CD verde e sem erros"]
 D2 --> D3["Deploy executado no ambiente alvo"]
 D3 --> D4["Critérios de Aceitação e DoD 100% cumpridos"]
 D4 --> D5["Valor Real Disponível para o Usuário"]
 end

 Illusory ~~~ RealDone

 A engenharia de software sintetiza esse fenômeno por meio da Lei de Noventa-Noventa (formulada por Tom Cargill dos Laboratórios Bell):

 A Lei de Noventa-Noventa
 "Os primeiros 90% do código representam os primeiros 90% do tempo de desenvolvimento. Os 10% restantes do código representam os outros 90% do tempo de desenvolvimento."

 Quando a qualidade é tratada como uma etapa separada e tardia no final do projeto (o modelo tradicional em cascata), a equipe acumula débito técnico invisível . O modelo ágil combate essa armadilha estabelecendo que cada incremento de código só pode ser considerado concluído quando atender a um rigoroso padrão de qualidade pré-acordado.

 Gestão de Qualidade em Software Ágil: Qualidade na Origem
 Na agilidade, a qualidade não é um evento que ocorre após o término do desenvolvimento por um time isolado de testadores. A qualidade deve ser incorporada na origem ( Built-in Quality ), fazendo parte de cada commit, Pull Request e entrega incremental.
 `flowchart LR
 subgraph Trad["Modelo Tradicional (Inspeção Tardia)"]
 direction TB
 T1["Desenvolvimento Massivo"] --> T2["Fase Isolada de Testes"]
 T2 --> T3["Descoberta Tardia de Defeitos"]
 T3 --> T4["Retrabalho e Atrasos em Cascata"]
 end

 subgraph Agil["Modelo Ágil (Qualidade Contínua)"]
 direction TB
 A1["Fatias Verticais Pequenas"] --> A2["Testes Automatizados e Linters"]
 A2 --> A3["Revisão por Pares (Code Review)"]
 A3 --> A4["Incremento Pronto e Seguro"]
 end

 Trad ~~~ Agil

 Qualidade Intrínseca vs Qualidade Extrínseca
 Para gerenciar a qualidade de um produto de software de forma eficaz, a squad deve equilibrar duas dimensões complementares:

 Dimensão
 Definição
 Foco Principal
 Como é Validada

 Qualidade Intrínseca (Estrutural)
 Avalia a excelência técnica interna da base de código, arquitetura, manutenibilidade e segurança.
 Desenvolvedores, Tech Leads e Engenharia.
 Linters, formatação padronizada, testes unitários, tipagem estrita e revisões de código (Code Review).

 Qualidade Extrínseca (Funcional e de Negócio)
 Avalia o comportamento do software sob a perspectiva do cliente, facilidade de uso e entrega de valor.
 Usuários Finais, Product Owner (PO) e Product Manager (PM).
 Testes de aceitação, validação de critérios funcionais, testes de usabilidade e métricas de engajamento.

 Os Quatro Pilares do "Pronto" (Done)
 Para eliminar ambiguidades e evitar que código defeituoso chegue à branch principal (`main ), uma entrega ágil deve se sustentar sobre quatro pilares fundamentais:
 `graph TD
 Done["Incremento Concluído (Done)"] --> P1["1. Código Padronizado e sem Erros"]
 Done --> P2["2. Suíte de Testes Automatizados"]
 Done --> P3["3. Execução no Ambiente Alvo"]
 Done --> P4["4. Rastreabilidade e Documentação"]

 P1 --> P1_Desc["Linters, tipagem estrita e ausência de falhas em tempo de execução"]
 P2 --> P2_Desc["Testes unitários e de integração executados com 100% de aprovação"]
 P3 --> P3_Desc["Build reproduzível e aplicação rodando em homologação/produção"]
 P4 --> P4_Desc["Issue vinculada, notas de release e endpoints documentados"]

 Código Padronizado e sem Erros
 O código-fonte deve ser limpo, legível e aderente aos guias de estilo adotados pela equipe:

 Ausência total de erros de compilação ou falhas de sintaxe.
 Conformidade com linters e formatadores automáticos configurados no projeto.
 Tratamento explícito de exceções e respostas adequadas de erros (evitando falhas silenciosas ou quebras inesperadas).
 Nomes de variáveis, funções e componentes que expressam claramente sua intenção de negócio.

 Suíte de Testes Automatizados
 Nenhum código é considerado pronto sem a comprovação automatizada de seu funcionamento:

 Testes unitários cobrindo as regras de negócio e validações críticas da funcionalidade.
 Testes de integração validando a comunicação entre módulos (ex: persistência no banco de dados e rotas HTTP).
 Execução de testes de regressão para assegurar que novas alterações não quebraram funcionalidades legadas preexistentes.

 Execução no Ambiente Alvo
 Uma funcionalidade só cumpre seu papel quando é capaz de executar fora da máquina de quem a programou:

 A aplicação deve construir o artefato de distribuição ( build ) sem erros.
 As variáveis de ambiente necessárias (como strings de conexão com banco de dados e chaves de API) devem estar documentadas no arquivo `.env.example .
 A funcionalidade deve ser validada no ambiente de homologação ( staging ) ou contêiner Docker oficial do projeto, eliminando qualquer dependência de caminhos de arquivos absolutos locais.

 Rastreabilidade e Documentação Técnica
 Para garantir que a evolução do projeto seja transparente e auditável:

 O Pull Request deve estar vinculado formalmente à Issue correspondente no GitHub.
 Endpoints de API novos ou alterados devem ter sua documentação atualizada (ex: schemas e rotas OpenAPI/Swagger).
 Alterações em esquemas de banco de dados devem possuir seus respectivos scripts de migração ( migrations ) devidamente versionados.

 DoR vs Critérios de Aceitação vs DoD: O Guia Definitivo
 Muitas equipes confundem os conceitos de DoR , Critérios de Aceitação e DoD . Embora todos sirvam como instrumentos de controle de qualidade, eles atuam em etapas distintas do fluxo de valor:
 `flowchart LR
 Backlog["Product Backlog"] -->|Atende ao DoR| Ready["Sprint Planning / To Do"]
 Ready -->|Em Desenvolvimento| InProgress["In Progress"]
 InProgress -->|Cumpre Critérios de Aceitação + DoD| Done["Incremento Pronto (Done)"]

 Instrumento
 O que é?
 Quem define?
 Escopo de Aplicação
 Momento de Aplicação

 DoR ( Definition of Ready )
 Critérios mínimos para que um item do Backlog possa ser planejado e iniciado.
 PO em conjunto com a Squad.
 Por tarefa no Backlog.
 Antes de puxar a Issue para o Sprint Backlog.

 Critérios de Aceitação ( Acceptance Criteria )
 Regras funcionais e cenários de negócio específicos de uma funcionalidade particular.
 Product Owner (PO) com apoio da Squad.
 Específico para cada Issue individual.
 Durante o desenvolvimento e na validação funcional do recurso.

 DoD ( Definition of Done )
 Conjunto universal de padrões técnicos e de engenharia aplicáveis a todas as entregas.
 Toda a Squad e Tech Lead.
 Global (aplica-se a 100% dos Pull Requests e tarefas).
 Antes de aprovar o PR, realizar o merge e mover o card para a coluna Done .

 Estudo de Caso no Hub Solidário: As Três Camadas em Ação
 Para visualizar como DoR, Critérios de Aceitação e DoD operam juntos em um cenário real, analise a implementação da funcionalidade de Cadastro de Voluntários no projeto Hub Solidário:
 `graph TD
 subgraph DoR_Box["1. Definition of Ready (Entrada)"]
 R1["História de Usuário no formato padrão"]
 R2["Campos obrigatórios detalhados"]
 R3["Estimativa em Story Points definida (3 pts)"]
 end

 subgraph AC_Box["2. Critérios de Aceitação (Regra de Negócio Específica)"]
 C1["CPF deve ser validado pelo algoritmo oficial"]
 C2["E-mail duplicado retorna status HTTP 409 Conflict"]
 C3["Senha deve possuir no mínimo 8 caracteres"]
 end

 subgraph DoD_Box["3. Definition of Done (Padrão Universal de Engenharia)"]
 D1["Linter e formatação executados sem warnings"]
 D2["Testes automatizados unitários e de integração aprovados"]
 D3["Pull Request revisado e aprovado por outro desenvolvedor"]
 D4["Branch sincronizada com a 'main' sem conflitos"]
 D5["Issue vinculada com fechamento automático (Closes #Issue)"]
 end

 DoR_Box --> AC_Box --> DoD_Box

 Se faltar o DoR: A equipe inicia o desenvolvimento sem saber quais campos são obrigatórios, gerando retrabalho constante.
 Se faltar o Critério de Aceitação: O desenvolvedor cria uma tela que salva qualquer texto no campo de CPF, falhando na regra de negócio do cliente.
 Se faltar o DoD: O código até valida o CPF, mas é mesclado com arquivos quebrados, sem testes automatizados e sem revisão por pares, derrubando o ambiente de homologação.

 A Matriz de Níveis de DoD
 O rigor do Definition of Done pode ser estruturado em camadas para acompanhar a evolução do ciclo de vida do software:
 `flowchart TD
 subgraph Level1["Nível 1: DoD de Pull Request / Tarefa"]
 L1_1["Código compilando sem erros"]
 L1_2["Linter e regras de tipagem 100% aprovados"]
 L1_3["Testes unitários cobrindo o código novo"]
 L1_4["Pelo menos 1 aprovação formal de Code Review"]
 end

 subgraph Level2["Nível 2: DoD de Sprint / Incremento"]
 L2_1["Integração contínua (CI) com build verde"]
 L2_2["Testes de integração e rotas de API validados"]
 L2_3["Deploy executado com sucesso no ambiente de Homologação"]
 L2_4["Demonstração funcional aprovada pelo PO na Sprint Review"]
 end

 subgraph Level3["Nível 3: DoD de Release / Produção"]
 L3_1["Testes de regressão ponta a ponta (E2E)"]
 L3_2["Auditoria de segurança e vulnerabilidade de dependências"]
 L3_3["Documentação técnica e OpenAPI/Swagger atualizadas"]
 L3_4["Deploy monitorado em Produção com métricas de saúde ativas"]
 end

 Level1 --> Level2 --> Level3

 O Custo Exponencial de Correção de Defeitos
 Por que as equipes ágeis investem tanto rigor na Definição de Pronto desde o primeiro Pull Request? A resposta reside na Curva de Custo da Mudança e Correção de Defeitos (estudo clássico de Barry Boehm):
 `xychart-beta
 title "Custo Relativo para Correção de um Defeito de Software"
 x-axis ["Durante a Codificação", "No Code Review (PR)", "Nos Testes de CI / Staging", "Após Deploy em Produção"]
 y-axis "Custo Relativo (Multiplicador)" 1 --> 100
 line [1, 5, 20, 100]

 Fase de Descoberta
 Multiplicador de Custo
 Impacto Operacional

 Na máquina do desenvolvedor (Codificação)
 1x
 O próprio desenvolvedor detecta a falha via linter ou teste unitário local e corrige em segundos.

 No Pull Request (Code Review)
 5x
 O revisor aponta o erro no GitHub; exige um commit adicional de ajuste antes da aprovação.

 No ambiente de Homologação / CI
 20x
 O build quebra; exige nova branch, novo ciclo de testes e revalidação do pipeline.

 Em Produção (Usuário Real)
 100x+
 Queda de serviço, perda de dados de voluntários, abertura de incidentes de suporte urgente, dano à reputação da organização e necessidade de hotfixes emergenciais sob estresse.

 Qualidade é Mais Barata que o Retrabalho
 Manter um Definition of Done rigoroso não torna o time mais lento; pelo contrário, elimina o tempo desperdiçado consertando bugs em produção e refazendo códigos mal estruturados.

 Próximo Passo
 Agora que você compreende os fundamentos de gestão de qualidade e a importância do Definition of Done, avance para o laboratório prático para configurar templates e auditar Pull Requests como um Tech Lead:
 Ir para o Laboratório: Auditoria de Pull Requests e Revisão de Código


## Pagina: Laboratório: Auditoria de Pull Requests e Revisão de Código
(08_Gestao_de_Qualidade/02_Auditoria_de_PRs_e_Revisao_de_Codigo)

Laboratório: Auditoria de Pull Requests e Revisão de Código

 Guia prático para auditoria técnica de Pull Requests, aplicação de checklists de DoD, revisão de código entre pares e validação de Issues no ecossistema GitHub.

 O Papel do Tech Lead e a Governança Técnica
 Em uma equipe ágil de desenvolvimento de software, o Tech Lead (Líder Técnico) atua como o principal guardião da integridade arquitetural, dos padrões de engenharia e da sustentabilidade da base de código.
 Enquanto o Product Owner (PO) foca no valor de negócio e no cumprimento das necessidades do usuário, o Tech Lead assegura que as soluções implementadas sejam tecnicamente sólidas, seguras, testáveis e aderentes à Definição de Pronto (DoD).
 `flowchart TD
 subgraph SquadGovernance["Governança de Engenharia na Squad"]
 PO["Product Owner (PO) Garante o Valor de Negócio"]
 TL["Tech Lead / Revisores Garante a Excelência Técnica"]
 Dev["Desenvolvedor(a) Implementa a Fatia Vertical"]
 end

 Dev -->|"Abre Pull Request"| PR["Pull Request no GitHub"]
 PR -->|"Audita DoD, Testes e Arquitetura"| TL
 PR -->|"Valida Critérios Funcionais"| PO
 TL -->|"Aprovação Técnica"| Merge["Merge na Branch main"]
 PO -->|"Validação da Entrega"| Done["Issue Fechada (Done)"]

 O Perigo do "LGTM" sem Revisão
 Uma das práticas mais nocivas em times de engenharia é a aprovação automática de Pull Requests sem uma leitura aprofundada do código (conhecida como LGTM - "Looks Good To Me" superficial).
 Aprovar PRs sem auditar:

 Permite a entrada de falhas de segurança e vazamento de credenciais na branch principal.
 Introduz débitos técnicos invisíveis que tornam manutenções futuras lentas e custosas.
 Propaga más práticas de arquitetura por toda a equipe.
 Reduz a confiança nos pipelines de integração contínua (CI/CD).

 Anatomia de um Pull Request: O Inadequado vs O Auditável
 A qualidade de um Pull Request reflete diretamente a maturidade de engenharia da equipe. Analise a comparação abaixo entre dois cenários reais no projeto Hub Solidário :
 `flowchart TD
 subgraph BadPR["Pull Request Inadequado (Rejeitado)"]
 direction TB
 B1["Título: 'ajustes no back'"]
 B2["Sem descrição e sem vínculo com Issue"]
 B3["50 arquivos alterados (mistura front, back e .env)"]
 B4["Sem testes e sem evidências de execução"]
 end

 subgraph GoodPR["Pull Request Auditável (Aprovado)"]
 direction TB
 G1["Título: 'feat(api): endpoint de busca de voluntários'"]
 G2["Vínculo explícito: 'Closes #24'"]
 G3["Diff atômico e focado apenas no recurso"]
 G4["Checklist de DoD assinalado e prints/JSON anexados"]
 end

 BadPR ~~~ GoodPR

 Elemento
 Pull Request Inadequado
 Pull Request Exemplar e Auditável

 Título
 `correcoes , `ajustes finais , `wip
 `feat(api): adiciona rota de listagem de campanhas ou `fix(web): corrige mascara de telefone no cadastro

 Rastreabilidade
 Sem menção a Issues ou cartões do quadro.
 Contém a amarração formal de fechamento: `Closes #18 ou `Fixes #35 .

 Descrição
 Vazia ou com frases monossilábicas ( "código pronto" ).
 Explica o contexto da mudança, decisões arquiteturais tomadas e instruções de teste.

 Tamanho do Diff
 Gigantesco (+1500 linhas), contendo arquivos irrelevantes como `node_modules , `.env ou binários.
 Pequeno e atômico (idealmente < 300 linhas), contendo exclusivamente o código necessário para a funcionalidade.

 Evidências
 Nenhuma evidência de que o código foi executado.
 Capturas de tela da interface web, respostas JSON do Thunder Client/cURL ou logs de testes automatizados.

 Checklist DoD
 Inexistente.
 Checklist técnico preenchido confirmando linters, testes e conformidade de ambiente.

 Padronização com Templates de Pull Request no GitHub
 Para garantir que todos os desenvolvedores sigam o mesmo padrão de qualidade ao abrir contribuições, o GitHub permite configurar um Template de Pull Request .
 Ao criar um arquivo no caminho `.github/pull_request_template.md na raiz do repositório, o GitHub preenche automaticamente a descrição de qualquer novo PR com a estrutura definida.
 Exemplo de Template Oficial de Pull Request
 ` ## Tipo de Alteração

 - [ ] Nova funcionalidade ( `feat` )
 - [ ] Correção de bug ( `fix` )
 - [ ] Refatoração ou melhoria técnica ( `refactor` )
 - [ ] Atualização de documentação ( `docs` )

 ## Issue Relacionada

 Closes #<!-- Número da Issue aqui, ex: Closes #42 -->

 ## Descrição das Alterações

 <!-- Descreva de forma concisa o que foi desenvolvido ou corrigido nesta entrega -->
 - Implementado endpoint `GET /voluntarios` com suporte a filtros por habilidade.
 - Adicionada validação de paginação (limite máximo de 50 registros por página).

 ## Checklist da Definição de Pronto (DoD)

 - [ ] O código foi compilado/executado sem erros ou warnings no console.
 - [ ] Formatadores e linters foram executados com sucesso.
 - [ ] Testes unitários/integração foram criados ou atualizados e estão passando.
 - [ ] Não há dados sensíveis (senhas, chaves de API, `.env` ) incluídos nos commits.
 - [ ] A documentação da API / README foi atualizada se aplicável.

 ## Evidências de Teste

 <!-- Anexe capturas de tela (para frontend) ou payloads JSON de resposta (para backend) -->

 ```json
 {
 "total" : 1 ,
 "voluntarios" : [
 {
 "id" : 1 ,
 "nome" : "Maria Silva" ,
 "habilidade" : "Logística"
 }
 ]
 }
 ```

 O Checklist de Auditoria do Tech Lead
 Ao inspecionar um Pull Request aberto por uma squad, o auditor técnico deve seguir cinco etapas rigorosas de validação:
 `flowchart TD
 Step1["1. Rastreabilidade com a Issue"] --> Step2["2. Higiene do Git e Diff Atômico"]
 Step2 --> Step3["3. Qualidade de Código e Tipagem"]
 Step3 --> Step4["4. Suíte de Testes e Evidências"]
 Step4 --> Step5["5. Parecer Técnico (Approve ou Request Changes)"]

 Rastreabilidade com a Issue

 O PR possui a palavra-chave de fechamento vinculada à Issue (`Closes #ID )?
 O código entregue resolve exatamente o escopo definido na História de Usuário e nos Critérios de Aceitação da Issue?
 Não há funcionalidades extras ("caronas") que não foram discutidas no planejamento?

 Higiene do Git e Diff Atômico

 O nome da branch de origem segue o padrão semântico (`feature/nome-da-tarefa , `fix/nome-do-bug )?
 Não existem arquivos indesejados no diff (como arquivos `.DS_Store , `.env , diretórios `dist/ ou `__pycache__ )?
 As mensagens de commit são claras e expressam a evolução das alterações?

 Qualidade de Código e Tipagem

 A tipagem (TypeScript / Python type hints) foi aplicada de forma estrita, evitando tipos genéricos permissivos (como `any no TypeScript)?
 As variáveis e funções possuem nomes legíveis que dispensam comentários óbvios?
 Foram removidos todos os `console.log , `print de depuração ou trechos de código comentados?
 Há tratamento defensivo de erros com status HTTP semânticos (ex: 400 para dados inválidos, 404 para recursos não localizados, 409 para conflitos)?

 Suíte de Testes e Evidências

 O autor do PR forneceu capturas de tela ou logs demonstrando o funcionamento da funcionalidade?
 Os testes unitários cobrem tanto o fluxo de sucesso ( happy path ) quanto os fluxos de exceção/validação?
 O pipeline de integração contínua (se configurado) concluiu com status verde?

 Parecer Técnico e Condução de Feedback
 Ao revisar o código na aba Files changed do GitHub, o revisor deve utilizar comentários específicos de linha e selecionar uma das três ações formais:
 `flowchart LR
 Review["Revisão de Código na Aba 'Files changed'"] --> Comment["Comment (Dúvida ou sugestão não bloqueante)"]
 Review --> ReqChanges["Request Changes (Bloqueio obrigatório por quebra de DoD)"]
 Review --> Approve["Approve (Atendeu 100% dos critérios do DoD)"]

 Comunicação Construtiva em Code Reviews
 O objetivo do Code Review não é apontar culpados, mas sim elevar o padrão técnico da squad. Seja específico em suas observações: em vez de dizer "código ruim" , explique: "Esta consulta pode gerar um problema de N+1 no banco de dados. Sugiro utilizar um JOIN ou Include para buscar os relacionamentos em lote."

 Roteiro de Laboratório Prático para as Squads
 Para experimentar na prática o ciclo completo de controle de qualidade, identificação de débitos técnicos e auditoria de Pull Requests, as squads utilizarão o repositório oficial de testes automatizados como base prática:

 Repositório Base: https://github.com/i-davies/Testes-Automatizados

 Este projeto contém uma aplicação real em Python com testes automatizados utilizando o framework `pytest e um arquivo de workflow de CI pré-existente (`.github/workflows/ci.yml ).
 Como muitos desenvolvedores nunca tiveram contato prévio com testes automatizados, exploraremos primeiro o funcionamento dos testes locais e do CI existente. Em seguida, identificaremos uma falha de Definição de Pronto (DoD): a ausência de verificação estática de código (linter local) e a falta de uma etapa de linter no pipeline de CI existente .
 `flowchart TD
 E1["1. Clone/Fork do Repositório e Execução dos Testes"] --> E2["2. Identificação do Débito e Criação da Issue no GitHub"]
 E2 --> E3["3. Criação da Branch, Instalação do Ruff e Ajuste do CI Existente"]
 E3 --> E4["4. Abertura do Pull Request Estruturado com Template"]
 E4 --> E5["5. Auditoria Técnica do Tech Lead e Merge Automatizado"]

 Atividade Prática: Fork/Importação do Projeto e Primeiro Contato com Testes

 Acesse o repositório base https://github.com/i-davies/Testes-Automatizados .
 Crie um Fork do repositório para a organização ou conta da sua squad no GitHub (ou clone e suba na branch `main do repositório da equipe).
 Clone o repositório da sua squad na sua máquina local:
 ` git clone https://github.com/sua-organizacao/Testes-Automatizados.git
 cd Testes-Automatizados

 Sincronize o ambiente e instale as dependências com o gerenciador `uv :
 ` uv sync

 Execute a suíte de testes automatizados pela primeira vez no terminal:
 ` uv run pytest -v

 Observe o resultado: o Pytest executa cada função de teste em milissegundos, verificando regras de negócio e asserções sem intervenção manual.
 Abra o arquivo `.github/workflows/ci.yml existente e observe que ele já possui jobs para execução de testes (`test-unit , `test-integration , `test-e2e ), mas não executa nenhuma checagem de linter ou formatação .

 Atividade Prática: Identificação de Débito Técnico e Abertura de Issue
 Embora o repositório possua testes automatizados e um workflow de CI funcional, ele carece de padronização de formatação (linter) local e não valida regras estáticas de código no GitHub Actions. Para corrigir essa falha de governança:

 Acesse o repositório da squad no GitHub e vá para a aba Issues .
 Crie uma nova Issue para registrar a demanda técnica:
 Título: `Adicionar Linter (Ruff) e Ajustar Pipeline de CI Existente
 Etiquetas (Labels): `quality , `backend , `ci/cd
 Descrição da Issue:
 ` ### Contexto e Motivação
 O projeto possui testes automatizados via Pytest e um workflow de CI existente no GitHub Actions,
 mas não possui linter configurado localmente nem etapa de verificação estática no pipeline.

 ### Critérios de Aceitação / DoD da Issue
 - [ ] Adicionar o linter `ruff` nas dependências de desenvolvimento do projeto.
 - [ ] Executar checagem e formatação com Ruff localmente sem erros.
 - [ ] Ajustar o arquivo `.github/workflows/ci.yml` existente, adicionando o job de `lint` antes dos testes.
 - [ ] Criar o template de Pull Request em `.github/pull_request_template.md` .
 - [ ] Abrir Pull Request vinculando esta Issue e validar a execução do pipeline completo.

 No repositório, crie o arquivo `.github/pull_request_template.md na branch `main com o modelo oficial apresentado anteriormente e envie para o GitHub.

 Atividade Prática: Criação de Feature Branch, Linter e Ajuste do CI

 Na sua máquina local, certifique-se de estar na branch `main atualizada e crie a branch de trabalho:
 ` git checkout main
 git pull origin main
 git checkout -b feature/ajuste-linter-ci

 Adicione o linter e formatador Ruff às dependências de desenvolvimento do projeto:
 ` uv add --dev ruff

 Execute o linter localmente para verificar a saúde do código:
 ` # Executa a checagem estática de regras de código
 uv run ruff check .

 # Executa a checagem de formatação de código
 uv run ruff format --check .

 Abra o arquivo `.github/workflows/ci.yml existente e ajuste-o, inserindo o job de `lint e definindo que os jobs de testes dependam da aprovação do linter ( fail-fast ):

 ` name : CI

 on :
 push :
 branches : [ main ]
 pull_request :
 branches : [ main ]

 jobs :
 lint :
 runs-on : ubuntu-latest
 steps :
 - name : Checkout do Repositório
 uses : actions/checkout@v4

 - name : Configurar Python
 uses : actions/setup-python@v5
 with :
 python-version : "3.12"

 - name : Instalar Ruff
 run : pip install ruff

 - name : Executar Checagem de Linter
 run : ruff check .

 - name : Executar Checagem de Formatação
 run : ruff format --check .

 test-unit :
 needs : lint
 runs-on : ubuntu-latest
 steps :
 - uses : actions/checkout@v4
 - uses : actions/setup-python@v5
 with :
 python-version : "3.12"
 - run : pip install -r requirements.txt
 - run : pytest tests/test_unit.py -v -x

 test-integration :
 needs : test-unit
 runs-on : ubuntu-latest
 steps :
 - uses : actions/checkout@v4
 - uses : actions/setup-python@v5
 with :
 python-version : "3.12"
 - run : pip install -r requirements.txt
 - run : pytest tests/test_integration.py -v -x

 test-e2e :
 needs : test-integration
 runs-on : ubuntu-latest
 steps :
 - uses : actions/checkout@v4
 - uses : actions/setup-python@v5
 with :
 python-version : "3.12"
 - run : pip install -r requirements.txt
 - run : playwright install --with-deps chromium
 - run : xvfb-run pytest tests/test_ui.py -v -x

 Adicione as alterações ao Git e realize os commits semânticos:
 ` git add pyproject.toml uv.lock .github/workflows/ci.yml
 git commit -m "feat(ci): adiciona linter ruff e atualiza pipeline existente do github actions"
 git push -u origin feature/ajuste-linter-ci

 Atividade Prática: Abertura do Pull Request Estruturado

 Acesse o GitHub. O repositório exibirá o aviso sugerindo a abertura do Pull Request para a branch `feature/ajuste-linter-ci .
 Clique em Compare & pull request .
 O GitHub carregará automaticamente o template Markdown.
 Preencha os campos obrigatórios:
 Título: `feat: adiciona linter ruff e ajusta pipeline de ci existente
 Issue Relacionada: `Closes #1 (ou o número da Issue criada no passo anterior).
 Descrição: Detalhe a inclusão do Ruff e o ajuste no arquivo `.github/workflows/ci.yml existente.
 Checklist de DoD: Marque as caixas de verificação confirmando a execução local do `ruff e do `pytest .
 Evidências: Anexe o log do terminal demonstrando a execução do `uv run ruff check . e `uv run pytest -v .
 Clique em Create pull request .
 Observe a aba inferior do PR: o GitHub Actions iniciará automaticamente o pipeline `CI com o novo job de `lint executando em primeiro lugar.

 Atividade Prática: Auditoria Técnica (Tech Lead) e Merge Automatizado

 Convide um colega da squad para atuar como Tech Lead Auditor deste Pull Request.
 O auditor deve acessar o Pull Request e verificar os seguintes pontos:
 Status Checks: O pipeline do GitHub Actions executou com sucesso (incluindo o novo job `lint ) e está com o status verde?
 Rastreabilidade: A Issue `#1 está devidamente vinculada no texto com `Closes #1 e aparece na barra lateral ( Linked issues )?
 Diff de Código: Na aba Files changed , inspecione o arquivo `.github/workflows/ci.yml e o `pyproject.toml .
 O Tech Lead deve deixar pelo menos um comentário construtivo em uma linha de código do workflow ajustado.
 Caso todos os critérios de qualidade e DoD estejam atendidos, o Tech Lead clica em Review changes , seleciona `Approve e submete a aprovação.
 O autor ou Tech Lead executa o Merge pull request e confirma.
 Acesse a aba Issues ou o quadro do GitHub Projects e comprove que a Issue foi fechada automaticamente pelo GitHub.

 Exercícios de Fixação

 Responda às questões abaixo para verificar a assimilação dos conceitos de auditoria técnica, Definition of Done, Code Review e governança no GitHub.

Qual é a finalidade principal do comando 'Closes #42' colocado no corpo da descrição de um Pull Request no GitHub?
* [ ] Deletar permanentemente o repositório remoto caso o código contenha falhas.
* [x] Vincular formalmente o Pull Request à Issue número 42, promovendo rastreabilidade e fechando a Issue automaticamente assim que o PR for mesclado na branch principal.
* [ ] Notificar o Product Owner por mensagem SMS de que o código foi iniciado.
* [ ] Impedir que qualquer desenvolvedor execute commits na branch de funcionalidade.

-->

 #
 Questão 1

 Qual é a finalidade principal do comando 'Closes #42' colocado no corpo da descrição de um Pull Request no GitHub?

 Deletar permanentemente o repositório remoto caso o código contenha falhas. Vincular formalmente o Pull Request à Issue número 42, promovendo rastreabilidade e fechando a Issue automaticamente assim que o PR for mesclado na branch principal. Notificar o Product Owner por mensagem SMS de que o código foi iniciado. Impedir que qualquer desenvolvedor execute commits na branch de funcionalidade.

Durante a auditoria de um Pull Request, o Tech Lead identifica que o desenvolvedor utilizou 'any' em múltiplos pontos do TypeScript, deixou chamadas de 'console.log' no código e não anexou evidências de teste. Qual deve ser a conduta do Tech Lead?
* [ ] Aprovar o Pull Request imediatamente para não atrasar a velocidade da squad.
* [ ] Deletar a branch do desenvolvedor sem fornecer qualquer explicação.
* [x] Deixar comentários construtivos nas linhas afetadas, submeter a revisão como 'Request changes' e orientar o autor a corrigir a tipagem, remover os logs e anexar os testes antes de uma nova avaliação.
* [ ] Fazer o merge na branch main e corrigir os erros pessoalmente em produção no fim de semana.

-->

 #
 Questão 2

 Durante a auditoria de um Pull Request, o Tech Lead identifica que o desenvolvedor utilizou 'any' em múltiplos pontos do TypeScript, deixou chamadas de 'console.log' no código e não anexou evidências de teste. Qual deve ser a conduta do Tech Lead?

 Aprovar o Pull Request imediatamente para não atrasar a velocidade da squad. Deletar a branch do desenvolvedor sem fornecer qualquer explicação. Deixar comentários construtivos nas linhas afetadas, submeter a revisão como 'Request changes' e orientar o autor a corrigir a tipagem, remover os logs e anexar os testes antes de uma nova avaliação. Fazer o merge na branch main e corrigir os erros pessoalmente em produção no fim de semana.

Qual é a principal diferença entre os Critérios de Aceitação de uma História de Usuário e a Definição de Pronto (Definition of Done - DoD)?
* [ ] Os Critérios de Aceitação são definidos pelos desenvolvedores, enquanto o DoD é escrito pelo cliente final.
* [x] Os Critérios de Aceitação especificam regras funcionais e comportamentos exclusivos de uma funcionalidade particular, enquanto o DoD é um acordo universal de qualidade técnica que toda e qualquer tarefa deve cumprir.
* [ ] O DoD só se aplica a projetos tradicionais em cascata, enquanto os Critérios de Aceitação só existem no Kanban.
* [ ] Não há diferença alguma; ambos os termos são sinônimos exatos para estimativa de Story Points.

-->

 #
 Questão 3

 Qual é a principal diferença entre os Critérios de Aceitação de uma História de Usuário e a Definição de Pronto (Definition of Done - DoD)?

 Os Critérios de Aceitação são definidos pelos desenvolvedores, enquanto o DoD é escrito pelo cliente final. Os Critérios de Aceitação especificam regras funcionais e comportamentos exclusivos de uma funcionalidade particular, enquanto o DoD é um acordo universal de qualidade técnica que toda e qualquer tarefa deve cumprir. O DoD só se aplica a projetos tradicionais em cascata, enquanto os Critérios de Aceitação só existem no Kanban. Não há diferença alguma; ambos os termos são sinônimos exatos para estimativa de Story Points.

O que caracteriza um Pull Request atômico e de alta qualidade técnica?
* [ ] Um PR que altera mais de 2.000 linhas de código misturando backend, frontend, infraestrutura e formatação em um único bloco.
* [x] Um PR com escopo focado e delimitado, com diff enxuto, commits semânticos, testes automatizados correspondentes e descrição técnica detalhada.
* [ ] Um PR aberto diretamente na branch main sem utilizar branch de funcionalidade intermediária.
* [ ] Um PR que não possui nenhum teste unitário para economizar tempo de execução no pipeline.

-->

 #
 Questão 4

 O que caracteriza um Pull Request atômico e de alta qualidade técnica?

 Um PR que altera mais de 2.000 linhas de código misturando backend, frontend, infraestrutura e formatação em um único bloco. Um PR com escopo focado e delimitado, com diff enxuto, commits semânticos, testes automatizados correspondentes e descrição técnica detalhada. Um PR aberto diretamente na branch main sem utilizar branch de funcionalidade intermediária. Um PR que não possui nenhum teste unitário para economizar tempo de execução no pipeline.

Onde deve ser posicionado o arquivo de template de Pull Request no repositório do GitHub para que ele seja carregado automaticamente na abertura de novas contribuições?
* [ ] Na pasta 'node_modules/templates/pr.html'.
* [ ] No diretório 'src/controllers/pull_request.ts'.
* [x] No caminho '.github/pull_request_template.md' na raiz do projeto.
* [ ] No arquivo de configuração '.env' do servidor.

-->

 #
 Questão 5

 Onde deve ser posicionado o arquivo de template de Pull Request no repositório do GitHub para que ele seja carregado automaticamente na abertura de novas contribuições?

 Na pasta 'node_modules/templates/pr.html'. No diretório 'src/controllers/pull_request.ts'. No caminho '.github/pull_request_template.md' na raiz do projeto. No arquivo de configuração '.env' do servidor.

 Progresso do quiz

 0 / 0 questões respondidas
 ( 0% )

 0 correto

 Quiz completo!

 0%

 Reiniciar quiz
