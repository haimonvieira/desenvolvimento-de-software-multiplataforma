# Conceitos e sintaxe — MySQL (BD2)

Referência de consulta rápida. Todo exemplo abaixo aparece no material de BD2 ou
é uma correção direta dele. Fonte indicada ao fim de cada seção.

## 1. Ordem das cláusulas

A ordem de **escrita** é:

```sql
SELECT colunas
FROM tabela
JOIN outra ON condicao
WHERE filtro
GROUP BY colunas
HAVING filtro_de_grupo
ORDER BY colunas
LIMIT n;
```

A ordem **lógica** de avaliação é `FROM → WHERE → GROUP BY → HAVING → SELECT →
ORDER BY → LIMIT`. Por isso um alias criado no `SELECT` pode ser usado no
`ORDER BY` (e, no MySQL, também no `HAVING`), mas não no `WHERE`.

> Fonte: `conhecimento/DSM2/BD2/exercicio-atividade-1-n1-haimon-cugler-vieira.md` p. 10.

## 2. DDL — criar banco e tabelas

```sql
CREATE DATABASE escola;
USE escola;

CREATE TABLE cursos (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  nome    VARCHAR(100) NOT NULL,
  duracao INT,                 -- duração em meses
  turno   VARCHAR(10)          -- Manhã, Tarde ou Noite
);

CREATE TABLE alunos (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  nome     VARCHAR(100) NOT NULL,
  email    VARCHAR(150),
  idade    INT,
  cidade   VARCHAR(80),
  curso_id INT,
  ativo    BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (curso_id) REFERENCES cursos(id)
);
```

Tipos usados no material:

| Tipo | Uso | Exemplo |
| --- | --- | --- |
| `INT` | inteiros | `idade`, `id`, `duracao` |
| `VARCHAR(n)` | texto com limite | `nome`, `email`, `cidade` |
| `DECIMAL(p,s)` | valores monetários | `salario DECIMAL(10,2)` |
| `DATE` | data | `data_admissao` |
| `BOOLEAN` / `TINYINT(1)` | verdadeiro/falso | `ativo` |
| `ENUM(...)` | lista fixa de valores | `status ENUM('Pendente','Em Andamento','Concluido')` |
| `AUTO_INCREMENT` | número gerado pelo banco | `id` |

Adicionar coluna depois:

```sql
ALTER TABLE alunos ADD COLUMN idade INT;
```

> Fonte: `aula02-consultas-basicas-sql.md` p. 2–3; `script-escola.md`;
> `script-join.md`.

## 3. Constraints

| Constraint | Garante | Exemplo |
| --- | --- | --- |
| `PRIMARY KEY` | unicidade e não nulo; uma por tabela | `id INT PRIMARY KEY` |
| `NOT NULL` | campo obrigatório | `nome VARCHAR(100) NOT NULL` |
| `UNIQUE` | sem valores repetidos na coluna | `email VARCHAR(50) UNIQUE` |
| `DEFAULT` | valor quando nada é informado | `ativo BOOLEAN DEFAULT TRUE` |
| `CHECK` | regra de domínio | `CHECK (nota_media >= 0 AND nota_media <= 10)` |
| `AUTO_INCREMENT` | sequência automática | `id INT AUTO_INCREMENT` |
| `FOREIGN KEY` | integridade referencial | `FOREIGN KEY (curso_id) REFERENCES cursos(id)` |
| `ON DELETE CASCADE` | apaga filhos junto com o pai | `... REFERENCES alunos(id_aluno) ON DELETE CASCADE` |

Exemplo completo:

```sql
CREATE TABLE alunos (
  id_aluno   INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  nome       VARCHAR(100) NOT NULL,
  email      VARCHAR(50) NOT NULL UNIQUE,
  nota_media DECIMAL(10,2) DEFAULT 0.0,
  CHECK (nota_media >= 0 AND nota_media <= 10),
  ativo      BOOLEAN DEFAULT TRUE
);

CREATE TABLE matriculas (
  id_matricula INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  id_aluno     INT,
  curso        VARCHAR(80) NOT NULL,
  data_inicio  DATE DEFAULT (CURDATE()),
  FOREIGN KEY (id_aluno) REFERENCES alunos(id_aluno) ON DELETE CASCADE
);
```

Auto-relacionamento (uma pessoa pode ter um gestor que também é pessoa):

