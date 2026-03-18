# Estrutura de Dados

12/02/2026

## Trabalho: Dança dos algoritmos de ordenação

### Entrega 23/03

- Escolher 1 música como trilha sonora
- Cada equipe possui um algoritmo de ordenação
- Produzir um vídeo de 3 a 5 minutos utilizando os conceitos da dança para explicar o funcionamento do algoritmo
- Criar um relatório no formato da norma ABNT contendo os seguintes tópicos:
  - Introdução;
  - Funcionamento do algoritmo;
  - Implementação em C e;
  - Conclusão.

## Esturura de Dados Homogênea: Vetor

É uma estrutura que permite o armazenamento de vários elementos sob um único nome. Todos os elementos devem possuir o mesmo tipo de dados

- Declaração:

```c
        int   vet   [5];
        │     │     │
        │     │     └── quantidade de elementos a ser armazenado
        │     └──────── nome da variável
        └────────────── tipo de dado
```

- Representação:
  
```c
             Vetor: vet
        ┌─────┬─────┬─────┬─────┬─────┐
        │     │     │     │     │     │  ← posições sequenciais na memória
        └─────┴─────┴─────┴─────┴─────┘
           0     1     2     3     4
                 ↑
              índices
```

## Matriz

É uma estrutura de dados homogênea, sequencial e estática. Ao contrário do vetor
que utiliza uma única dimensão, a matriz pode utilizar n-dimensões. Para exemplificar
o seu funcionamento, nós iremos trabalhar com 2 dimensões (linhas e colunas).

**Exemplo:**
```c
      int mat[2][3];

                Colunas
                0      1      2
            +------+------+------+
      Linha 0 | 123  | 789  | 456  |
            +------+------+------+
      Linha 1 | 234  | 165  | 983  |
            +------+------+------+
```

Para acessar os elementos de uma matriz, iremos utulizar 2 índices. Um índice para linha e o segundo
indica a coluna.

## Operações em uma matriz

1. Inserção

Nós podemos inserir dados em uma matriz de 3 formas:

a. Na declaração da matriz

  ```c
    float matriz[1][5] = {9, 7, 6, 8, 4};
  ```

b. Inserção manual e direta

  ```c
    int n[2][2];
    n[0][0] = 24;
    n[0][1] = 13;
    n[1][0] = 18;
    n[1][1] = 39;
  ```

c. Inserção com laço de repetição

```c
  for(l = 0; l < 3; l++){

    for(c = 0; c < 4; c++){

      scanf("%d", &n[l][c]);

    }

  }
```


17/03/2026

## Algoritmos de Orenação

A ordenação é uma operação que organiza um conjunto de elementos em uma determinada ordem (criterio).

Gastar a menor quantidade de recurso para realizar a tarefa e sendo rapido

### Exemplos da utilização no dia a dia:

- Agenda de contato (ordem alfabetica)
- Classificacao de um atleta em uma corrida (ordem numerica)

A ordenacao pode ser realizada de forma crescente ou decrescente. Além disso pode ser utilizada em vetores, matriz ou estruturas dinamicas.
Na escolha de um algoritmo de ordenacao devem ser levados em consideracao principalmente o tempo gasto no processamento e o uso economico dos recursos.
  
Os algorimtos de ordenacao são classificados em: 

- Recursivos
  - Quebrar em tarefas pequenas
- Não recursivos

### Algoritmo de ordenacao nao recursivo

Os 3 principais sao o BubbleSort, IntertionSort e SelectionSort

## BubbleSort

  - É conhecido como metodo das trocas sucessivas, ou seja, os vizinhos são comparados e quando atendem o criterio da ordenacao os valores mudam de posicao.
Esse processo desejado para a ultima posicao do vetor e o processo se repete ate que todo vetor esteja totalmente ordenado

**Exemplo: Ordenacao crescente**

### 1a Interacao

