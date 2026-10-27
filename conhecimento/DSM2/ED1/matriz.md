---
disciplina: DSM2/ED1
titulo: MATRIZ
fonte: DSM2/ED1/MATRIZ.pptx
tipo: pptx
paginas: 0
extraido_em: 2026-10-24
---

## Slide 1

AULA 02 – ESTRUTURA HOMOGÊNEA - MATRIZ

## Slide 2

INTRODUÇÃO
MATRIZ
OPERAÇÕES
EXEMPLOS DE APLICAÇÃO
ROTEIRO

## Slide 3

Os algoritmos são elaborados para manipulação de dados. Quando estes dados estão organizados (dispostos) de forma coerente, caracterizam uma forma, uma estrutura de dados.
A organização dos dados é chamada de estrutura composta de dados que se divide em duas formas fundamentais: homogêneas (vetores e matrizes) e heterogêneas (registros).
INTRODUÇÃO

## Slide 4

As estruturas de dados homogêneas possibilitam o armazenamento de grupos de valores em uma única variável que será armazenada na memória do computador.
Essas estruturas são ditas homogêneas porque os valores que serão armazenados são de um mesmo tipo de dado e podem ser divididas em unidimensionais (vetores) e multidimensionais (matrizes).
INTRODUÇÃO

## Slide 5

Exemplo 01: Localizar um livro dentro da biblioteca
INTRODUÇÃO

## Slide 6

As matrizes e suas propriedades, podem ser utilizadas em diversas aplicações no cotidiano, sendo uma poderosa e eficaz ferramenta de trabalho para muitas áreas da Ciência, Tecnologia entre outros setores.
Como exemplos de aplicação da estrutura de dados matriz, nós podemos citar: Teoria dos Grafos, Computação Gráfica, Tomografia Computadorizada e Criptografia.
INTRODUÇÃO

## Slide 7

A matriz é comumente utilizada para a organização de dados tabulares a fim de facilitar a resolução de problemas. As informações das matrizes, sejam estas numéricas ou não, são dispostas organizadamente em linhas e colunas.
Uma matriz é uma coleção de variáveis de mesmo tipo, acessíveis com um único nome e armazenados contiguamente na memória. A individualização de cada variável de uma matriz é feita através do uso de índices.
MATRIZ

## Slide 8

Forma de armazenamento das matrizes na memória:
MATRIZ
int matriz[2][5];

## Slide 9

O tamanho de uma matriz é pré-definido, ou seja, após a compilação, não pode ser mudado.
Portanto, matrizes são chamadas de estruturas de dados estáticas, pois mantém o mesmo tamanho ao longo de toda a execução do programa.
MATRIZ

## Slide 10

As matrizes são sempre representadas por letras maiúsculas (A, B, ...), que são acompanhadas por índices, nos quais o primeiro número indica a quantidade de linhas, e o segundo, o número de colunas.
MATRIZ

## Slide 11

As informações contidas em uma matriz são chamadas de elementos e ficam organizadas entre colchetes, como por exemplo:
A matriz B possui uma linha e quatro colunas. Para saber a quantidade de elementos total da matriz basta multiplicar a quantidade de linhas por colunas, então a matriz B tem 4 elementos.
MATRIZ

## Slide 12

Para declarar uma matriz em linguagem C, primeiramente você deve informar o tipo dos dados a serem armazenados, o nome da variável e posteriormente com colchetes a quantidade de linhas e colunas.
MATRIZ EM C

## Slide 13

Para acessar os elementos de uma matriz usam-se índices. Os índices definem a posição do elemento dentro da matriz.
Toda matriz, na linguagem C, tem o primeiro elemento localizado na posição linha = 0 e coluna = 0. Assim, se tornamos L e C como sendo o tamanho da matriz, a última posição é a de índices L-1 e C-1.
MATRIZ EM C

## Slide 14

MATRIZ EM C

## Slide 15

Para inserir um valor numa determinada posição da matriz, nós podemos realizar isso de 3 formas diferentes:
1ª forma: inserir os elementos durante a declaração da matriz.
2ª forma: inserir os elementos de forma manual em cada posição da matriz.
3ª forma: utilizar dois laços de repetição para percorrer cada uma das posições da estrutura.
MATRIZ EM C

## Slide 16

1ª forma: inserir os elementos durante a declaração da matriz.
MATRIZ EM C

## Slide 17

2ª forma: inserir os elementos de forma manual em cada posição da matriz.
MATRIZ EM C

## Slide 18

3ª forma: utilizar dois laços de repetição para percorrer cada uma das posições da estrutura.
MATRIZ EM C

## Slide 19

Nem sempre sabe-se quantos elementos serão armazenados dentro de uma matriz. Para isso, pode-se utilizar a definição de uma constante como o tamanho da estrutura.
MATRIZ EM C

## Slide 20

Exemplo 1: Preencher uma matriz n x m com zeros.
EXEMPLOS COM MATRIZES EM C

## Slide 21

Exemplo 2: Ler e armazenar todos os elementos de uma matriz.
EXEMPLOS COM MATRIZES EM C

## Slide 22

Faça um algoritmo que crie uma matriz identidade onde o usuário deve informar a ordem da matriz.
Em matemática, matriz identidade é uma matriz quadrada (número de linhas = número de colunas) em que os elementos da diagonal principal são iguais a 1 e os demais elementos são iguais a 0.
PRATIQUE 01

## Slide 23

Dada uma matriz quadrada de ordem 5, separar os elementos da diagonal principal em um vetor.
Em matemática, uma matriz quadrada é aquela que possui a mesma quantidade de linhas e colunas. Portanto, uma matriz quadrada de ordem 5, irá possuir 5 linhas e 5 colunas.
PRATIQUE 02

## Slide 24

Faça um programa que encontre o maior elemento e a sua respectiva posição em uma matriz B de dimensão 7x5. Os valores armazenados nessa estrutura de dados devem ser informados pelo usuário por meio de um comando de entrada tal como o scanf.
PRATIQUE 03

## Slide 25

DÚVIDAS?
DÚVIDAS?