```sql
CREATE TABLE pessoas (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  nome     VARCHAR(100) NOT NULL,
  id_gestor INT NULL,
  depto_id  INT NULL,
  CONSTRAINT fk_pessoas_gestor FOREIGN KEY (id_gestor) REFERENCES pessoas(id)
);
```

Atenção: `ON DELETE CASCADE` exige engine InnoDB. Em versões antigas do MySQL o
`CHECK` era aceito e ignorado; versões atuais validam.

> Fonte: `script-restricoes.md`; `script-join.md`; `banco-de-dados-2.md`;
> `aula02-consultas-basicas-sql.md` p. 2.

## 4. INSERT

Um registro:

```sql
INSERT INTO cursos (nome, duracao, turno)
VALUES ('Desenvolvimento de Sistemas', 36, 'Manhã');
```

Vários registros:

```sql
INSERT INTO alunos (nome, email, idade, cidade, curso_id, ativo) VALUES
  ('Ana Silva',    'ana@email.com',    20, 'São Paulo', 1, TRUE),
  ('Bruno Souza',  'bruno@email.com',  22, 'Campinas',  1, TRUE),
  ('Carla Pereira','carla@email.com',  19, 'São Paulo', 2, TRUE);
```

Não é preciso informar a PK com `AUTO_INCREMENT`: o banco gera.

> Fonte: `aula02-consultas-basicas-sql.md` p. 3; `script-escola.md`.

## 5. SELECT e WHERE

```sql
SELECT * FROM alunos;              -- todas as colunas
SELECT nome, cidade FROM alunos;   -- colunas específicas
SELECT nome AS aluno, idade FROM alunos;
```

Operadores de filtro:

| Operador | Significado | Exemplo |
| --- | --- | --- |
| `=` | igual | `WHERE cidade = 'São Paulo'` |
| `!=` ou `<>` | diferente | `WHERE cidade <> 'Santos'` |
| `>` `<` `>=` `<=` | comparação | `WHERE idade >= 21` |
| `AND` | ambas verdadeiras | `WHERE cidade = 'São Paulo' AND idade > 19` |
| `OR` | pelo menos uma | `WHERE cidade = 'Campinas' OR cidade = 'Sorocaba'` |
| `NOT` | negação | `WHERE NOT ativo` |
| `IN` | pertence à lista | `WHERE cidade IN ('São Paulo','Campinas','Santos')` |
| `BETWEEN a AND b` | intervalo inclusivo | `WHERE idade BETWEEN 19 AND 22` |
| `LIKE` | padrão textual | `WHERE nome LIKE 'A%'` |
| `IS NULL` | campo vazio | `WHERE email IS NULL` |
| `IS NOT NULL` | campo preenchido | `WHERE email IS NOT NULL` |

### LIKE

| Padrão | Casa com |
| --- | --- |
| `'A%'` | começa com A |
| `'%a'` | termina com a |
| `'%a%'` | contém a em qualquer posição |
| `'__G%'` | G na terceira posição (`_` = um caractere) |
| `'%m_'` | m na penúltima posição |

### NULL

`NULL` não é valor: não use `= NULL` nem `<> NULL`.

```sql
-- errado
SELECT * FROM alunos WHERE email = NULL;

-- correto
SELECT * FROM alunos WHERE email IS NULL;
SELECT * FROM alunos WHERE email IS NOT NULL;
```

### Booleanos

```sql
SELECT * FROM alunos WHERE ativo = TRUE;
SELECT * FROM alunos WHERE ativo;        -- forma curta
SELECT * FROM alunos WHERE NOT ativo;    -- inativos
```

### AND com OR

Sem parênteses, `AND` tem prioridade sobre `OR`. Combine com parênteses quando a
intenção for outra:

```sql
WHERE (cidade = 'São Paulo' OR cidade = 'Santos') AND ativo = TRUE
```

> Fonte: `aula02-consultas-basicas-sql.md` p. 4–5; `script-escola.md`.

## 6. ORDER BY e LIMIT

```sql
SELECT nome, salario
FROM funcionarios
ORDER BY salario DESC;

SELECT nome, LENGTH(email) AS comprimento
FROM funcionarios
ORDER BY LENGTH(email) DESC;

SELECT nome, TIMESTAMPDIFF(YEAR, data_nascimento, CURDATE()) AS idade
FROM clientes
LIMIT 1;
```

