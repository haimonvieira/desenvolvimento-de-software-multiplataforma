# Estrutura de Dados
### Data: 12/02/2026

## Trabalho: Dança dos algoritmos de ordenação
**Entrega 23/03**
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