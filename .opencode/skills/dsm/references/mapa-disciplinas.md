# Mapa das 20 disciplinas

Visão de curadoria. Os números vêm de `conhecimento/_indice/inventario.csv` e
`resumo.json`. "Arquivos" é a quantidade de `.md` efetivamente indexados; "fontes"
inclui originais que podem ter sido deduplicados ou extraídos como vazios.

## Resumo

| Semestre | Disciplinas | Arquivos indexados | Tokens aprox. |
| --- | --- | --- | --- |
| DSM1 | 7 | 61 | ~218 mil |
| DSM2 | 6 | 324 | ~244 mil |
| DSM3 | 7 | 184 | ~169 mil |
| **Total** | **20** | **569** | **~631 mil** |

## Ondas de curadoria

| Onda | Critério | Disciplinas |
| --- | --- | --- |
| 1 | Piloto: disciplina compacta, muitos exercícios e gabarito | **BD2** (pronta) |
| 2 | Corpus pequeno e bem delimitado | MBD, ES1, ES2, MPC, AL, IHC, ING1, DD, SORC1 (**todas prontas**) |
| 3 | Corpus médio ou muito código repetitivo | ALP **pronta**, BDNR **pronta**; faltam DW2, ED1, TP2, DW3, TPI |
| 4 | Corpus grande e fragmentado, exige curadoria manual | PI, GAPS, DW1 |

---

## DSM1

### ALP — Algoritmos e Lógica de Programação (`dsm-alp`) — **pronta**

- **Arquivos:** 28 | **Tokens:** ~35 mil | **Fontes:** 4 PPTX de aula, plano de ensino (PDF, 3 p.), lista 01 (PDF, 2 p.) e pacote VisuAlg 3.0.7 (Help, comandos e listas).
- **Temas:** lógica e raciocínio, etapas de resolução, definição e propriedades de algoritmo, entrada/processamento/saída, descrição narrativa/fluxograma/Portugol, algoritmo × programa, compilação e linkedição, linguagem C (tipos, operadores, `scanf`/`printf`), VisuAlg (vetores, matrizes, `se`, `escolha`, `para`, `enquanto`, `repita`, procedimentos, funções, recursão, funções embutidas).
- **Sinais de busca:** `VisuAlg`, `pseudocódigo`, `Portugol`, `para`, `enquanto`, `repita`, `se`, `vetor`, `matriz`, `procedimento`, `scanf`, `printf`.
- **Cuidado:** só as quatro primeiras aulas viraram slides; condicional, repetição, vetores e matrizes existem apenas no Help do VisuAlg. O Help perdeu acentos na extração — busque sem acento. Nenhum exercício tem gabarito.

### DD — Design Digital (`dsm-dd`) — **pronta**

- **Arquivos:** 9 | **Tokens:** ~22 mil | **Fontes:** aulas em PDF.
- **Temas:** princípios do design, teoria e psicologia das cores, padrões de cor, imagem digital (formatos/resolução), tipografia, identidade visual, prototipação.
- **Sinais:** `cor`, `RGB`, `CMYK`, `tipografia`, `identidade visual`, `protótipo`, `resolução`, `DPI`.
- **Cuidado:** conteúdo visual; o texto extraído não descreve as imagens dos slides.

### DW1 — Desenvolvimento Web I (`dsm-dw1`)

- **Arquivos:** 5 | **Tokens:** ~1,9 mil | **Fontes:** exercícios de HTML/CSS.
- **Temas:** estrutura HTML, contato, produtos, index, assets e CSS, caça-palavras.
- **Sinais:** `HTML`, `CSS`, `tag`, `formulário`, `layout`, `página`.
- **Cuidado:** corpus muito pequeno; cobre exercícios, não a teoria completa. Provavelmente há material faltando.

### ES1 — Engenharia de Software I (`dsm-es1`) — **pronta**

- **Arquivos:** 4 | **Tokens:** ~9,2 mil | **Fontes:** aulas em PDF.
- **Temas:** características de sistemas de informação, processos de software, modelos de processo/SDLC, Canvas.
- **Sinais:** `processo de software`, `SDLC`, `cascata`, `iterativo`, `canvas`, `requisito`.
- **Cuidado:** PDFs de slides; algumas páginas são densas.

### MBD — Modelagem de Banco de Dados (`dsm-mbd`) — **pronta**

- **Arquivos:** 4 | **Tokens:** ~4,7 mil | **Fontes:** aulas em PDF/MD.
- **Temas:** introdução a SGBD, modelos de dados (redes, hierárquico, relacional), clientes/registros.
- **Sinais:** `modelo relacional`, `entidade`, `relacionamento`, `MER`, `SGBD`, `normalização`.
- **Cuidado:** é a disciplina de **modelagem**, não de SQL. Perguntas de SQL vão para BD2.