`ASC` é o padrão; `DESC` inverte. `LIMIT n` corta o resultado depois da
ordenação.

> Fonte: `script-rh.md`; `script-livraria.md`.

## 7. Agregações, GROUP BY e HAVING

| Função | O que faz |
| --- | --- |
| `COUNT(*)` | conta linhas |
| `COUNT(coluna)` | conta valores não nulos da coluna |
| `SUM(coluna)` | soma |
| `AVG(coluna)` | média |
| `MIN` / `MAX` | menor / maior (não usados no material, mas válidos) |

Agrupar:

```sql
-- quantas culturas existem em cada status
SELECT status, COUNT(nome_cultura) AS total
FROM culturas
GROUP BY status;

-- só grupos com mais de 2 culturas
SELECT status, COUNT(nome_cultura) AS total
FROM culturas
GROUP BY status
HAVING total > 2;
```

`WHERE` filtra **linhas antes** do agrupamento; `HAVING` filtra **grupos depois**.
A ordem completa:

```sql
SELECT qualidade, AVG(quantidade_kg) AS media_kg
FROM colheitas
WHERE qualidade <> 'Regular'
GROUP BY qualidade
HAVING media_kg > 2000
ORDER BY media_kg DESC;
```

Regras práticas:

- toda coluna do `SELECT` que não está em uma agregação deve estar no `GROUP BY`;
- `HAVING` sem `GROUP BY` age sobre a tabela inteira;
- `SUM(qtd * preco)` sem `GROUP BY` devolve **um único total** para todas as
  linhas, não um total por venda;
- no MySQL, alias do `SELECT` funciona em `HAVING` e `ORDER BY`; para portabilidade,
  prefira repetir a expressão no `HAVING`.

> Fonte: `exercicio-atividade-1-n1-haimon-cugler-vieira.md` p. 9–11;
> `atividade-mysql.md` p. 3.

## 8. JOIN

### INNER JOIN

Só linhas com correspondência nos dois lados:

```sql
SELECT p.id, p.nome, t.descricao, t.status
FROM pessoas p
INNER JOIN tarefas t ON p.id = t.pessoa_id
ORDER BY p.id;
```

`JOIN` sozinho é `INNER JOIN`. Quando a coluna tem o mesmo nome nos dois lados,
`USING (id)` substitui o `ON`.

### LEFT JOIN

Preserva todas as linhas da tabela da esquerda; o lado direito vem `NULL` quando
não há correspondência:

```sql
SELECT p.id, p.nome, t.id AS tarefa, t.descricao, t.status
FROM pessoas p
LEFT JOIN tarefas t ON p.id = t.pessoa_id
ORDER BY p.id, t.id;
```

### RIGHT JOIN

O espelho: preserva a tabela da direita.

```sql
SELECT p.id, p.nome, t.id AS tarefa, t.descricao, t.status
FROM pessoas p
RIGHT JOIN tarefas t ON p.id = t.pessoa_id
ORDER BY p.id, t.id;
```

### JOIN implícito por vírgula

Forma antiga, equivalente a um produto cartesiano filtrado no `WHERE`:

```sql
SELECT *
FROM clientes, pedidos
WHERE clientes.id_cliente = pedidos.id_cliente;
```

Evite em código novo; `JOIN ... ON` é mais legível.

### Armadilha do LEFT JOIN

Filtrar a tabela da direita no `WHERE` anula o efeito do `LEFT`:

```sql
-- vira INNER JOIN na prática
SELECT p.nome, t.descricao
FROM pessoas p
LEFT JOIN tarefas t ON p.id = t.pessoa_id
WHERE t.status = 'Pendente';
```

Para manter quem não tem tarefa, o filtro precisa ir no `ON` ou aceitar `NULL`.

> Fonte: `script-join.md`; `script-livraria.md`;
> `aula02-consultas-basicas-sql.md` p. 7.

## 9. Funções nativas

### Texto

| Função | Resultado |
| --- | --- |
| `UPPER(x)` / `LOWER(x)` | caixa alta / baixa |
| `CONCAT(a, b, ...)` | junta textos |
| `LENGTH(x)` | comprimento em bytes |
| `LEFT(x, n)` | n primeiros caracteres |
| `SUBSTRING(x, pos, n)` | trecho a partir de `pos` |
| `LOCATE(sub, x)` | posição da substring |
| `RPAD(x, n, pad)` | preenche à direita |
| `REPLACE(x, de, para)` | troca trecho |
| `FORMAT(x, n)` | formata número com n casas |

