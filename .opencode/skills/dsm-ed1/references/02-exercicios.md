# Exercícios e atividades — ED1

## Panorama

| Fonte | O que é | Tem gabarito? |
| --- | --- | --- |
| `vetor.md`, slide 21 | 2 exercícios (média de 4 notas; soma de 2 vetores) | **Não** |
| `matriz.md`, slides 22–24 | 3 práticas (identidade, diagonal, maior elemento) | **Não** |
| `algoritmos-de-ordenacao-nao-recursivos.md`, slide 33 | Vídeo de dança com 5 sorts | **Não** |
| `algoritmos-de-ordenacao-recursivos.md`, slides 20 e 26 | Execução passo a passo de Merge e Quick | **Não** |
| `exercicio-exercicios-21-05-exercicio01` a `06` | Seis programas de aluno | **Não** (são respostas, não gabarito) |
| `exercicio-merge-sort.md` | Relatório do trabalho | É o trabalho, não gabarito |

**Tudo o que vem abaixo é resposta derivada** — diga isso ao aluno.

## Práticas dos slides

### Vetor, exercício 01 — média de 4 notas

```c
#include <stdio.h>

int main(void) {
    float notas[4], soma = 0;

    for (int i = 0; i < 4; i++) {
        printf("Nota %d: ", i + 1);
        scanf("%f", &notas[i]);
        soma += notas[i];
    }

    printf("Media: %.2f\n", soma / 4);
    return 0;
}
```

Fonte do enunciado: `vetor.md`, slide 21. Implementação equivalente no corpus:
`vetor-ex1.md`.

### Vetor, exercício 02 — soma de posições equivalentes

```c
#include <stdio.h>

int main(void) {
    int v1[5], v2[5];

    for (int i = 0; i < 5; i++) scanf("%d", &v1[i]);
    for (int i = 0; i < 5; i++) scanf("%d", &v2[i]);

    for (int i = 0; i < 5; i++)
        printf("Soma[%d] = %d\n", i, v1[i] + v2[i]);

    return 0;
}
```

Atenção: o enunciado pede "imprima a soma das posições equivalentes" (cinco
somas). O `vetor-ex2.md` soma **tudo** em um único inteiro; as duas leituras são
possíveis, mas a do enunciado é posição a posição.

### Matriz, prática 01 — matriz identidade de ordem `n`

```c
#include <stdio.h>

#define MAX 50

int main(void) {
    int n, m[MAX][MAX];

    printf("Ordem: ");
    scanf("%d", &n);

    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            m[i][j] = (i == j) ? 1 : 0;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) printf("%d ", m[i][j]);
        printf("\n");
    }
    return 0;
}
```

Fonte: `matriz.md`, slide 22. Versões do corpus: `matriz-matriz-identidade.md`
(3x3 fixa) e `matriz-ex02.md` (5x5 com diagonal em vetor).

### Matriz, prática 02 — diagonal principal em vetor (ordem 5)

```c
#include <stdio.h>

int main(void) {
    int m[5][5], diag[5];

    for (int i = 0; i < 5; i++)
        for (int j = 0; j < 5; j++)
            scanf("%d", &m[i][j]);

    for (int i = 0; i < 5; i++) diag[i] = m[i][i];

    for (int i = 0; i < 5; i++) printf("%d ", diag[i]);
    printf("\n");
    return 0;
}
```

Fonte: `matriz.md`, slide 23. A diagonal principal é `m[i][i]`.

### Matriz, prática 03 — maior elemento e posição em matriz 7x5

```c
#include <stdio.h>

int main(void) {
    int m[7][5];
    int maior, lin = 0, col = 0;

    for (int i = 0; i < 7; i++)
        for (int j = 0; j < 5; j++)
            scanf("%d", &m[i][j]);

    maior = m[0][0];
    for (int i = 0; i < 7; i++)
        for (int j = 0; j < 5; j++)
            if (m[i][j] > maior) {
                maior = m[i][j];
                lin = i;
                col = j;
            }

    printf("Maior: %d em [%d][%d]\n", maior, lin, col);
    return 0;
}
```

Fonte: `matriz.md`, slide 24. O `matriz-ex03.md` faz o mesmo, mas usa `>=`
(fica com a **última** ocorrência do maior) e declara `menor` sem usar.

### Merge Sort — execução passo a passo (slide 20)

Vetor do enunciado: `(30, 45, 21, 20, 6, 715, 100, 65, 33)`.

> **Atenção:** `715` é provavelmente erro de digitação de `7, 15`; do jeito que
> está, são 9 elementos. A execução abaixo trata `715` como um único valor.

Divisão (`meio = (início + fim) / 2`):

```
[30,45,21,20,6,715,100,65,33]
   → [30,45,21,20,6] + [715,100,65,33]
   → [30,45] + [21,20,6] ; [715,100] + [65,33]
   → [30]+[45] ; [21]+[20,6] ; [715]+[100] ; [65]+[33]
   → [20]+[6]
```

Intercalação:

