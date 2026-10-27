# Exercícios, provas e gabaritos — BD2

Este arquivo organiza o que existe de exercício no corpus, o que tem gabarito e
o que precisa ser corrigido. **Nada aqui substitui a leitura da fonte**; use os
caminhos para conferir.

## Panorama

| Fonte | O que é | Tem gabarito? |
| --- | --- | --- |
| `aula02-consultas-basicas-sql.md` p. 6 | 7 exercícios de fixação | Não |
| `script-escola.md` | ~25 consultas comentadas sobre `escola` | Sim, no próprio arquivo |
| `script-restricoes.md` | 2 tarefas de criação com constraints | Sim, no próprio arquivo |
| `script-join.md` | Exemplos de INNER/LEFT/RIGHT | Sim, no próprio arquivo |
| `aula06-lista-de-exercicios-functions.md` | Lista A1–A5, B1–B5, C1 | Sim, em `script-rh.md` |
| `atividade-mysql.md` | 15 questões FastRibeira | **Não** |
| `exercicio-atividade-1-n1-haimon-cugler-vieira.md` | Prova N1 AgroVerde | Parcial: Q1, Q2 e Q4; Q3 sem resposta |
| `exercicio-sc.md` | Respostas da Q1/Q2 da N1 em `.sql` | Parcial |
| `script-agroverde.md` | Grupos A–D de filtros | Sim, no próprio arquivo |
| `atv2-haimon-cugler-vieira.md` | Script AgroVerde do aluno | Sim, no próprio arquivo |

---

## 1. Aula 02 — exercícios de fixação

Enunciado em `aula02-consultas-basicas-sql.md` p. 6. Sem gabarito oficial;
respostas sugeridas:

```sql
-- 1. Alunos de Campinas
SELECT * FROM alunos WHERE cidade = 'Campinas';

-- 2. Nome e e-mail com idade >= 21
SELECT nome, email FROM alunos WHERE idade >= 21;

-- 3. Matriculados no curso 1 e ativos
SELECT nome, email FROM alunos WHERE curso_id = 1 AND ativo = TRUE;

-- 4. Nome começa com E
SELECT nome FROM alunos WHERE nome LIKE 'E%';

-- 5. Não são de São Paulo e têm menos de 25 anos
SELECT nome, cidade, idade
FROM alunos
WHERE cidade <> 'São Paulo' AND idade < 25;

-- 6. Idade entre 18 e 20
SELECT nome, idade FROM alunos WHERE idade BETWEEN 18 AND 20;

-- 7. São Paulo ou Santos, inativos
SELECT nome, cidade
FROM alunos
WHERE cidade IN ('São Paulo', 'Santos') AND ativo = FALSE;
```

> Fonte: `conhecimento/DSM2/BD2/aula02-consultas-basicas-sql.md` p. 4–6.

---

## 2. Script escola — filtros comentados

`script-escola.md` é o melhor treino de `WHERE`. Ele cobre, na ordem:

- `SELECT *` e lista de colunas;
- igualdade e comparações;
- `!=`, `<>`, `NOT`;
- `AND` e `OR`;
- `LIKE` com `%` no início, fim, meio e `_` em posição fixa;
- `IN`, `BETWEEN`, `IS NULL`, `IS NOT NULL`;
- booleanos `TRUE`/`FALSE`.

Exemplos que valem revisar:

```sql
-- G na terceira posição
SELECT * FROM alunos WHERE nome LIKE '__G%';

-- M na penúltima posição
SELECT * FROM alunos WHERE nome LIKE '%m_';

-- 19 a 22 anos
SELECT * FROM alunos WHERE idade BETWEEN 19 AND 22;

-- sem e-mail
SELECT * FROM alunos WHERE email IS NULL;
```

> Fonte: `conhecimento/DSM2/BD2/script-escola.md`.

---

## 3. Script restrições — constraints

Duas tarefas, ambas resolvidas no arquivo:

1. `alunos` com PK `AUTO_INCREMENT`, `email UNIQUE`, `nota_media` com `CHECK`
   entre 0 e 10 e `ativo` com `DEFAULT TRUE`.
