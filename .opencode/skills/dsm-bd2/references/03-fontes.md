# Fontes do corpus — BD2

Inventário dos 16 arquivos em `conhecimento/DSM2/BD2/`. O corpus é gerado a
partir dos originais em `DSM2/BD2/`, que **não são alterados**.

## Tabela completa

| Arquivo no corpus | Original | Tipo | Págs. | Conteúdo | Confiabilidade |
| --- | --- | --- | --- | --- | --- |
| `aula02-consultas-basicas-sql.md` | `DSM2/BD2/Aula02_Consultas_Básicas_SQL.pdf` | PDF | 7 | Aula base: CREATE, INSERT, SELECT, WHERE, exercícios e próximos passos | Alta (material do professor) |
| `aula02-script-aula-24022026-consultas-basicas.md` | `DSM2/BD2/Aula02_Script_Aula_24022026_Consultas Básicas.sql` | SQL | — | Script da mesma aula, com os mesmos exemplos | Alta |
| `script-escola.md` | `DSM2/BD2/script escola.sql` | SQL | — | ~25 consultas comentadas sobre `escola` | Alta; tem 2 erros de digitação em dados (`Admnistração`, `Tarede`) |
| `script-restricoes.md` | `DSM2/BD2/script RESTRICOES.sql` | SQL | — | Constraints em `alunos` e `matriculas`, com CASCADE | Alta |
| `banco-de-dados-2.md` | `DSM2/BD2/Banco de dados 2.md` | MD | — | Resumo teórico de constraints | Média; notas pessoais, sem exemplos completos |
| `script-join.md` | `DSM2/BD2/script JOIN.sql` | SQL | — | `joins_demo`: INNER, LEFT, RIGHT, auto-FK, ENUM | Alta |
| `script-livraria.md` | `DSM2/BD2/script livraria.sql` | SQL | — | JOIN por vírgula, `TIMESTAMPDIFF`, `LIMIT` | Alta; script curto |
| `script-rh.md` | `DSM2/BD2/script RH.sql` | SQL | — | Funções nativas, stored functions e respostas A1–C1 | Alta para sintaxe; respostas com falhas (ver `02-exercicios.md`) |
| `aula06-lista-de-exercicios-functions.md` | `DSM2/BD2/AULA06 - LISTA DE EXERCÍCIOS - FUNCTIONS.docx` | DOCX | — | Enunciados A1–C1 | Alta |
| `script-procedure.md` | `DSM2/BD2/script PROCEDURE.sql` | SQL | — | Functions, procedures, trigger e view | Alta |
| `atividade-mysql.md` | `DSM2/BD2/atividade_mysql.pdf` | PDF | 4 | Atividade FastRibeira, 15 questões | Alta; **sem gabarito** e sem o `.sql` do banco |
| `exercicio-atividade-1-n1-haimon-cugler-vieira.md` | `DSM2/BD2/exercicio/Atividade 1 - N1 - HAIMON CUGLER VIEIRA.pdf` | PDF | 12 | Prova N1 AgroVerde com respostas do aluno | Média; respostas têm erros e a Q3 está sem gabarito |
| `exercicio-sc.md` | `DSM2/BD2/exercicio/sc.sql` | SQL | — | Script e respostas Q1/Q2 da N1 | Média; Q2.1 e Q2.2 incompletas |
| `script-agroverde.md` | `DSM2/BD2/script agroverde.sql` | SQL | — | Drill de filtros A–D | Alta |
| `atv2-haimon-cugler-vieira.md` | `DSM2/BD2/ATV2_HAIMON_CUGLER_VIEIRA.sql` | SQL | — | Script AgroVerde do aluno | Média; duplicata parcial de `script-agroverde.md` |
| `script-java.md` | `DSM2/BD2/script JAVA.sql` | SQL | — | Banco mínimo de clientes | Baixa relevância; só aquecimento |

## Como o corpus foi gerado

1. `python3 ferramentas/inventariar.py` lista as fontes e estima páginas/tokens.
2. `python3 ferramentas/extrair.py --disciplina DSM2/BD2` gera os `.md`.
3. `python3 ferramentas/indexar.py` reconstrói o índice FTS5.

Cada `.md` tem frontmatter com `disciplina`, `titulo`, `fonte`, `tipo`,
`paginas` e `extraido_em`. PDFs recebem marcadores `<!-- page: N -->`, usados na
citação.

## Regras de citação

Formato para PDF:

```text
Fonte: conhecimento/DSM2/BD2/aula02-consultas-basicas-sql.md (p. 4) — original: DSM2/BD2/Aula02_Consultas_Básicas_SQL.pdf
```

Formato para SQL/DOCX/MD (sem página):

```text
Fonte: conhecimento/DSM2/BD2/script-rh.md — original: DSM2/BD2/script RH.sql
```

Se a resposta combinar duas fontes, cite as duas. Se o trecho vier de um
comentário dentro do `.sql`, diga isso (ex.: "comentário do script, não
enunciado oficial").

## O que não está no corpus

- `fastribeira_banco.sql`, necessário para executar a atividade FastRibeira;
- respostas da Questão 3 da N1 (só enunciados);
- gabarito oficial de qualquer lista (as respostas são do professor/aluno);
- aula teórica sobre `GROUP BY`/`HAVING`;
- normalização, subqueries, transações, índices e modelagem MER.

Ao responder sobre esses pontos, informe a lacuna antes de complementar.

## Atualização

Quando o usuário adicionar material novo em `DSM2/BD2/`:

```bash
python3 ferramentas/inventariar.py
python3 ferramentas/extrair.py --disciplina DSM2/BD2
python3 ferramentas/indexar.py
python3 ferramentas/validar.py
```

Não edite os `.md` de `conhecimento/` à mão: eles são derivados. Ajustes de
curadoria vão nas references da skill e em `_meta.json`.