```sql
SELECT UPPER(CONCAT(nome, ' ', sobrenome)) AS nome_completo,
       LOWER(email) AS email_padronizado
FROM funcionarios;

SELECT email,
       LEFT(email, LOCATE('@', email) - 1) AS usuario,
       SUBSTRING(email, LOCATE('@', email) + 1) AS dominio
FROM funcionarios;
```

### Números

| Função | Resultado |
| --- | --- |
| `ROUND(x, n)` | arredonda para n casas |
| `FLOOR(x)` | arredonda para baixo |
| `CEIL(x)` | arredonda para cima |
| `MOD(x, y)` | resto da divisão |

```sql
SELECT nome, salario,
       ROUND(salario * 0.11, 2) AS desconto_inss,
       ROUND(salario - salario * 0.11, 2) AS salario_liquido
FROM funcionarios;
```

### Data

| Função | Resultado |
| --- | --- |
| `CURDATE()` | data atual |
| `DATE_FORMAT(data, '%d/%m/%Y')` | data formatada |
| `TIMESTAMPDIFF(YEAR, inicio, fim)` | diferença em anos (também `MONTH`, `DAY`) |
| `DATEDIFF(fim, inicio)` | diferença em dias |
| `DATE_ADD(data, INTERVAL n YEAR)` | soma intervalo |
| `YEAR(data)` / `MONTH(data)` | extrai ano / mês |

```sql
SELECT nome,
       DATE_FORMAT(data_admissao, '%d/%m/%Y') AS admitido_em,
       TIMESTAMPDIFF(YEAR, data_admissao, CURDATE()) AS anos_de_empresa,
       DATEDIFF(CURDATE(), data_admissao) AS dias_de_empresa
FROM funcionarios;
```

### Condicionais

```sql
SELECT nome,
       IF(ativo = 1, 'ativo', 'inativo') AS status,
       IF(salario >= 8000, 'sênior', 'pleno') AS nivel
FROM funcionarios;

SELECT nome, IFNULL(cargo, 'sem cargo') AS cargo FROM funcionarios;
SELECT nome, COALESCE(cargo, email, 'sem informação') AS referencia FROM funcionarios;
SELECT nome, NULLIF(ativo, 0) AS ativo_ou_nulo FROM funcionarios;
```

`CASE` simples (compara uma coluna):

```sql
SELECT nome,
       CASE id_depto
         WHEN 1 THEN 'Tecnologia'
         WHEN 2 THEN 'Comercial'
         WHEN 3 THEN 'RH'
         WHEN 4 THEN 'Financeiro'
         ELSE 'Outro'
       END AS departamento
FROM funcionarios;
```

`CASE` com expressões (mais flexível):

```sql
SELECT nome, salario,
       CASE
         WHEN salario < 6000               THEN 'Faixa A'
         WHEN salario BETWEEN 6000 AND 8999 THEN 'Faixa B'
         WHEN salario >= 9000              THEN 'Faixa C'
       END AS faixa_salarial
FROM funcionarios;
```

> Fonte: `script-rh.md`.

## 10. Stored functions

Uma função recebe zero ou mais parâmetros e **retorna um único valor**. Pode ser
usada dentro de `SELECT`.

Modelo:

```sql
DELIMITER $$

DROP FUNCTION IF EXISTS fn_nome;

CREATE FUNCTION fn_nome(p_nome VARCHAR(50), p_sobrenome VARCHAR(50))
RETURNS VARCHAR(110)
DETERMINISTIC
BEGIN
  RETURN CONCAT(UPPER(p_sobrenome), ', ', p_nome);
END$$

DELIMITER ;
```

Chamada:

```sql
SELECT fn_nome(nome, sobrenome) AS nome_formal, cargo FROM funcionarios;
```

Com variáveis e `IF`:

```sql
DELIMITER $$
CREATE FUNCTION fn_calcular_bonus(p_salario DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
  DECLARE v_percentual DECIMAL(5,2);

  IF p_salario <= 5000 THEN
    SET v_percentual = 0.20;
  ELSEIF p_salario <= 8000 THEN
    SET v_percentual = 0.15;
  ELSE
    SET v_percentual = 0.10;
  END IF;

  RETURN ROUND(p_salario * v_percentual, 2);
END$$
DELIMITER ;
```

