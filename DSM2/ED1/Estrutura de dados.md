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