| Passo | Vetor                          | Ação                    |
|------|--------------------------------|-------------------------|
| Inicial | [7, 4, 5, 9, 8]               | -                       |
| 1    | [4, 7, 5, 9, 8]                | Compara 7 com 4 → troca |
| 2    | [4, 5, 7, 9, 8]                | Compara 7 com 5 → troca |
| 3    | [4, 5, 7, 9, 8]                | Compara 7 com 9 → não troca |
| 4    | [4, 5, 7, 9, 8]                | Compara 9 com 8         |
| 5    | [4, 5, 7, 8, 9]                | Troca 9 com 8           |
| Final| [4, 5, 7, 8, 9]                | Ordenado                |

### 2a Interacao

| Iteração | Passo | Vetor                          | Ação                          |
|----------|------|--------------------------------|--------------------------------|
| 2ª       | 1    | [4, 5, 7, 8, 9]                | Compara 4 com 5               |
| 2ª       | 2    | [4, 5, 7, 8, 9]                | Compara 5 com 7               |
| 2ª       | 3    | [4, 5, 7, 8, 9]                | Compara 7 com 8               |
| 2ª       | 4    | [4, 5, 7, 8, 9]                | Elemento 8 já está correto    |

### 3a Interacao

| Iteração | Passo | Vetor                          | Ação                          |
| 3ª       | 1    | [4, 5, 7, 8, 9]                | Compara 4 com 5               |
| 3ª       | 2    | [4, 5, 7, 8, 9]                | Compara 5 com 7               |
| 3ª       | 3    | [4, 5, 7, 8, 9]                | Elemento 7 já está correto    |

### 4a Interacao

| Iteração | Passo | Vetor                          | Ação                          |
|----------|------|--------------------------------|--------------------------------|
| 4ª       | 1    | [4, 5, 7, 8, 9]                | Compara 4 com 5               |
| 4ª       | 2    | [4, 5, 7, 8, 9]                | Elemento 5 já está correto    |

### 5a Interacao

| Iteração | Passo | Vetor                          | Ação                          |
|----------|------|--------------------------------|--------------------------------|
| 5ª       | 1    | [4, 5, 7, 8, 9]                | Elemento 4 já está correto    |

**Observacao: É um algoritmo muito lento devido a quantidade de comparacoes e mesmo o vetor ja esteja ordenaod, ele ira realizar todas as interacoes. Porém, é um algoritmo simples de implementar e entender.**

## InsertionSort

É conhecido como metodo da insercao. Cadaelemento ao ser inserido exige que seja feita uma busca pelo local (posicao) correta.
Assim todos os elementos que estao apos o local sao movidos uma posicao  para frente liberando a posicao para que o elemento seja inserido.

**Exemplo: Ordenacao crescente**

| Passo | Vetor                          | Ação                                                                 |
|------|--------------------------------|----------------------------------------------------------------------|
| 1    | [5, 3, 2, 1, 90, 6]            | Inserir 3 → posição 0 (todos deslocam para direita)                 |
| 2    | [3, 5, 2, 1, 90, 6]            | Inserir 2 → posição 0 (todos deslocam para direita)                 |
| 3    | [2, 3, 5, 1, 90, 6]            | Inserir 1 → posição 0 (todos deslocam para direita)                 |


| Passo | Vetor                          | Ação                                                                 |
|------|--------------------------------|----------------------------------------------------------------------|
| 1    | [1, 2, 3, 5, 90, 6]            | Inserir 90 → posição 0 (todos deslocam para direita)                |
| 2    | [1, 2, 3, 5, 90, 6]            | Inserir 90 → posição 4 (sem deslocamento)                           |
| 3    | [1, 2, 3, 5, 6, 90]            | Inserir 6 → posição 4 (90 desloca para direita)                     |


O insertionSort tende a gastar uma quantidade de operacao menor que o BubbleSort

- Melhor caso: Vetor ordenado
- Pior caso: vetor em ordem contraria