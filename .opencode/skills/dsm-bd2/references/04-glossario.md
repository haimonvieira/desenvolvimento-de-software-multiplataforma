# Glossário — BD2 / MySQL

Termos como aparecem no material, com tradução e observação prática.

## A–C

| Termo | Significado | Observação |
| --- | --- | --- |
| **Alias** | Nome temporário para coluna ou tabela (`AS nome`, `pessoas p`) | Facilita leitura e é usado em `ORDER BY`/`HAVING` |
| **Auto-incremento** | `AUTO_INCREMENT`: o banco gera o próximo inteiro | Só em coluna de chave, normalmente PK |
| **Banco de dados relacional** | Dados organizados em tabelas com relações | Modelo usado em BD2 e em MBD/DSM1 |
| **Booleano** | Verdadeiro/falso (`TRUE`/`FALSE`, `1`/`0`) | No MySQL aparece como `BOOLEAN` ou `TINYINT(1)` |
| **Campo** | Coluna de uma tabela | Também chamado de atributo |
| **Chave estrangeira (FK)** | Coluna que referencia a PK de outra tabela | Garante integridade referencial |
| **Chave primária (PK)** | Identifica unicamente cada linha | Não aceita `NULL` nem duplicata; uma por tabela |
| **CHECK** | Constraint de domínio | Ex.: nota entre 0 e 10; versões antigas do MySQL ignoravam |
| **Constraint** | Regra aplicada à tabela | PK, FK, UNIQUE, CHECK, NOT NULL, DEFAULT |
| **Consulta** | Comando que lê dados, geralmente `SELECT` | Em inglês, *query* |

## D–H

| Termo | Significado | Observação |
| --- | --- | --- |
| **DDL** | *Data Definition Language*: cria/altera estrutura | `CREATE`, `ALTER`, `DROP` |
| **DML** | *Data Manipulation Language*: mexe nos dados | `INSERT`, `UPDATE`, `DELETE` |
| **DQL** | *Data Query Language*: consulta | `SELECT` |
| **DEFAULT** | Valor padrão quando nada é informado | `ativo BOOLEAN DEFAULT TRUE` |
| **DELIMITER** | Troca o terminador de comandos no cliente | Necessário para funções/procedures com `;` interno |
| **DETERMINISTIC** | Declara que a função sempre retorna o mesmo para os mesmos argumentos | Usado em todas as functions do material |
| **ENUM** | Tipo com lista fixa de valores | Ex.: status de tarefa |
| **Função (stored function)** | Rotina que retorna um valor | Pode ser usada dentro de `SELECT` |
| **GROUP BY** | Agrupa linhas com valores iguais | Base para `COUNT`, `SUM`, `AVG` por grupo |
| **HAVING** | Filtra grupos depois do `GROUP BY` | Diferente de `WHERE`, que filtra linhas |

## I–M

| Termo | Significado | Observação |
| --- | --- | --- |
| **INNER JOIN** | Retorna só linhas com correspondência nos dois lados | `JOIN` sozinho é `INNER` |
| **JOIN** | Combina linhas de duas ou mais tabelas | `ON` define a condição |
| **LEFT JOIN** | Preserva todas as linhas da tabela da esquerda | Lado direito sem par vem `NULL` |
| **RIGHT JOIN** | Preserva todas as linhas da tabela da direita | Espelho do `LEFT` |
| **LIMIT** | Limita a quantidade de linhas retornadas | Aplicado depois do `ORDER BY` |
| **Linha / registro** | Uma entrada da tabela | Em inglês, *row* |
| **Máscara** | Formatação de um valor (CPF, e-mail) | Feita com `CONCAT`/`SUBSTRING` |
| **MySQL** | SGBD relacional usado na disciplina | Dialeto dos scripts |

## N–R

| Termo | Significado | Observação |
| --- | --- | --- |
| **NULL** | Ausência de valor | Não é zero nem string vazia; teste com `IS NULL` |
| **Operador** | Símbolo que compara/combina valores | `=`, `<>`, `>`, `AND`, `OR`, `LIKE`, `IN` |
| **ORDER BY** | Ordena o resultado | `ASC` (padrão) ou `DESC` |
| **Procedure** | Rotina que executa ações, sem retorno obrigatório | Chamada com `CALL` |
| **Query** | Consulta SQL | Ver "consulta" |
| **Registro** | Linha da tabela | Ver "linha" |

## S–Z

| Termo | Significado | Observação |
| --- | --- | --- |
| **SELECT** | Comando de consulta | `SELECT *` ou lista de colunas |
| **SGBD** | Sistema Gerenciador de Banco de Dados | MySQL é um exemplo |
| **Tabela** | Estrutura com linhas e colunas | Criada com `CREATE TABLE` |
| **Trigger** | Gatilho automático em evento de tabela | `AFTER INSERT`, `FOR EACH ROW`, `NEW.coluna` |
| **UNIQUE** | Constraint que impede repetição | Cria índice automático |
| **View** | Consulta salva usada como tabela | `CREATE VIEW ... AS SELECT ...` |
| **WHERE** | Filtra linhas antes de agrupar | Aceita `AND`, `OR`, `IN`, `BETWEEN`, `LIKE`, `IS NULL` |

## Funções que aparecem no material

| Função | Categoria | Para que serve |
| --- | --- | --- |
| `UPPER` / `LOWER` | texto | caixa alta/baixa |
| `CONCAT` | texto | juntar valores |
| `LENGTH` | texto | comprimento |
| `LEFT` / `SUBSTRING` | texto | extrair trecho |
| `LOCATE` | texto | posição de substring |
| `RPAD` | texto | preencher à direita |
| `REPLACE` | texto | substituir trecho |
| `FORMAT` | texto/número | formatar com casas decimais |
| `ROUND` | número | arredondar |
| `FLOOR` / `CEIL` | número | arredondar para baixo/cima |
| `MOD` | número | resto |
| `CURDATE` | data | data atual |
| `DATE_FORMAT` | data | formatar data |
| `TIMESTAMPDIFF` | data | diferença em anos/meses/dias |
| `DATEDIFF` | data | diferença em dias |
| `DATE_ADD` | data | somar intervalo |
| `YEAR` / `MONTH` | data | extrair parte da data |
| `IF` | condicional | escolha simples |
| `IFNULL` | condicional | substituir `NULL` |
| `COALESCE` | condicional | primeiro valor não nulo |
| `NULLIF` | condicional | devolve `NULL` se iguais |
| `COUNT` | agregação | contar |
| `SUM` | agregação | somar |
| `AVG` | agregação | média |

## Expressões que confundem

- **"Function" x "procedure"**: function retorna valor e entra no `SELECT`;
  procedure executa ações e é chamada com `CALL`.
- **"WHERE" x "HAVING"**: `WHERE` filtra linhas; `HAVING` filtra grupos.
- **"JOIN" x "subquery"**: o corpus só cobre JOIN; subquery não está indexada.
- **"Constraint" x "tipo"**: `NOT NULL` é constraint; `VARCHAR(100)` é tipo.
- **"NULL" x "vazio"**: `NULL` é ausência; `''` é string vazia.

> Fontes: `conhecimento/DSM2/BD2/banco-de-dados-2.md`,
> `conhecimento/DSM2/BD2/script-rh.md`,
> `conhecimento/DSM2/BD2/script-procedure.md`,
> `conhecimento/DSM2/BD2/aula02-consultas-basicas-sql.md`.
