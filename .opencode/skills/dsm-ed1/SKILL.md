---
name: DSM — Estrutura de Dados I (ED1)
description: Responde dúvidas de Estrutura de Dados I do curso DSM usando o material local em conhecimento/DSM2/ED1. Cobre estruturas homogêneas (vetores e matrizes), indexação a partir de zero, inserção por declaração/manual/laço, ordenação (Bubble, Insertion, Selection, Merge e Quick Sort), recursão (caso trivial, caso geral, pilha de chamadas), dividir e conquistar, complexidade e notação Big-O, ponteiros (& e *), alocação dinâmica com malloc, structs/typedef e implementações de pilha e fila em C. Use quando a pergunta citar ED1, estrutura de dados, vetor, matriz, ordenação, Bubble Sort, Insertion Sort, Selection Sort, Merge Sort, Quick Sort, recursão, complexidade, Big-O, ponteiro, malloc, struct, pilha, fila ou lista encadeada.
metadata:
  opencode/autoinvoke: false
---

# Estrutura de Dados I (DSM2/ED1)

Skill de disciplina. Responde **somente** com base no material indexado e cita a
fonte em toda resposta técnica. O corpus tem 4 apresentações (PPTX, sem
paginação), 1 relatório em PDF (5 páginas), 1 arquivo Markdown de aula e 21
programas em C.

## Escopo

Entram: estruturas de dados homogêneas e heterogêneas; vetores (declaração,
índices, limite `K-1`, inserção por declaração/manual/laço, constante de tamanho,
maior valor, cópia e leitura); matrizes (n dimensões, linhas e colunas, `L-1` e
`C-1`, as três formas de inserção, matriz identidade, diagonal principal, maior
elemento e posição); ordenação (critério, tempo e memória, recursivos × não
recursivos); Bubble Sort, Insertion Sort e Selection Sort; recursão (caso
trivial, caso geral, pilha de chamadas, desempilhamento); dividir e conquistar;
Merge Sort (divisão, fusão/intercalação e complexidade `O(n log n)`); Quick Sort
(pivô, partição e chamadas recursivas); notação Big-O; ponteiros (`&`, `*` e
aritmética básica); alocação dinâmica com `malloc`; `struct` e `typedef struct`;
pilha (histórico de navegação com `topo`) e fila (impressão com `inicio`/`fim`).

Não entram (e não devem ser inventados como se fossem do material): busca
(linear e binária), listas encadeadas em teoria, árvores, grafos, tabelas hash,
análise amortizada, notação Ω/Θ formal, `free`/`realloc`, `calloc`, arquivos em
C, `union`, `enum`, ponteiros para funções e a atividade de revisão em RAR.

## Protocolo obrigatório

1. **Busque antes de responder.**

   ```bash
   python3 ferramentas/buscar.py "selection sort comparacoes movimentos" --disciplina DSM2/ED1 --limite 8
   ```

2. **Leia o trecho** e responda com o vocabulário do material (por exemplo,
   "método das trocas sucessivas" para Bubble Sort).

3. **Cite sempre**, com a forma de citação certa:

   - PDF (`exercicio-merge-sort.md`): `arquivo.md, p. N`.
   - PPTX (`vetor.md`, `matriz.md`, `algoritmos-de-ordenacao-*.md`):
     `arquivo.md, slide N` — **nunca** invente `p. N` para slide.
   - Markdown de aula (`estrutura-de-dados.md`): cite a seção ou a data
     (`§BubbleSort`, `aula de 17/03/2026`).
   - Programas `.c`: cite `arquivo.md` e a função (`main`, `bubbleSort`,
     `merge`), sem número de linha inventado.

4. **Distinga o que é aula do que é código do aluno.** Os arquivos em C são
   implementações de exercícios e exemplos, não gabarito oficial. Se o código
   tiver erro, aponte o erro em vez de copiá-lo.

5. **Nunca prometa complexidade que o corpus não afirma.** O material só dá
   `O(n log n)` para o Merge Sort; para Bubble, Insertion e Selection ele fala em
   número de comparações e movimentos, não em Big-O.

6. **Se não houver cobertura**, diga "isso não está no material indexado de ED1"
   e só então ofereça conhecimento externo, rotulado.

## Distinções que o aluno costuma errar

| Confusão | Como o corpus trata |
| --- | --- |
| Vetor começa no índice 1 | O primeiro elemento é o índice **0**; a última posição de um vetor de tamanho `K` é `K-1` — `vetor.md`, slide 11 |
| Matriz é só bidimensional | Matriz pode ter **n dimensões**; o curso trabalha com 2 — `estrutura-de-dados.md`, §Matriz |
| Último elemento da matriz é `[L][C]` | É `[L-1][C-1]` — `matriz.md`, slide 13 |
| Bubble Sort "flutua" o menor | Ele posiciona o **maior** elemento para o fim a cada passo — `algoritmos-de-ordenacao-nao-recursivos.md`, slide 8 |
| Insertion Sort é o mesmo que Selection | Inserção desloca elementos para abrir espaço; seleção procura o menor e troca — slides 18–19 e 29–30 |
| Selection Sort é o mais rápido | Ele tem poucos **movimentos**, mas o número de **comparações** é igual com vetor ordenado ou não — slide 32 |
| Recursão é só uma função que se chama | Precisa de **caso trivial** e **caso geral**, e usa uma pilha de chamadas — `algoritmos-de-ordenacao-recursivos.md`, slides 6–8 |
| Quick Sort precisa combinar no final | A fase de conquista "nada tem a fazer": a lista já fica ordenada pela partição — slide 25 |
| Merge Sort é `O(n²)` no pior caso | O relatório afirma `O(n log n)` nos três casos — `exercicio-merge-sort.md`, p. 2 |
| `&` guarda o valor | `&` obtém o **endereço**; `*` acessa o **conteúdo** apontado — `ponteiros-main.md` |
| Pilha e fila são a mesma estrutura | Pilha remove do **topo** (LIFO); fila remove do **início** (FIFO) — `exercicio05.md` e `exercicio06.md` |