### PI — Projeto Integrador I (`dsm-pi`)

- **Arquivos:** 4 | **Tokens:** ~81 mil | **Fontes:** artigos científicos e referências.
- **Temas:** metodologia de artigo, visão computacional, IA, emoções em crianças com TEA, referências.
- **Sinais:** `artigo`, `projeto integrador`, `metodologia`, `referência`, `ABNT`, `pesquisa`.
- **Cuidado:** corpus é de **artigos de referência**, não de aula. Não trate como conteúdo didático da disciplina.

### SORC1 — Sistemas Operacionais e Redes de Computadores (`dsm-sorc1`) — **pronta**

- **Arquivos:** 7 | **Tokens:** ~18,5 mil | **Fontes:** PPTX convertidos e curso de Linux.
- **Temas:** tipos de rede, topologias, modelo OSI, TCP/IP, máscara de sub-rede, broadcast, cabos/conectores, crimpagem, racks, Linux.
- **Sinais:** `OSI`, `TCP/IP`, `IP`, `máscara`, `switch`, `rack`, `cabo`, `Linux`.
- **Cuidado:** PPTX extraído como texto; tabelas e diagramas podem ter perdido estrutura.

---

## DSM2

### BD2 — Banco de Dados II (`dsm-bd2`) — **pronta**

- **Arquivos:** 16 | **Tokens:** ~23 mil | **Fontes:** 3 PDFs (23 p.), scripts SQL, DOCX, MD.
- **Temas:** DDL, constraints, INSERT, SELECT/WHERE, ORDER BY/LIMIT, JOIN, funções nativas, stored functions, procedures, triggers, views, GROUP BY/HAVING.
- **Sinais:** `SQL`, `MySQL`, `SELECT`, `JOIN`, `WHERE`, `function`, `procedure`, `trigger`, `view`, `HAVING`.
- **Cuidado:** respostas da N1 têm erros; ver `02-exercicios.md`.

### DW2 — Desenvolvimento Web II (`dsm-dw2`)

- **Arquivos:** 74 | **Tokens:** ~48 mil | **Fontes:** projeto Node/Express, aulas de JS, listas.
- **Temas:** tipos e funções JS, arrays e objetos, classes, introdução a Node.js e Express, atividade.
- **Sinais:** `JavaScript`, `Node`, `Express`, `array`, `objeto`, `classe`, `require`, `rota`.
- **Cuidado:** o projeto completo tem código de aplicação; a curadoria deve priorizar as aulas.

### ED1 — Estrutura de Dados I (`dsm-ed1`)

- **Arquivos:** 27 | **Tokens:** ~19 mil | **Fontes:** aulas, exercícios e código Java.
- **Temas:** bubble sort, selection sort, ordenação recursiva e não recursiva, merge sort, estruturas de dados, exercícios.
- **Sinais:** `ordenação`, `bubble`, `selection`, `merge`, `recursão`, `complexidade`, `vetor`.
- **Cuidado:** há código Java de exercícios; a teoria está em menos arquivos.

### ES2 — Engenharia de Software II (`dsm-es2`) — **pronta**

- **Arquivos:** 2 | **Tokens:** ~6,2 mil | **Fontes:** aulas em PDF.
- **Temas:** estudo de viabilidade, diagrama de classes (UML).
- **Sinais:** `viabilidade`, `diagrama de classes`, `UML`, `classe`, `associação`.
- **Cuidado:** corpus mínimo; o primeiro slide tem cabeçalho copiado de ES1 ("Engenharia de Software I"), mas o conteúdo é ES2.

### MPC — Matemática para Computação (`dsm-mpc`) — **pronta**

- **Arquivos:** 4 | **Tokens:** ~10 mil | **Fontes:** aulas e lista.
- **Temas:** lógica matemática/proposicional, conjuntos, lista do 1º bimestre.
- **Sinais:** `proposição`, `conectivo`, `tabela-verdade`, `conjunto`, `união`, `interseção`.
- **Cuidado:** PPTX convertido; símbolos matemáticos podem ter sido simplificados.

### TPI — Técnicas de Programação I (`dsm-tpi`)

- **Arquivos:** 201 | **Tokens:** ~137 mil | **Fontes:** muitos projetos Java (Calculo*, Forms, CRUD).
- **Temas:** Java, classes, encapsulamento, herança, interfaces, Swing/Forms, CRUD, exercícios.
- **Sinais:** `Java`, `classe`, `objeto`, `herança`, `interface`, `Swing`, `JFrame`, `CRUD`.
- **Cuidado:** volume alto e repetitivo. Buscar por conceito tende a trazer muitos arquivos quase iguais; usar `--limite` e ler o título.

