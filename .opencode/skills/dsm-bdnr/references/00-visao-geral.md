# Visão geral — BDNR (DSM3/BDNR)

## O que o material cobre

O corpus tem **21 arquivos**, quase todos em texto (`.docx` convertido, `.txt`,
`.js` e `.md`), com **2 PDFs**. A sequência é explícita: 8 aulas numeradas, um
simulado, um relatório e duas atividades avaliativas.

| Bloco | Arquivos | Papel |
| --- | --- | --- |
| Teoria | `aula-01` a `aula-08` | Conteúdo principal, em ordem |
| Avaliação | `simulado-revisao-bdnr.md` | 10 questões sobre `oficinaDB` |
| Prática | `haimon-cugler-vieira-bdnr.md` | Relatório com comandos e saídas reais |
| ATV1 | `atividade-avaliativa-atv1-*` | Script `conectaTech` e massa `techmix` |
| ATV2 | `atividade-avaliativa-atv2-*` + `exercicio01`–`04` | Enunciado, carga e resoluções |

## Sequência didática que o corpus revela

| Ordem | Tema | Onde está |
| --- | --- | --- |
| 1 | Modelo relacional, PK/FK, normalização e limitações | aula-01, §1–2 |
| 2 | Dados estruturados, semiestruturados e não estruturados | aula-01, §3 |
| 3 | Origem do NoSQL e as quatro categorias | aula-01, §4 |
| 4 | Sistemas distribuídos, CAP, ACID × BASE, replicação e sharding | aula-02 |
| 5 | MongoDB, Atlas M0, mongosh e Compass | aula-03 |
| 6 | Inserção e consulta com operadores | aula-04 |
| 7 | Projeção, sort, paginação, update e delete | aula-05 |
| 8 | Embedding × referencing, padrões e validação | aula-06 |
| 9 | Pipeline de agregação | aula-07 |
| 10 | Índices e `explain` | aula-08 |
| 11 | Simulado integrador `oficinaDB` | simulado, p. 1–9 |
| 12 | Prática `loja_escolar` com saídas | relatório, p. 1–8 |

## Progressão de dificuldade

1. **Conceito** (aulas 01–02): por que NoSQL existe, o que se ganha e o que se
   perde.
2. **Ferramenta** (aula 03): criar conta, conectar, navegar.
3. **CRUD** (aulas 04–05): insert, find, update, delete.
4. **Modelagem** (aula 06): a decisão mais importante de um banco de documentos.
5. **Análise** (aula 07): aggregation.
6. **Desempenho** (aula 08): índices.

## O que o corpus NÃO cobre

- Comandos ou sintaxe de Redis, Cassandra e Neo4j.
- Transações multi-documento e `withTransaction`.
- Backup e restauração (`mongodump`, `mongorestore`, `mongoexport`).
- Criação de usuários, roles e autenticação além do usuário do Atlas.
- Drivers de aplicação (Node.js, Python) e ODM (Mongoose).
- Aggregation avançada: `$facet`, `$bucket`, `$out`, `$merge`, `$lookup` com
  pipeline, `$addFields`.
- Operadores `$regex`, `$exists`, `$elemMatch`, `$size`, `$all`, `upsert`,
  `arrayFilters`.
- Índices geoespaciais (só menção), wildcard, parciais e esparsos.
- GridFS, change streams e time series.
- Migração estruturada de SQL para MongoDB.
- Gabarito oficial de qualquer exercício.

## Como estudar por este material

1. Saiba explicar **por que** o relacional não basta (junções, rigidez,
   descasamento objeto-relacional).
2. Associe cada categoria NoSQL a um produto e a um caso de uso.
3. Entenda CAP como escolha sob partição, não como "escolha dois de três".
4. Pratique CRUD no `mongosh`, digitando os comandos.
5. Decore a diferença entre `$set`, `$inc`, `$unset` e `$rename`.
6. Treine a decisão embedding × referencing com o critério de acesso conjunto e
   limite de 16 MB.
7. Monte pipelines de agregação na ordem: `$match` → `$group` → `$sort` →
   `$limit`.
8. Crie índices e confira com `explain('executionStats')`.

## Limite de confiança

As aulas são boas e detalhadas, mas não têm paginação e não trazem gabarito. O
simulado tem três comandos ausentes (Q7, Q9 e Q10), provavelmente imagens que a
extração não capturou. As resoluções da ATV2 são de aluno e têm inconsistências
de total. Para produção, confirme sintaxe na documentação oficial do MongoDB e
rotule como complemento.