## Números e fatos que precisam sair exatos

- **Vetor:** primeiro índice **0**; tamanho `K` → última posição `K-1` —
  `vetor.md`, slide 11.
- **Matriz `int matriz[2][5]`:** 2 linhas e 5 colunas, **10 elementos** —
  `matriz.md`, slides 8 e 11.
- **Matriz `7x5`:** 35 elementos — `matriz.md`, slide 24.
- **Formas de inserção:** **3** para vetor e **3** para matriz —
  `vetor.md`, slide 13; `matriz.md`, slide 15.
- **Algoritmos não recursivos principais:** **3** — Bubble, Insertion e
  Selection — `algoritmos-de-ordenacao-nao-recursivos.md`, slide 7.
- **Vetor do exemplo do Merge Sort:** `(30, 45, 21, 20, 6, 715, 100, 65, 33)` —
  `algoritmos-de-ordenacao-recursivos.md`, slide 20.
- **Vetor do exemplo do Quick Sort:** `(4, 3, 6, 7, 9, 10, 5, 8)` — slide 26.
- **Merge Sort:** `O(n log n)` no melhor, no médio e no pior caso —
  `exercicio-merge-sort.md`, p. 2.
- **Comparações e movimentos do Insertion Sort:** mínimo com vetor **ordenado**;
  máximo com vetor em **ordem reversa** —
  `algoritmos-de-ordenacao-nao-recursivos.md`, slide 28.
- **Selection Sort:** número de comparações **igual** para vetor ordenado ou
  não — slide 32.
- **Trabalho da dança:** vídeo de **3 a 5 minutos**, entrega **23/03** —
  `estrutura-de-dados.md`, §Trabalho.
- **Cinco algoritmos pedidos na prática:** Bubble, Insertion, Selection, Merge
  e Quick — `algoritmos-de-ordenacao-nao-recursivos.md`, slide 33.

## Cuidados ao responder

- As quatro apresentações **não têm paginação**. Cite `slide N`.
- Só `exercicio-merge-sort.md` tem páginas (`p. 1–5`).
- `exercicio-merge-sort.md`, p. 3, diz "Implementação em C", mas o código
  transcrito é **JavaScript** (`function`, `const`, `let`). Registre a
  divergência e, se o aluno quiser C, ofereça a versão do
  `exercicio-exercicios-21-05-exercicio03.md`.
- `estrutura-de-dados.md` tem tabelas de Insertion Sort desalinhadas: a linha
  "Inserir 90 → posição 0" repete o passo anterior. O vetor correto após inserir
  o 90 é `[1, 2, 3, 5, 90, 6]`.
- Vários códigos **não compilam**:
  - `matriz-matriz.md` tem laço de impressão `for(...; i < 1; i--)`
    (loop infinito) e não inicializa toda a matriz;
  - `ponteiros-exercicio-2-main.md` usa `carro.modelo` em vez de
    `carro->modelo`, e não libera a memória;
  - `struct-pesquisa-main.md` declara `habitantes[1]` mas percorre até 500;
  - `exercicio03` tem `for (...) 0{`, `j` não declarado no `insertionSort` e
    `while (int j >= 0)`;
  - `exercicio02` usa `i` fora do `for` (`for (i = 0; ...)`).
  Use esses arquivos como **exemplo do que corrigir**, não como referência.
- `algoritmos-de-ordenacao-selection-sort.md` está **vazio** (só o `main`); a
  implementação de Selection está em `exercicio03`.
- `main.md` mostra `*p2 = *p2 + 1`, mas o comentário diz "Atribuindo o valor para
  p2"; o correto é atribuir ao **conteúdo** apontado.
- `struct-main.md` e `struct-livro-main.md` usam `scanf("%s", &alunos[i].nome)`;
  o `&` é desnecessário para vetor de `char`, embora funcione.
- `struct-livro-main.md` lê `preco` com `%s` em um `float`.
- `exercicio05` implementa **pilha** (histórico, `topo`) e `exercicio06`
  implementa **fila** (impressão, `inicio`/`fim`); não há teoria de pilha/fila
  nos slides.
- `DSM2/ED1/Ponteiros/FILA/filca.c` (fila dinâmica com lista encadeada) **não
  entrou no corpus** pela regra de seleção de código; não o cite como indexado.
- `ATV_REVISAO_PARTE_2_Haimon Cugler Vieira.rar` contém apenas as seis versões
  dos exercícios 21-05; não há enunciado novo nem gabarito.
- Não há gabarito oficial de nenhum exercício.
- Não altere os arquivos em `DSM2/ED1/`.

## Referências

- `references/00-visao-geral.md` — cobertura, sequência didática e lacunas.
- `references/01-conceitos.md` — vetores, matrizes, ordenação, recursão,
  ponteiros, structs, pilha e fila.
- `references/02-exercicios.md` — práticas dos slides e exercícios 21-05.
- `references/03-fontes.md` — inventário dos 27 arquivos e mapa de slides.
- `references/04-glossario.md` — termos de estrutura de dados e C.
