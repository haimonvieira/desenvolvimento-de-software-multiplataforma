# Visão geral — Banco de Dados II (DSM2/BD2)

## O que o material cobre

O corpus de BD2 é essencialmente **SQL no MySQL**, com progressão clara:

1. criar banco e tabelas;
2. inserir dados;
3. consultar com `SELECT` e filtrar com `WHERE`;
4. restringir e relacionar tabelas (`constraints` e `JOIN`);
5. usar funções nativas;
6. criar funções, procedures, triggers e views;
7. analisar dados com `GROUP BY`, `HAVING` e agregações.

Não é um curso de administração de banco nem de modelagem conceitual. Modelagem
(MER, normalização) aparece em **MBD/DSM1**, não aqui.

## Sequência didática que o corpus revela

| Ordem | Tema | Onde está |
| --- | --- | --- |
| 1 | `CREATE DATABASE`, `CREATE TABLE`, tipos, `INSERT`, `SELECT`, `WHERE` | `aula02-consultas-basicas-sql.md` (7 p.) e `aula02-script-aula-24022026-consultas-basicas.md` |
| 2 | Prática de filtros sobre a tabela `alunos` | `script-escola.md` |
| 3 | Constraints: PK, FK, UNIQUE, CHECK, DEFAULT, CASCADE | `banco-de-dados-2.md` (resumo teórico) e `script-restricoes.md` |
| 4 | JOIN (INNER, LEFT, RIGHT), auto-relacionamento, ENUM | `script-join.md` |
| 5 | JOIN implícito por vírgula e cálculo de idade | `script-livraria.md` |
| 6 | Funções nativas de texto, número, data e condicionais | `script-rh.md` |
| 7 | Lista A1–A5, B1–B5, C1 com respostas | `aula06-lista-de-exercicios-functions.md` + `script-rh.md` |
| 8 | Stored functions, procedures, trigger e view | `script-procedure.md` |
| 9 | Atividade FastRibeira (15 questões, sem gabarito) | `atividade-mysql.md` (4 p.) |
| 10 | Prova N1 AgroVerde: DDL, consultas, GROUP BY/HAVING | `exercicio-atividade-1-n1-haimon-cugler-vieira.md` (12 p.) |
| 11 | Prática guiada de filtros sobre AgroVerde | `script-agroverde.md`, `atv2-haimon-cugler-vieira.md`, `exercicio-sc.md` |
| 12 | Banco mínimo de clientes (aquecimento) | `script-java.md` |

## Mapa tópico → fonte

| Tópico | Fonte principal |
| --- | --- |
| Criar banco/tabela, tipos e `INSERT` | `aula02-consultas-basicas-sql.md` p. 2–3 |
| `WHERE` (=, comparações, `!=`, `<>`, `AND`, `OR`, `LIKE`, `IN`, `BETWEEN`, `IS NULL`) | `aula02-consultas-basicas-sql.md` p. 4–5 |
| `ALTER TABLE ADD COLUMN` | `script-escola.md`, `aula02-script-aula-24022026-consultas-basicas.md` |
| `PRIMARY KEY`, `UNIQUE`, `CHECK`, `DEFAULT`, `FOREIGN KEY`, `ON DELETE CASCADE` | `script-restricoes.md`; teoria em `banco-de-dados-2.md` |
| `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `JOIN ... USING` | `script-join.md` |
| JOIN por vírgula no `FROM` | `script-livraria.md` |
| `ORDER BY`, `LIMIT` | `script-join.md`, `script-rh.md`, `script-livraria.md` |
| `GROUP BY`, `HAVING`, `COUNT`, `SUM`, `AVG` | `exercicio-atividade-1-n1-haimon-cugler-vieira.md` p. 9–11; `atividade-mysql.md` p. 3 |
| Funções de texto | `script-rh.md` (UPPER, LOWER, CONCAT, LENGTH, LEFT, SUBSTRING, LOCATE, RPAD) |
| Funções numéricas | `script-rh.md` (ROUND, FLOOR, CEIL, MOD) |
| Funções de data | `script-rh.md`, `script-livraria.md` (CURDATE, DATE_FORMAT, TIMESTAMPDIFF, DATEDIFF, DATE_ADD) |
| Condicionais | `script-rh.md` (IF, IFNULL, COALESCE, NULLIF, CASE) |
| `CREATE FUNCTION` | `script-rh.md`, `script-procedure.md` |
| `CREATE PROCEDURE` e `CALL` | `script-procedure.md` |
| `CREATE TRIGGER ... AFTER INSERT` | `script-procedure.md` |
| `CREATE VIEW` | `script-procedure.md` |
| `SHOW FUNCTION STATUS`, `SHOW CREATE FUNCTION`, `DROP FUNCTION` | `script-rh.md` |

## Lacunas do corpus

Estes assuntos **não têm material indexado** em BD2. Se a pergunta for sobre
eles, diga que estão fora do corpus antes de complementar:

- normalização (1FN, 2FN, 3FN);
- subconsultas;
- `DELETE` com exemplos (só aparece como "próximo passo");
- `UPDATE` como aula (só aparece dentro de procedure);
- `UNION`, `DISTINCT`, window functions;
- transações (`COMMIT`, `ROLLBACK`);
- índices e `EXPLAIN`;
- modelagem conceitual/MER (é MBD/DSM1).

`GROUP BY` e `HAVING` também não aparecem na aula 02, mas aparecem na N1 e na
atividade FastRibeira — ou seja, são conteúdo cobrado, apenas sem aula teórica
no corpus.

## Como usar este material para estudar

1. Leia `01-conceitos.md` para a sintaxe consolidada.
2. Resolva `02-exercicios.md` na ordem das fontes.
3. Consulte `03-fontes.md` para saber o que é aula, script ou prova.
4. Use `04-glossario.md` para fixar vocabulário.

Ao responder, cite o arquivo e a página. Se a resposta vier de um script sem
página, cite o caminho e o arquivo original indicado no frontmatter.