Com `SELECT ... INTO`:

```sql
DELIMITER $$
CREATE FUNCTION valorTotalProduto(p_id INT, p_quantidade INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
  DECLARE v_preco DECIMAL(10,2);

  SELECT preco INTO v_preco
  FROM livros
  WHERE livroId = p_id
  LIMIT 1;

  IF v_preco IS NULL THEN
    RETURN 0;
  END IF;

  RETURN v_preco * p_quantidade;
END$$
DELIMITER ;
```

Pontos que o material sempre repete:

- `DELIMITER $$` antes e `DELIMITER ;` depois (é comando do cliente);
- `DETERMINISTIC` na declaração;
- `DECLARE` só no início do bloco `BEGIN`;
- `RETURN` encerra a função;
- `IFNULL(total, 0)` para não devolver `NULL` em soma vazia.

> Fonte: `script-rh.md`; `script-procedure.md`;
> `aula06-lista-de-exercicios-functions.md`.

## 11. Stored procedures

Procedure executa um procedimento e **não precisa retornar valor**. Recebe
parâmetros `IN` e é chamada com `CALL`.

```sql
DELIMITER $$
CREATE PROCEDURE registrarVenda(IN p_id INT, IN p_quantidade INT)
BEGIN
  DECLARE v_total DECIMAL(10,2);

  SET v_total = valorTotalProduto(p_id, p_quantidade);

  INSERT INTO vendas (livroId, dataVenda, quantidade, valorTotal)
  VALUES (p_id, CURDATE(), p_quantidade, v_total);
END$$
DELIMITER ;

CALL registrarVenda(2, 8);
```

Diferença central:

| | Function | Procedure |
| --- | --- | --- |
| Retorno | um valor obrigatório | nenhum ou via `OUT` |
| Uso no `SELECT` | sim | não |
| Chamada | dentro de expressão | `CALL nome(...)` |
| `DETERMINISTIC` | exigido no material | usado em alguns exemplos |

> Fonte: `script-procedure.md`.

## 12. Triggers

Gatilho disparado automaticamente por um evento (`AFTER INSERT`, por exemplo).
`NEW.coluna` acessa a linha recém-inserida.

```sql
DELIMITER $$
CREATE TRIGGER vender
AFTER INSERT ON vendas
FOR EACH ROW
BEGIN
  CALL saidaEstoque(NEW.livroId, NEW.quantidade);
END$$
DELIMITER ;
```

Depois disso, todo `INSERT` em `vendas` baixa o estoque sem o aplicativo precisar
chamar a procedure.

> Fonte: `script-procedure.md`.

## 13. Views

Uma view é uma consulta salva com nome, usada como se fosse tabela.

```sql
CREATE VIEW listarVendas AS
SELECT v.vendaId, v.livroId, l.titulo, v.dataVenda, v.quantidade, v.valorTotal
FROM vendas v
JOIN livros l ON l.livroId = v.livroId;

SELECT * FROM listarVendas;
```

> Fonte: `script-procedure.md`.

## 14. Gerenciamento de rotinas

```sql
SHOW FUNCTION STATUS WHERE db = 'empresa_rh';
SHOW CREATE FUNCTION fn_calcular_bonus;
DROP FUNCTION IF EXISTS fn_nome_formal;
```

> Fonte: `script-rh.md`.

## 15. Resumo das armadilhas

1. `= NULL` nunca funciona; use `IS NULL`.
2. `COUNT(coluna)` ignora `NULL`; `COUNT(*)` conta a linha.
3. `SUM` sem `GROUP BY` achata tudo em uma linha.
4. `HAVING` é para grupos; `WHERE` é para linhas.
5. `LEFT JOIN` + filtro da tabela direita no `WHERE` vira `INNER JOIN`.
6. `DELETE`/`UPDATE` sem `WHERE` atingem a tabela inteira.
7. `DELIMITER` é do cliente, não do servidor.
8. `DETERMINISTIC` evita erro com binlog.
9. Aspas de texto precisam fechar; a N1 tem um caso sem fechamento.
10. `ON DELETE CASCADE` só vale em InnoDB.
