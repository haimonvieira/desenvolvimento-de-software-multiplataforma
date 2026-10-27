---
name: DSM — Materiais do curso
description: Roteia perguntas sobre as disciplinas do curso de Desenvolvimento de Software Multiplataforma (Fatec) para o material local indexado. Use quando a pergunta citar uma disciplina do DSM (ALP, DD, DW1, ES1, MBD, PI, SORC1, BD2, DW2, ED1, ES2, MPC, TPI, AL, BDNR, DW3, GAPS, IHC, ING1, TP2), um assunto do curso, um exercício, uma prova ou um arquivo de DSM1/DSM2/DSM3.
---

# Materiais do curso DSM

Roteadora única. Identifica a disciplina, carrega a skill de disciplina quando
ela existe e garante que a resposta cite o material local.

## Protocolo

1. **Identifique a disciplina.** Use a tabela abaixo e o mapa detalhado em
   `references/mapa-disciplinas.md`. Se a pergunta citar duas disciplinas, trate
   as duas.

2. **Se houver mais de uma disciplina possível, pergunte** qual antes de
   responder. Exemplo: "isso é de MBD (modelagem) ou de BD2 (SQL)?".

3. **Carregue a skill da disciplina** com a ferramenta `skill`, usando o ID
   exato (coluna "ID"). As skills de disciplina são ocultas de propósito; elas
   não aparecem sozinhas na lista.

4. **Siga o protocolo da skill carregada.** Ela define busca, citação, erros
   comuns e limites daquela matéria.

5. **Se a disciplina ainda não tiver skill curada** (estado "pendente"),
   não finja que ela existe. Busque direto no corpus:

   ```bash
   python3 ferramentas/buscar.py "termo" --disciplina DSM2/DW2 --limite 8
   ```

   Leia o arquivo retornado, responda e cite
   `conhecimento/<SEM>/<SIGLA>/<arquivo>.md` (p. N quando houver).

6. **Se nada for encontrado**, diga: "isso não está no material indexado" e só
   então ofereça conhecimento externo, claramente rotulado.

## Disciplinas

| Semestre | Sigla | Disciplina | ID da skill | Estado |
| --- | --- | --- | --- | --- |
| DSM1 | ALP | Algoritmos e Lógica de Programação | `dsm-alp` | **pronta** |
| DSM1 | DD | Design Digital | `dsm-dd` | **pronta** |
| DSM1 | DW1 | Desenvolvimento Web I | `dsm-dw1` | pendente |
| DSM1 | ES1 | Engenharia de Software I | `dsm-es1` | **pronta** |
| DSM1 | MBD | Modelagem de Banco de Dados | `dsm-mbd` | **pronta** |
| DSM1 | PI | Projeto Integrador I | `dsm-pi` | pendente |
| DSM1 | SORC1 | Sistemas Operacionais e Redes de Computadores | `dsm-sorc1` | **pronta** |
| DSM2 | BD2 | Banco de Dados II | `dsm-bd2` | **pronta** |
| DSM2 | DW2 | Desenvolvimento Web II | `dsm-dw2` | pendente |
| DSM2 | ED1 | Estrutura de Dados I | `dsm-ed1` | pendente |
| DSM2 | ES2 | Engenharia de Software II | `dsm-es2` | **pronta** |
| DSM2 | MPC | Matemática para Computação | `dsm-mpc` | **pronta** |
| DSM2 | TPI | Técnicas de Programação I | `dsm-tpi` | pendente |
| DSM3 | AL | Álgebra Linear | `dsm-al` | **pronta** |
| DSM3 | BDNR | Banco de Dados Não Relacional | `dsm-bdnr` | **pronta** |
| DSM3 | DW3 | Desenvolvimento Web III | `dsm-dw3` | pendente |
| DSM3 | GAPS | Gestão Ágil de Projetos de Software | `dsm-gaps` | pendente |
| DSM3 | IHC | Interação Humano-Computador | `dsm-ihc` | **pronta** |
| DSM3 | ING1 | Inglês I | `dsm-ing1` | **pronta** |
| DSM3 | TP2 | Técnicas de Programação II | `dsm-tp2` | pendente |

## Sinais rápidos de disciplina

| Se a pergunta menciona… | Vá para |
| --- | --- |
| SQL, MySQL, tabela, JOIN, SELECT, function, trigger | `dsm-bd2` |
| pseudocódigo, VisuAlg, lógica, vetor, matriz | `dsm-alp` |
| HTML, CSS, página, layout, formulário | `dsm-dw1` |
| JavaScript, Node.js, Express, API, rota | `dsm-dw2` |
| MongoDB, documento, NoSQL, aggregation | `dsm-bdnr` |
| Java, orientação a objetos, classe, herança | `dsm-tpi` / `dsm-tp2` |
| ordenação, busca, complexidade, fila, pilha | `dsm-ed1` |
| requisito, caso de uso, UML, viabilidade | `dsm-es1` / `dsm-es2` |
| Scrum, Kanban, sprint, backlog | `dsm-gaps` |
| persona, usabilidade, heurística, IHC | `dsm-ihc` |
| autovetor, matriz, determinante, espaço vetorial | `dsm-al` |
| conjuntos, lógica proposicional, combinatória | `dsm-mpc` |
| design, cor, tipografia, identidade visual | `dsm-dd` |
| rede, TCP/IP, topologia, Linux, cabeamento | `dsm-sorc1` |
| artigo, projeto integrador, pesquisa | `dsm-pi` |
| texto em inglês, reading, grammar | `dsm-ing1` |

## Regras

- Nunca responda uma pergunta de disciplina só com conhecimento geral se houver
  material indexado. Busque primeiro.
- Toda resposta técnica precisa de citação de arquivo (e página, quando PDF).
- Não altere nada em `DSM1/`, `DSM2/` ou `DSM3/`; a fonte da verdade são os
  originais, e o corpus em `conhecimento/` é derivado.
- Se a disciplina estiver marcada como pendente, diga que a curadoria ainda não
  foi feita, mas que o corpus existe e pode ser consultado.
- Se a pergunta for sobre a própria camada de conhecimento (como buscar, como
  indexar), aponte `ferramentas/README.md`.

## Mapa detalhado

`references/mapa-disciplinas.md` traz, por disciplina, os temas cobertos, os
tipos de fonte e os sinais de busca. Consulte antes de decidir que uma pergunta
está fora do corpus.
