# Visão geral — ED1 (DSM2/ED1)

## O que o material cobre

O corpus tem **27 arquivos**: 4 apresentações (PPTX), 1 relatório em PDF (5 p.),
1 anotação de aula em Markdown e 21 programas em C.

| Bloco | Arquivos | Papel |
| --- | --- | --- |
| Vetores | `vetor.md`, `vetor-ex1.md`, `vetor-ex2.md` | Estrutura homogênea unidimensional e exercícios |
| Matrizes | `matriz.md`, `matriz-matriz.md`, `matriz-matriz-identidade.md`, `matriz-ex02.md`, `matriz-ex03.md` | Estrutura bidimensional e práticas |
| Ordenação não recursiva | `algoritmos-de-ordenacao-nao-recursivos.md`, `estrutura-de-dados.md`, `algoritmos-de-ordenacao-bubble.md`, `algoritmos-de-ordenacao-selection-sort.md` | Bubble, Insertion e Selection |
| Ordenação recursiva | `algoritmos-de-ordenacao-recursivos.md`, `exercicio-merge-sort.md` | Recursão, Merge Sort e Quick Sort |
| Ponteiros e alocação | `ponteiros-main.md`, `ponteiros-exercicio-main.md`, `ponteiros-exercicio-2-main.md`, `main.md` | `&`, `*`, `malloc` |
| Structs | `struct-main.md`, `struct-livro-main.md`, `struct-pesquisa-main.md` | Registros e vetores de struct |
| Exercícios 21-05 | `exercicio-exercicios-21-05-exercicio01` a `06` | Vetor, matriz, os cinco sorts, struct, pilha e fila |

## Sequência didática que o corpus revela

| Ordem | Tema | Onde está |
| --- | --- | --- |
| 1 | Estruturas homogêneas, vetor e índice zero | `vetor.md`, slides 4–21 |
| 2 | Matriz, linhas/colunas e inserção | `matriz.md`, slides 3–25 |
| 3 | Ordenação: critério e classificação | `estrutura-de-dados.md`, §Algoritmos de Ordenação |
| 4 | Bubble, Insertion e Selection | `algoritmos-de-ordenacao-nao-recursivos.md` |
| 5 | Recursão, caso trivial e pilha de chamadas | `algoritmos-de-ordenacao-recursivos.md`, slides 3–8 |
| 6 | Merge Sort e Quick Sort | `algoritmos-de-ordenacao-recursivos.md`, slides 10–26 |
| 7 | Relatório do Merge Sort (trabalho) | `exercicio-merge-sort.md` |
| 8 | Ponteiros, `malloc` e structs | arquivos de `Ponteiros/` e `Struct/` |
| 9 | Prática integrada | `Exercicios 21-05` |

## Progressão de dificuldade

1. **Estrutura estática** (vetor): declarar, indexar e percorrer.
2. **Duas dimensões** (matriz): dois índices e dois laços.
3. **Algoritmos iterativos**: comparar, trocar, deslocar e selecionar.
4. **Recursão**: caso trivial, caso geral e pilha de chamadas.
5. **Dividir e conquistar**: Merge e Quick Sort.
6. **Memória**: ponteiros, `&`, `*` e `malloc`.
7. **Registros**: `struct` e `typedef struct`.
8. **Estruturas lineares**: pilha e fila implementadas com vetor.

## O que o corpus NÃO cobre

- Busca linear e busca binária.
- Listas encadeadas em teoria (só o `filca.c`, que ficou fora do corpus).
- Árvores, grafos e tabelas hash.
- Análise assintótica formal (Ω e Θ), recorrências e prova de complexidade.
- Complexidade de Bubble, Insertion, Selection e Quick no material — só o Merge
  Sort tem `O(n log n)` explícito.
- `free`, `realloc`, `calloc` e vazamento de memória como conteúdo de aula.
- Arquivos, `union`, `enum` e ponteiros para funções.
- Teoria de pilha e fila: existem apenas as implementações dos exercícios 05 e
  06, sem slides.
- Gabarito de qualquer exercício.

## Como estudar por este material

1. Saiba explicar por que o índice começa em **0** e termina em **K-1**.
2. Declare e percorra vetor e matriz sem decorar código.
3. Explique cada sort em **uma frase** e mostre um passo a passo curto.
4. Diferencie **movimentos** de **comparações** no Selection Sort.
5. Entenda a pilha de chamadas da recursão antes de estudar Merge e Quick.
6. Saiba onde `&` e `*` aparecem em um programa com ponteiro.
7. Implemente pilha e fila com vetor e dois índices.
8. Resolva os exercícios 21-05 antes de olhar as respostas derivadas.

## Limite de confiança

Os PPTX são bons em conceito e fracos em código (vários slides de código são só
imagem). O `estrutura-de-dados.md` é anotação de aula, com erros de digitação e
tabelas desalinhadas. Os programas em C são **trabalhos de aluno**, muitos com
erros de compilação. O relatório do Merge Sort é o único texto contínuo e é a
fonte mais confiável para complexidade. Nenhum exercício tem gabarito oficial.