2. `matriculas` com FK para `alunos` e `ON DELETE CASCADE`, além de
   `data_inicio DATE DEFAULT (CURDATE())`.

Vale reproduzir de memória e comparar. O ponto de prova é lembrar que
`CHECK` não substitui `NOT NULL` e que `UNIQUE` cria índice automático.

> Fonte: `conhecimento/DSM2/BD2/script-restricoes.md`; teoria em
> `conhecimento/DSM2/BD2/banco-de-dados-2.md`.

---

## 4. Script JOIN — os três joins

O arquivo monta `joins_demo` com `departamentos`, `pessoas`, `tarefas`,
`projetos` e `alocacoes`, incluindo **auto-relacionamento** em
`pessoas.id_gestor`.

```sql
-- INNER: só quem tem tarefa
SELECT p.id, p.nome, t.descricao, t.status
FROM pessoas p
INNER JOIN tarefas t ON p.id = t.pessoa_id;

-- LEFT: todos, mesmo sem tarefa
SELECT p.id, p.nome, t.descricao, t.status
FROM pessoas p
LEFT JOIN tarefas t ON p.id = t.pessoa_id;

-- RIGHT: todas as tarefas, mesmo sem pessoa
SELECT p.id, p.nome, t.descricao, t.status
FROM pessoas p
RIGHT JOIN tarefas t ON p.id = t.pessoa_id;
```

Compare os resultados mentalmente: `tarefas` tem duas linhas com `pessoa_id
NULL`; elas só aparecem no `RIGHT JOIN`. Pessoas sem tarefa só aparecem no
`LEFT JOIN`.

> Fonte: `conhecimento/DSM2/BD2/script-join.md`.

---

## 5. Lista AULA06 — functions

Enunciado em `aula06-lista-de-exercicios-functions.md`; respostas em
`script-rh.md` (banco `empresa_rh`).

| Item | Técnica | Situação da resposta |
| --- | --- | --- |
| A1 | `UPPER`, `LEFT`, `SUBSTRING`, `CONCAT` | Correta |
| A2 | `LENGTH` + `ORDER BY ... DESC` | Correta |
| A3 | `TIMESTAMPDIFF(YEAR, ...)` no `WHERE` | Correta |
| A4 | `ROUND(salario * 0.11, 2)` | Correta |
| A5 | `CASE` por departamento | **Usa `id_depto`, mas o enunciado pede `nome_depto`** |
| B1 | `LOWER(CONCAT(...))` | **Não remove espaços**, apesar do enunciado pedir "sem espaços" |
| B2 | `IF/ELSEIF` por faixa de salário | Correta |
| B3 | `DATE_FORMAT(data, '%d/%m/%Y')` | Correta |
| B4 | `CASE` com duas variáveis | **"Especialista" é inalcançável** |
| B5 | `SUBSTRING` + `CONCAT` para CPF | Correta |
| C1 | Relatório com 5+ functions | Funciona, mas é longa e frágil |

### A5 — correção

O enunciado pede classificar pelo **nome** do departamento. A resposta usa
`id_depto`, o que funciona por coincidência de os IDs 1..5 existirem:

```sql
SELECT f.nome,
       CASE d.nome_depto
         WHEN 'Tecnologia'     THEN 'Área de TI'
         WHEN 'Infraestrutura' THEN 'Área de TI'
         WHEN 'Comercial'      THEN 'Área Comercial'
         WHEN 'RH'             THEN 'Área Administrativa'
         WHEN 'Financeiro'     THEN 'Área Administrativa'
         ELSE 'Outros'
       END AS area
FROM funcionarios f
JOIN departamentos d ON d.id_depto = f.id_depto;
```

### B1 — correção

Para cumprir "sem espaços":

```sql
RETURN LOWER(CONCAT(REPLACE(p_nome, ' ', ''), '.',
                    REPLACE(p_sobrenome, ' ', ''),
                    '@empresa.com.br'));
```

### B4 — correção

A ordem original testa `salario >= 9000 OR anos >= 5` antes de
`salario >= 10000`, então ninguém chega a "Especialista". Teste o caso mais
restritivo primeiro:

```sql
CASE
  WHEN p_anos >= 5 AND p_salario >= 10000 THEN 'Especialista'
  WHEN p_anos >= 5 AND p_salario >= 9000  THEN 'Sênior'
  WHEN p_anos BETWEEN 2 AND 4 AND p_salario BETWEEN 6000 AND 8900 THEN 'Pleno'
  ELSE 'Júnior'
END
```

A definição do enunciado é ambígua para quem tem 1 ano e salário alto; a
correção acima prioriza tempo **e** salário, como o texto sugere.

> Fonte: `conhecimento/DSM2/BD2/aula06-lista-de-exercicios-functions.md`;
> `conhecimento/DSM2/BD2/script-rh.md` (respostas A1–C1).

---

## 6. Atividade FastRibeira — 15 questões sem gabarito

`atividade-mysql.md` (4 p.) depende de `fastribeira_banco.sql`, que **não está
no corpus**. As tabelas citadas são `cliente`, `veiculo`, `motorista`, `pedido`
e `entrega`.

### Parte 1 — functions

| Questão | O que a função faz | Técnica |
| --- | --- | --- |
| 1 | status da entrega de um pedido | `SELECT ... INTO` + `IFNULL(..., 'Sem registro')` |
| 2 | total de pedidos de um cliente | `COUNT(*) ... WHERE id_cliente = p_id` |
| 3 | soma de frete de um motorista | `SUM(valor_frete)` + `IFNULL(..., 0)` |
| 4 | placa do veículo do motorista | `SELECT placa INTO ...` com JOIN ou subconsulta |
| 5 | categoria por peso | `IF/ELSEIF` ou `CASE` |

### Parte 2 — consultas

| Questão | Técnica |
| --- | --- |
| 6 | `ORDER BY nome` |
| 7 | JOIN cliente + motorista + pedido |
| 8 | `WHERE status = 'Pendente'` |
| 9 | `fn_status_entrega` no `SELECT` |
| 10 | `fn_placa_motorista` no `SELECT` |
| 11 | `GROUP BY motorista` + `COUNT` + `HAVING COUNT(*) >= 1` |
| 12 | `fn_categoria_peso` + `ORDER BY categoria, peso_kg` |
| 13 | filtro por nome + function de status |
| 14 | `fn_frete_total_motorista` + `ORDER BY total DESC` |
| 15 | `ORDER BY capacidade_kg DESC` |

Sem o script do banco, não afirme nomes exatos de colunas além dos citados no
enunciado. Se o usuário pedir a resposta, monte a query com os nomes do
enunciado e diga que a validação depende do schema real.

> Fonte: `conhecimento/DSM2/BD2/atividade-mysql.md` p. 1–4.

---

## 7. Prova N1 — AgroVerde

### Questão 1 — DDL e consultas básicas

Respostas em `exercicio-sc.md` (Q1.1–1.5). O script cria as cinco tabelas
(`propriedades`, `produtores`, `culturas`, `colheitas`, `vendas`) e responde:

```sql
-- 1.1
SELECT nome_propriedade, municipio, area_hectares FROM propriedades;

-- 1.2
SELECT nome_produtor, telefone FROM produtores WHERE ativo;

-- 1.3
SELECT nome_cultura, area_plantada_ha, data_plantio
FROM culturas WHERE status = 'Produzindo';

-- 1.4
SELECT id_colheita, quantidade_kg, qualidade
FROM colheitas WHERE quantidade_kg > 2500;

-- 1.5
SELECT data_venda, quantidade_vendida_kg, preco_por_kg
FROM vendas WHERE comprador = 'Mercado Central';
```

### Questão 2 — consultas dissertativas

Respostas no PDF, com **erros do aluno**:

| Item | Resposta no material | Problema |
| --- | --- | --- |
| 2.1 | `... where municipio = 'Registro` | Aspas não fechadas |
| 2.2 | `select nome_produtor ...` | Falta `telefone`, pedido no enunciado |
| 2.3 | `BETWEEN 4 AND 10` | Correta |
| 2.4 | `IN ('Excelente','Boa')` + `ORDER BY ... DESC` | Correta |
| 2.5 | `SUM(quantidade_vendida_kg * preco_por_kg)` sem `GROUP BY` | Devolve um total geral, não por venda |