```
[30]+[45]          = [30,45]
[20]+[6]           = [6,20]
[21]+[6,20]        = [6,20,21]
[30,45]+[6,20,21]  = [6,20,21,30,45]
[715]+[100]        = [100,715]
[65]+[33]          = [33,65]
[100,715]+[33,65]  = [33,65,100,715]
[6,20,21,30,45]+[33,65,100,715] = [6,20,21,30,33,45,65,100,715]
```

Fonte do enunciado: `algoritmos-de-ordenacao-recursivos.md`, slide 20.

### Quick Sort — execução passo a passo (slide 26)

Vetor: `(4, 3, 6, 7, 9, 10, 5, 8)`. Convenção: pivô = **último** elemento
(Lomuto), ordem crescente.

```
Pivô 8:  [4,3,6,7,5] 8 [10,9]     posição 5
Pivô 5:  [4,3] 5 [7,6]            posição 2
Pivô 3:  [] 3 [4]                 → [3,4]
Pivô 6:  [] 6 [7]                 → [6,7]
Pivô 9:  [] 9 [10]                → [9,10]
Resultado: [3,4,5,6,7,8,9,10]
```

Fonte do enunciado: `algoritmos-de-ordenacao-recursivos.md`, slide 26.

> O corpus **não** fixa a convenção de pivô nos slides (o código de
> `exercicio03` usa o último e ordena **decrescente**). Declare a convenção
> usada na resposta.

## Exercícios 21-05 (seis programas)

### 01 — Análise de vendas de 30 dias

Lê 30 valores, calcula **maior**, **menor**, **média** e **total**.

```c
#define DIAS 30
...
if (i == 0) { maior = menor = vendas[i]; }
else {
    if (vendas[i] > maior) maior = vendas[i];
    if (vendas[i] < menor) menor = vendas[i];
}
...
media = soma / DIAS;
```

Fonte: `exercicio-exercicios-21-05-exercicio01.md`. O código compila e está
correto.

### 02 — Sistema de notas (5 alunos × 4 avaliações)

Matriz `notas[5][4]`, média por aluno, média da turma e maior nota.

```c
media_aluno[i] = soma_aluno / AVALIACOES;
media_turma = soma_turma / (ALUNOS * AVALIACOES);
```

Fonte: `exercicio-exercicios-21-05-exercicio02.md`.

**Erro de compilação:** o laço de impressão usa `for (i = 0; ...)` sem declarar
`i` fora do primeiro `for` (o primeiro laço declara `int i` só no escopo dele).
Corrija para `for (int i = 0; ...)`.

### 03 — Ordenar 10 preços em ordem decrescente com 5 sorts

O programa copia o vetor cinco vezes e aplica Bubble, Selection, Insertion,
Merge e Quick, imprimindo os cinco resultados.

Fonte: `exercicio-exercicios-21-05-exercicio03.md`.

**Erros de compilação/semântica no arquivo:**

| Local | Problema | Correção |
| --- | --- | --- |
| `imprimirVetor` | `for (...) 0{` | remover o `0` |
| `insertionSort` | `j` não declarado | `int j;` |
| `insertionSort` | `while (int j >= 0 ...)` | `while (j >= 0 ...)` |
| `selectionSort` | variável `maior` guarda **índice** | renomear para `maiorIdx` (funciona, mas confunde) |

Os cinco algoritmos ordenam **decrescente** porque as comparações usam `>`/`<`
invertidos em relação ao padrão crescente. A intenção do enunciado é
decrescente.

### 04 — Cadastro de pacientes com `struct`

```c
typedef struct Paciente {
    char nome[100];
    int idade;
    char cpf[20];
    char tipo_sanguineo[5];
} Paciente;

Paciente paciente[MAX];
scanf(" %[^\n]", paciente[i].nome);
```

Fonte: `exercicio-exercicios-21-05-exercicio04.md`. Compila e está correto.

### 05 — Pilha: histórico de navegação

Implementa **pilha** com vetor de URLs e `topo`:

| Operação | Efeito |
| --- | --- |
| `visitar_pagina` | `topo++` e grava a URL |
| `exibir_pagina_atual` | mostra `paginas[topo]` |
| `voltar_pagina` | mostra a atual e faz `topo--` |
| `exibir_historico` | percorre de `topo` até `0` |

Fonte: `exercicio-exercicios-21-05-exercicio05.md`. Compila e está correto.

### 06 — Fila: fila de impressão

Implementa **fila** com `inicio` e `fim`:

| Operação | Efeito |
| --- | --- |
| `adicionar_documento` | `fim++` e grava |
| `exibir_fila` | percorre de `inicio` até `fim` |
| `imprimir_documento` | lê `inicio` e faz `inicio++` |

Quando `inicio > fim`, chama `inicializar` para reaproveitar o vetor.

Fonte: `exercicio-exercicios-21-05-exercicio06.md`. Compila e está correto.

## Como responder "me dá a resposta"

1. Escreva o programa completo em C, com `#include <stdio.h>` e `main`.
2. Diga que **não há gabarito oficial** no corpus.
3. Se o arquivo do aluno tiver erro, mostre o erro e o código corrigido.
4. Cite `arquivo.md` + `slide N`, `p. N` ou a função.
5. Se o tema for busca, lista encadeada, árvore ou grafo, avise que não está no
   material indexado.
