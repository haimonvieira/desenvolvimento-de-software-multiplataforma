# Fontes do corpus — BDNR

Inventário dos 21 arquivos em `conhecimento/DSM3/BDNR/`. O corpus é derivado dos
originais em `DSM3/BDNR/`, que **não são alterados**.

## Aulas

| Arquivo no corpus | Original | Tipo | Págs. | Conteúdo | Confiabilidade |
| --- | --- | --- | --- | --- | --- |
| `aula-01.md` | Aula 01 (DOCX) | DOCX | 0 | Modelo relacional, limitações, tipos de dados, origem NoSQL e 4 categorias | Alta |
| `aula-02.md` | Aula 02 (DOCX) | DOCX | 0 | Distribuição, CAP, ACID × BASE, replicação e sharding | Alta |
| `aula-03.md` | Aula 03 (DOCX) | DOCX | 0 | MongoDB, Atlas M0, mongosh e Compass | Alta |
| `aula-04.md` | Aula 04 (DOCX) | DOCX | 0 | insert, find, operadores de comparação e lógicos | Alta |
| `aula-05.md` | Aula 05 (DOCX) | DOCX | 0 | Projeção, sort, skip, update, delete e arrays | Alta |
| `aula-06.md` | Aula 06 (DOCX) | DOCX | 0 | Embedding/referencing, padrões e validação | Alta |
| `aula-07.md` | Aula 07 (DOCX) | DOCX | 0 | Pipeline de agregação | Alta |
| `aula-08.md` | Aula 08 (DOCX) | DOCX | 0 | Índices e `explain` | Alta |

## Avaliação e prática

| Arquivo no corpus | Original | Tipo | Págs. | Conteúdo | Confiabilidade |
| --- | --- | --- | --- | --- | --- |
| `simulado-revisao-bdnr.md` | Simulado (PDF) | PDF | 9 | 10 questões sobre `oficinaDB`, sem gabarito | Média: comandos ausentes e tabelas quebradas |
| `haimon-cugler-vieira-bdnr.md` | Relatório (PDF) | PDF | 8 | `loja_escolar` com comandos e saídas | Alta para as saídas; ambiente com incoerência |
| `atividade-avaliativa-atv2-atv2-n1.md` | ATV2-N1 (DOCX) | DOCX | 0 | Enunciado dos 4 exercícios | Alta |
| `...massa-dados...carga-mongodb.md` | Script de carga | JS | 0 | Carga `lojaTech` (20/12/20) | Alta, mas não idempotente |
| `...massa-dados...leia-me.md` | LEIA-ME | TXT | 0 | Instruções de importação | Alta |
| `...exercicio01.md` | Resolução 1 | TXT | 0 | Catálogo, consultas, projeção, sort e update | Resposta de aluno |
| `...exercicio02.md` | Resolução 2 | TXT | 0 | Clientes, pedidos, embedding, referencing e validação | Resposta de aluno; totais inconsistentes |
| `...exercicio03.md` | Resolução 3 | TXT | 0 | `$unwind`, `$group`, `$sort`, `$limit` e `$lookup` | Resposta de aluno |
| `...exercicio04.md` | Resolução 4 | TXT | 0 | Índice único, composto, `explain` e texto | Resposta de aluno |
| `...modelagem.md` | Modelagem | TXT | 0 | Justificativa e validação | Duplica itens do exercício 2 |

## ATV1

| Arquivo no corpus | Original | Tipo | Págs. | Conteúdo | Confiabilidade |
| --- | --- | --- | --- | --- | --- |
| `atividade-avaliativa-atv1-conectatech-setup-mongodb.md` | Script `conectaTech` | JS | 0 | Carga, demos, pipelines e 3 desafios resolvidos | Média: comentários e projeções com erro |
| `atividade-avaliativa-atv1-techmix-as-text.md` | Massa `techmix` | JSONL | 0 | 16 documentos de produtos | Dados inconsistentes em P005/P006 |
| `atividade-avaliativa-atv2-omp-state-continuity.md` | Checkpoint OMP | MD | 0 | Estado operacional | **Sem conteúdo didático** |

## O que cada fonte responde melhor

- **Teoria NoSQL:** aula-01.
- **CAP, BASE, replicação e sharding:** aula-02.
- **Conexão e ferramentas:** aula-03.
- **CRUD e operadores:** aula-04 e aula-05.
- **Modelagem e validação:** aula-06.
- **Aggregation:** aula-07.
- **Índices:** aula-08.
- **Questões de prova:** simulado.
- **Exemplo com saída:** relatório `loja_escolar`.
- **Prática guiada:** ATV1 e ATV2.

## Lacunas do acervo

- Comandos e sintaxe de Redis, Cassandra e Neo4j.
- Transações multi-documento.
- Backup e restauração.
- Usuários, roles e autenticação além do Atlas.
- Drivers e ODM.
- Aggregation avançada (`$facet`, `$bucket`, `$out`, `$merge`).
- `$regex`, `$exists`, `$elemMatch`, `$size`, `$all`, `upsert`, `arrayFilters`.
- Índices geoespaciais, wildcard, parciais e esparsos.
- GridFS, change streams e time series.
- Gabarito oficial.

## Cuidados de citação

- Cite `conhecimento/DSM3/BDNR/<arquivo>.md` + `§seção` para DOCX/TXT/JS/MD.
- Só use `p. N` em `simulado-revisao-bdnr.md` e
  `haimon-cugler-vieira-bdnr.md`.
- **Nunca invente página** para as aulas.
- `aula-05` tem `$rename` com valor sem aspas; o correto é string.
- `aula-04` usa `.pretty()`, que é do shell legado.
- `aula-08` simplifica o comportamento do índice de texto com acentos.
- O simulado não tem gabarito; Q6–Q9 são derivações e Q10 é irrespondível.
- As resoluções da ATV2 são de aluno; os totais do exercício 2 não fecham.
- A carga não é idempotente; rodar duas vezes duplica dados.
- O `techmix` tem documentos inconsistentes.
- Não altere os arquivos em `DSM3/BDNR/`.
