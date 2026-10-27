# Visão geral — Modelagem de Banco de Dados (DSM1/MBD)

## O que o material cobre

O corpus de MBD é curto e conceitual. Ele apresenta a evolução dos modelos de
dados e termina no **modelo relacional**, com tabelas, chaves e
relacionamentos. Não é um curso de SQL nem de normalização.

Sequência real das três aulas:

1. **Aula 01 — introdução.** O que é banco de dados, por que importa, história,
   componentes, arquitetura em níveis, tipos e funções de um SGBD.
2. **Aula 02 — modelos antigos.** Modelo em rede (grafo, múltiplos pais) e
   modelo hierárquico (árvore, um pai), com comparação e casos de uso.
3. **Aula 03 — modelo relacional.** Tabelas, linhas e colunas, chave primária,
   chave estrangeira, relacionamentos 1:1, 1:N e N:N, e um exercício de
   modelagem de cursos.

O quarto arquivo, `clientes-registro-dos-clientes.md`, é um rascunho de
modelagem de uma bicicletaria. Serve para praticar entidades e atributos, não
como teoria.

## Sequência didática que o corpus revela

| Ordem | Tema | Onde está |
| --- | --- | --- |
| 1 | Conceito de banco de dados e exemplos do dia a dia | aula 01, p. 1 |
| 2 | História: 1960s, 1970 (Codd), 1980, 2000 | aula 01, p. 1–2 |
| 3 | Componentes do SGBD | aula 01, p. 2 |
| 4 | Níveis de abstração: físico, lógico, visão | aula 01, p. 3 |
| 5 | Tipos de SGBD e funções | aula 01, p. 3–4 |
| 6 | Modelo em rede | aula 02, p. 1 e 3 |
| 7 | Modelo hierárquico | aula 02, p. 1–2 |
| 8 | Comparação rede × hierárquico | aula 02, p. 2–3 |
| 9 | Modelo relacional, tabelas e chaves | aula 03, p. 1–4 |
| 10 | Relacionamentos 1:1, 1:N e N:N | aula 03, p. 4–5 |
| 11 | Exercício de modelagem de cursos | aula 03, p. 5–6 |
| 12 | Rascunho da bicicletaria | `clientes-registro-dos-clientes.md` |

## O que o corpus NÃO cobre

- Notação MER formal (retângulos, losangos, cardinalidades).
- Normalização e formas normais.
- Álgebra relacional com operadores.
- SQL (DDL, DML, consultas).
- Modelo físico, índices, particionamento.
- Dicionário de dados.

Quando a pergunta exigir um desses tópicos, responda o que existir e declare
explicitamente a lacuna. Não complete com SQL de BD2.

## Como estudar por este material

1. Leia a aula 01 inteira; ela dá o vocabulário.
2. Compare rede e hierárquico pela tabela de vantagens e desvantagens da aula 02.
3. Refaça o exemplo de cursos da aula 03 sem olhar: identifique PK, FK e o tipo
   de cada relacionamento.
4. Use a bicicletaria como exercício aberto: liste entidades, atributos e
   relações, e aponte o que o rascunho deixa ambíguo.

## Limite de confiança

Os PDFs são resumos de aula. As imagens e diagramas não foram preservados na
extração, então descrições visuais podem faltar. O texto é suficiente para
conceitos e definições, mas não para reproduzir figuras.