Correções:

```sql
-- 2.1
SELECT nome_propriedade FROM propriedades WHERE municipio = 'Registro';

-- 2.2
SELECT nome_produtor, telefone FROM produtores
WHERE id_propriedade IN (2, 5, 7);

-- 2.5
SELECT id_venda, comprador,
       quantidade_vendida_kg * preco_por_kg AS valor_total
FROM vendas;
```

### Questão 3 — ORDER BY, GROUP BY e HAVING (sem gabarito no arquivo)

Enunciados nas páginas 9. Soluções sugeridas:

```sql
-- 3.1
SELECT nome_propriedade, municipio, area_hectares
FROM propriedades
ORDER BY area_hectares DESC;

-- 3.2
SELECT nome_cultura, COUNT(*) AS total_plantios
FROM culturas
GROUP BY nome_cultura;

-- 3.3
SELECT comprador, SUM(quantidade_vendida_kg) AS total_kg
FROM vendas
GROUP BY comprador
ORDER BY total_kg DESC;

-- 3.4
SELECT qualidade, SUM(quantidade_kg) AS total_colhido
FROM colheitas
GROUP BY qualidade
HAVING total_colhido > 5000;

-- 3.5
SELECT comprador, AVG(preco_por_kg) AS preco_medio
FROM vendas
GROUP BY comprador
HAVING preco_medio > 1.50
ORDER BY preco_medio DESC;
```

### Questão 4 — dissertativas com gabarito

```sql
-- 4.1
SELECT status, COUNT(nome_cultura) AS total
FROM culturas
GROUP BY status
HAVING total > 2;

-- 4.2
SELECT tipo_solo AS tipo, SUM(area_hectares) AS area_total
FROM propriedades
GROUP BY tipo_solo
HAVING area_total > 50
ORDER BY area_total DESC;

-- 4.3
SELECT qualidade, AVG(quantidade_kg) AS media_kg
FROM colheitas
WHERE qualidade <> 'Regular'
GROUP BY qualidade
HAVING media_kg > 2000
ORDER BY media_kg DESC;
```

Observação: em 4.2 o gabarito agrupa por `tipo`, que é alias de `tipo_solo`.
O MySQL aceita, mas o mais portável é agrupar pela coluna real.

> Fonte: `conhecimento/DSM2/BD2/exercicio-atividade-1-n1-haimon-cugler-vieira.md`
> p. 4–11; `conhecimento/DSM2/BD2/exercicio-sc.md`.

---

## 8. Script AgroVerde — grupos A–D

`script-agroverde.md` é um drill de `WHERE` com dados de produção agrícola.
Cobre:

- **A**: listar tudo, colunas específicas, filtro por estado, booleanos;
- **B**: comparações e `BETWEEN`;
- **C**: `AND`, `IN`;
- **D**: `LIKE` e `IS NULL`.

Todas as respostas estão no próprio arquivo. Repare que o script usa
`WHERE ativo` e `WHERE NOT vendido` (formas curtas de `ativo = TRUE`) e
`NOT municipio = 'Pato Branco'` (funciona, mas `<>` é mais direto).

> Fonte: `conhecimento/DSM2/BD2/script-agroverde.md`;
> `conhecimento/DSM2/BD2/atv2-haimon-cugler-vieira.md`.

---

## 9. Ordem recomendada de estudo

1. `aula02-consultas-basicas-sql.md` + exercícios da p. 6.
2. `script-escola.md` inteiro, digitando as queries.
3. `script-restricoes.md` para constraints.
4. `script-join.md` desenhando os conjuntos no papel.
5. `script-rh.md` (funções nativas) e depois a lista AULA06.
6. `script-procedure.md` para functions/procedures/trigger/view.
7. `atividade-mysql.md` como simulado sem gabarito.
8. N1 completa, cronometrada.