---

## DSM3

### AL — Álgebra Linear (`dsm-al`) — **pronta**

- **Arquivos:** 13 | **Tokens:** ~2,3 mil | **Fontes:** scripts Python e listas.
- **Temas:** vetores, matrizes, autovetores, triangulação, exercícios com matplotlib/numpy.
- **Sinais:** `autovetor`, `autovalor`, `matriz`, `determinante`, `vetor`, `linear`.
- **Cuidado:** corpus é sobretudo código, não aula teórica. Respostas devem apoiar-se no código e explicar a matemática com cuidado.

### BDNR — Banco de Dados Não Relacional (`dsm-bdnr`) — **pronta**

- **Arquivos:** 21 | **Tokens:** ~45 mil | **Fontes:** 8 aulas em DOCX, simulado e relatório em PDF, atividades e scripts.
- **Temas:** NoSQL, CAP, ACID × BASE, replicação e sharding, modelagem de documentos (embedding × referencing), `insertOne`/`insertMany`, `find`, operadores, `updateOne`/`$set`/`$inc`, arrays, validação com `$jsonSchema`, aggregation, índices e `explain`.
- **Sinais:** `MongoDB`, `NoSQL`, `documento`, `coleção`, `insertOne`, `find`, `aggregate`, `índice`.
- **Cuidado:** aulas são DOCX sem paginação — cite a seção. Não há gabarito oficial; as resoluções `exercicio01`–`04` são respostas de aluno. `aula-05` mostra `$rename` sem aspas e `aula-04` usa `.pretty()` do shell legado.

### DW3 — Desenvolvimento Web III (`dsm-dw3`)

- **Arquivos:** 35 | **Tokens:** ~31 mil | **Fontes:** aulas React/Next.js e projeto Arquivo Criminal.
- **Temas:** React, Next.js, CSS modules, API Express + MongoDB, autenticação (Argon2, JWT), modelagem de documentos, TMDB.
- **Sinais:** `React`, `Next`, `componente`, `hook`, `JWT`, `MongoDB`, `API`, `rota`.
- **Cuidado:** metade do corpus é documentação de um projeto específico (Arquivo Criminal), não aula genérica.

### GAPS — Gestão Ágil de Projetos de Software (`dsm-gaps`)

- **Arquivos:** 13 | **Tokens:** ~58 mil | **Fontes:** módulos em Markdown e scripts do notebook.
- **Temas:** introdução, manifesto ágil, Scrum vs Kanban, timeboxing, planejamento, atividades/cronogramas, custos/orçamentos, qualidade.
- **Sinais:** `Scrum`, `Kanban`, `sprint`, `backlog`, `manifesto ágil`, `cronograma`, `orçamento`.
- **Cuidado:** corpus grande e bem estruturado; ignore `index.html`, `init.py`, `pyproject.toml` nas respostas.

### IHC — Interação Humano-Computador (`dsm-ihc`) — **pronta**

- **Arquivos:** 4 | **Tokens:** ~8,9 mil | **Fontes:** aulas em Markdown.
- **Temas:** introdução, affordances, interação/interface/usabilidade, pesquisa de usuário e personas.
- **Sinais:** `IHC`, `affordance`, `usabilidade`, `persona`, `pesquisa de usuário`, `interface`.
- **Cuidado:** só 4 aulas; temas avançados (heurísticas de Nielsen, avaliação) podem não estar no corpus.

### ING1 — Inglês I (`dsm-ing1`) — **pronta**

- **Arquivos:** 2 | **Tokens:** ~600 | **Fontes:** atividade de reading/grammar.
- **Temas:** leitura e gramática em inglês, tecnologia.
- **Sinais:** `inglês`, `reading`, `grammar`, `text`, `technology`.
- **Cuidado:** corpus mínimo; não há aula teórica indexada.

### TP2 — Técnicas de Programação II (`dsm-tp2`)

- **Arquivos:** 96 | **Tokens:** ~24 mil | **Fontes:** exercícios Java.
- **Temas:** exercícios de programação, provavelmente orientação a objetos avançada, coleções e exceções.
- **Sinais:** `Java`, `exercício`, `classe`, `coleção`, `exceção`.
- **Cuidado:** quase todo o corpus é exercício resolvido; a teoria não está explícita. Confirme o tema antes de afirmar.

---

## Como usar este mapa

- Se a disciplina tem skill pronta, carregue a skill e siga o protocolo dela.
- Se está pendente, busque direto no corpus com `--disciplina` e cite o arquivo.
- Se a pergunta atravessa disciplinas (ex.: "modelar e consultar"), separe a
  resposta por disciplina e cite cada fonte.
- Se o tema não aparece no mapa, provavelmente não está indexado; diga isso.
