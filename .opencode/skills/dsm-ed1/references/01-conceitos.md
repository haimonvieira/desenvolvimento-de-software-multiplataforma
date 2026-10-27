# Conceitos consolidados — ED1

> PPTX são citados por `slide N`; o relatório por `p. N`; a anotação de aula por
> seção; os programas em C pelo nome do arquivo e da função.

## 1. Estruturas de dados

"Formas otimizadas de armazenamento e tratamento das informações
eletronicamente" — `vetor.md`, slide 4.

| Classificação | Definição | Representantes |
| --- | --- | --- |
| **Homogênea** | Todos os elementos do mesmo tipo | Vetor e matriz |
| **Heterogênea** | Elementos de tipos diferentes | Registro (`struct`) |

Fonte: `matriz.md`, slide 3; `vetor.md`, slide 5.

- **Vetor** é unidimensional: precisa de **um índice** — `vetor.md`, slide 7.
- **Matriz** é multidimensional: o curso trabalha com **dois índices** (linha e
  coluna) — `matriz.md`, slide 7.
- Ambas são **estáticas**: o tamanho é definido na compilação e não muda —
  `matriz.md`, slide 9; `vetor.md`, slide 8.

### Endereçamento

Os elementos ficam **contíguos** na memória e têm tamanho fixo. A partir do
endereço do primeiro elemento é possível calcular a posição dos demais —
`vetor.md`, slide 8.

## 2. Vetor

### Declaração em C

```c
int vet[5];
```

Lê-se: tipo `int`, nome `vet`, **5 elementos** — `vetor.md`, slide 10 e
`estrutura-de-dados.md`, §Vetor.

### Índices

- O primeiro elemento está em **0**.
- Se o tamanho é `K`, a última posição válida é **`K-1`** —
  `vetor.md`, slide 11.
- Exemplo do material: `vet[0] = 5`, `vet[1] = 3`, `vet[2] = 7`, `vet[3] = 6`,
  `vet[4] = 12`, `vet[5] = 23` — slide 9.

### As três formas de inserção

1. Na **declaração**: `float notas[] = {5, 9.6, 8, 6.7};`.
2. **Manual**, posição por posição: `n[0][0] = 24;`.
3. Com **laço de repetição**, percorrendo os índices.

Fonte: `vetor.md`, slide 13; `estrutura-de-dados.md`, §Operações em uma matriz.

### Tamanho por constante

Quando não se sabe quantos elementos serão usados, define-se uma constante:

```c
#define TAMANHO 10
float precos[TAMANHO];
```

Fonte: `vetor.md`, slide 17; `exercicio-exercicios-21-05-exercicio03.md`.

### Operações clássicas

| Operação | Como fazer | Onde |
| --- | --- | --- |
| Ler todos os elementos | `for (i = 0; i < n; i++) scanf("%d", &v[i]);` | `vetor.md`, slide 20 |
| Encontrar o maior | Inicializar com `v[0]` e comparar no laço | slide 18 |
| Copiar um vetor em outro | Percorrer e atribuir `destino[i] = origem[i]` | slide 19 |
| Calcular média | Somar no laço e dividir pelo tamanho | `vetor-ex1.md` |
| Somar posições equivalentes | `soma += v1[i] + v2[i]` | `vetor-ex2.md` |

## 3. Matriz

### Definição

"Coleção de variáveis de mesmo tipo, acessíveis com um único nome e armazenados
contiguamente na memória", individualizadas por índices — `matriz.md`, slide 7.

### Dimensões

`int matriz[2][5]` tem **2 linhas** e **5 colunas**, portanto **10 elementos** —
`matriz.md`, slides 8 e 11. O total é sempre `linhas × colunas`.

### Índices

O primeiro elemento é `[0][0]`; o último é `[L-1][C-1]` — `matriz.md`,
slide 13.

### As três formas de inserção

1. Na **declaração**:

   ```c
   float matriz[1][5] = {9, 7, 6, 8, 4};
   ```

2. **Manual e direta**:

   ```c
   int n[2][2];
   n[0][0] = 24;
   n[0][1] = 13;
   n[1][0] = 18;
   n[1][1] = 39;
   ```

3. Com **dois laços**:

   ```c
   for (l = 0; l < 3; l++)
       for (c = 0; c < 4; c++)
           scanf("%d", &n[l][c]);
   ```

Fonte: `estrutura-de-dados.md`, §Operações em uma matriz; `matriz.md`,
slide 15.

### Aplicações citadas

Teoria dos Grafos, Computação Gráfica, Tomografia Computadorizada e
Criptografia — `matriz.md`, slide 6.

### Matriz identidade

Matriz **quadrada** em que a diagonal principal vale **1** e o restante vale
**0** — `matriz.md`, slide 22.

```c
for (i = 0; i < ordem; i++)
    for (j = 0; j < ordem; j++)
        matriz[i][j] = (i == j) ? 1 : 0;
```

Implementação do corpus: `matriz-matriz-identidade.md` (3x3) e `matriz-ex02.md`
(5x5, extraindo a diagonal para um vetor).

## 4. Ordenação

"A ordenação é uma operação que organiza um conjunto de elementos em uma
determinada ordem (critério)" — `estrutura-de-dados.md`, §Algoritmos de
Ordenação.

- Pode ser **crescente** ou **decrescente**.
- Aplica-se a vetores, matrizes e estruturas dinâmicas.
- Na escolha do algoritmo, pesam o **tempo de processamento** e o **uso
  econômico da memória** — `algoritmos-de-ordenacao-nao-recursivos.md`, slide 6.

### Classificação

| Tipo | Ideia | Exemplos |
| --- | --- | --- |
| **Não recursivo** | Repetição explícita | Bubble, Insertion, Selection |
| **Recursivo** | Quebra o problema em tarefas menores | Merge, Quick |

Fonte: `estrutura-de-dados.md`, §Algoritmos de Ordenação; slide 7.

### Bubble Sort

Também chamado de **método das trocas sucessivas**. Compara vizinhos e troca
quando estão fora de ordem; a cada passo o **maior** elemento "flutua" para o
fim — `algoritmos-de-ordenacao-nao-recursivos.md`, slide 8.

```c
void bubbleSort(int *v, int n) {
    int i, fim, aux;
    for (fim = n - 1; fim > 0; --fim)
        for (i = 0; i < fim; ++i)
            if (v[i] > v[i + 1]) {
                aux = v[i];
                v[i] = v[i + 1];
                v[i + 1] = aux;
            }
}
```

Fonte: `algoritmos-de-ordenacao-bubble.md`. O material usa `{10, 5, 7, 8, 9}`.

- **Vantagem:** simples de entender e implementar.
- **Desvantagem:** o desempenho depende do tamanho da estrutura; há muita
  movimentação. Mesmo com o vetor ordenado, ele faz todas as iterações —
  slides 17 e `estrutura-de-dados.md`.

### Insertion Sort

Divide o vetor em duas partes: a **ordenada** (de `0` a `i-1`) e a **não
ordenada**. A cada passo, insere o elemento `i` na posição correta,
**deslocando** os maiores para a direita — slides 18–19.

- **Melhor caso:** vetor já ordenado (mínimo de comparações e movimentos).
- **Pior caso:** vetor em ordem reversa (máximo).
- Bom para sequências **quase ordenadas** ou para inserir poucos itens numa
  sequência já ordenada — slide 28; `estrutura-de-dados.md`.

### Selection Sort

A cada passagem, seleciona o **menor** elemento e o coloca na primeira posição
disponível, trocando com quem estava lá — slides 29–30.

- **Vantagem:** uma das menores quantidades de **movimentos**.
- **Desvantagem:** o número de **comparações** é igual com vetor ordenado ou
  não — slide 32.
- Recomendado para **conjuntos pequenos** — slide 29.

## 5. Recursão

- Um programa recursivo é "mais elegante e menor" que a versão iterativa —
  `algoritmos-de-ordenacao-recursivos.md`, slide 4.
- **Caso trivial:** fácil de resolver, retorna um resultado, não aplica
  recursão.
- **Caso geral:** versão menor do problema original; a rotina chama uma nova
  cópia de si mesma — slide 6.
- Enquanto houver divisão, a função se chama; ao chegar no caso trivial, para de
  dividir e começa a **retornar** — slide 7.
- Cada chamada guarda suas variáveis em uma **pilha de chamadas**; os retornos
  fazem o **desempilhamento**, liberando memória — slides 7–8.

## 6. Dividir e conquistar

Para um problema `P` de tamanho `n`:

1. **Dividir:** quebrar em subproblemas menores.
2. **Resolver** os subproblemas recursivamente.
3. **Conquistar:** unir as soluções para obter a solução de `P`.

Fonte: `algoritmos-de-ordenacao-recursivos.md`, slides 10–11.

### Merge Sort

- **Dividir:** partir a lista em duas sublistas de tamanho aproximadamente
  `n/2`.
- **Resolver** cada sublista recursivamente.
- **Conquistar:** intercalar (*merge*) as duas listas ordenadas numa lista
  ordenada de tamanho `n` — slides 12–13.

A **fusão** compara `v1[i]` e `v2[j]`, copia o menor para uma lista auxiliar e,
quando uma das listas acaba, copia o restante da outra — slides 14–16. A função
recebe `início`, `meio` e `fim`, intercala `[início..meio]` com
`[meio+1..fim]` e copia o resultado de volta — slide 16.

**Complexidade:** `O(n log n)` no melhor, no médio e no pior caso —
`exercicio-merge-sort.md`, p. 2.

- **Vantagens:** alta eficiência, estabilidade e bom para grandes volumes.
- **Desvantagens:** usa memória adicional e é mais complexo de implementar —
  `exercicio-merge-sort.md`, p. 4.

### Quick Sort

1. Escolher um **pivô**.
2. **Particionar** a lista em `pos`, de modo que `[inicio..pos-1]` tenha
   elementos `<= pivô` e `[pos..fim]` tenha elementos `>= pivô`.
3. Resolver recursivamente as duas sublistas.
4. **Conquistar:** nada a fazer — a lista já está ordenada pela partição.

Fonte: `algoritmos-de-ordenacao-recursivos.md`, slides 21–25.

## 7. Notação Big-O

A notação Big-O descreve "como o tempo de execução cresce em relação ao tamanho
da entrada" — `exercicio-merge-sort.md`, p. 2.

No Merge Sort, `n` é o número de elementos e `log n` o número de divisões; daí
`O(n log n)` — p. 3.

> O corpus **não** classifica Bubble, Insertion, Selection nem Quick Sort em
> Big-O. Não invente `O(n²)` citando o material; se precisar, rotule como
> conhecimento externo.

## 8. Ponteiros

```c
int *p1;
int num = 6;
p1 = &num;
printf("Endereco: %p\n", (void *) p1);
printf("Conteudo: %d\n", *p1);
```

- `&num` devolve o **endereço** de `num`.
- `*p1` acessa o **conteúdo** do endereço apontado.
- `*p2 = *p2 + 1` altera o valor na memória apontada.

Fonte: `ponteiros-main.md`; `main.md`.

### Alocação dinâmica

```c
Carro *carro = (Carro *) malloc(sizeof(Carro));
scanf("%s", carro->modelo);
```

`malloc` reserva memória em tempo de execução; o operador `->` acessa campo de
struct via ponteiro. Fonte: `ponteiros-exercicio-2-main.md` — **corrigido**, pois
o arquivo original usa `.` em vez de `->`.

## 9. Structs

```c
typedef struct Aluno {
    char nome[30];
    float n1, n2, media;
} Aluno;

Aluno alunos[1];
alunos[0].media = (alunos[0].n1 + alunos[0].n2) / 2;
```

- `struct` agrupa dados de tipos diferentes (estrutura **heterogênea**).
- `typedef` cria um apelido para o tipo.
- O acesso a campos usa `.`; via ponteiro, `->`.

Fonte: `struct-main.md`; `struct-livro-main.md`; `struct-pesquisa-main.md`.

## 10. Pilha e fila

### Pilha (LIFO)

`exercicio-exercicios-21-05-exercicio05.md` implementa um histórico de
navegação:

- `topo` começa em `-1`;
- `visitar` faz `topo++` e grava;
- `voltar` lê `paginas[topo]` e faz `topo--`;
- vazia quando `topo == -1`; cheia quando `topo == MAX - 1`.

### Fila (FIFO)

`exercicio-exercicios-21-05-exercicio06.md` implementa uma fila de impressão:

- `inicio = 0` e `fim = -1`;
- `adicionar` faz `fim++` e grava;
- `imprimir` lê `documentos[inicio]` e faz `inicio++`;
- quando `inicio > fim`, reinicializa.

> Não há slides de pilha ou fila; essas definições vêm do **código** dos
> exercícios.
