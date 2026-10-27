---
disciplina: DSM2/ED1
titulo: VETOR
fonte: DSM2/ED1/VETOR.pptx
tipo: pptx
paginas: 0
extraido_em: 2026-10-24
---

## Slide 1

AULA 01 – ESTRUTURA DE DADOS HOMOGÊNEA - VETOR

## Slide 2

INTRODUÇÃO
VETOR
OPERAÇÕES
EXEMPLOS DE APLICAÇÃO
ROTEIRO

## Slide 3

A automatização de tarefas é um aspecto marcante da sociedade moderna, e na ciência da computação houve um processo de desenvolvimento simultâneo e interativo de máquinas (hardware) e dos elementos que gerenciam a execução automática (software) de uma tarefa. Nesta grande evolução do mundo computacional, um fator de relevante importância é a forma de armazenar as informações.
INTRODUÇÃO

## Slide 4

Por isso, a importância das estruturas de dados, que nada mais são do que formas otimizadas de armazenamento e tratamento das informações eletronicamente.
As estruturas de dados baseiam-se nos tipos de armazenamento vistos dia a dia, ou seja, nada mais são do que a transformação de uma forma de armazenamento já conhecida e utilizada no mundo real adaptada para o mundo computacional.
INTRODUÇÃO

## Slide 5

Uma estrutura de dados, que utiliza somente um tipo de dado, em sua definição é conhecida como dados homogêneos. Variáveis compostas homogêneas correspondem a posições de memória, identificadas por um mesmo nome, individualizado por índices e cujo conteúdo é composto do mesmo tipo. Sendo os vetores (estruturas de dados unidimensionais) e as matrizes (estruturas de dados bidimensionais) os representantes dos dados homogêneos.
INTRODUÇÃO

## Slide 6

Exemplo 01: Armazenar as notas de 10 alunos de uma turma.
INTRODUÇÃO

## Slide 7

Um vetor é uma estrutura de dados linear que necessita de somente um índice para que seus elementos sejam endereçados. É utilizado para armazenar uma lista de valores do mesmo tipo, ou seja, o tipo vetor permite armazenar mais de um valor em uma mesma variável.
VETOR

## Slide 8

A partir do endereço do primeiro elemento é possível determinar a localização dos demais elementos do vetor. Isso é possível porque os elementos do vetor estão dispostos na memória um ao lado do outro e cada elemento tem o seu tamanho fixo.
São estruturas lineares e estáticas, ou seja, são compostas por um número finito e pré-determinado de valores.
VETOR

## Slide 9

Levando-se em consideração que a primeira posição do vetor seja 0, teremos:
vet[0] = 5
vet[1] = 3
vet[2] = 7
vet[3] = 6
vet[4] = 12
vet[5] = 23
VETOR
5
3
7
6
12
23
0
1
2
3
4
5

## Slide 10

Para declarar um vetor em linguagem C, primeiramente, você deve informar o tipo dos dados a serem armazenados e posteriormente o nome da variável seguida por colchetes com o tamanho da estrutura.
VETOR EM C

## Slide 11

Para acessar os elementos de um vetor usam-se índices. O índice define a posição da variável dentro do vetor.
Em todos os vetores, o primeiro elemento está localizado na posição 0 (zero). Assim, se tomarmos “K” como sendo o tamanho do vetor, a última posição válida dessa estrutura será a de índice “K-1”.
VETOR EM C

## Slide 12

VETOR EM C

## Slide 13

Para inserir um valor numa determinada posição de um vetor, nós podemos realizar isso de 3 formas diferentes:
1ª forma: inserir os elementos durante a declaração do vetor.
2ª forma: inserir os elementos de forma manual em cada posição do vetor.
3ª forma: utilizar um laço de repetição que permitirá com que possamos percorrer cada uma das posições do vetor.
VETOR EM C

## Slide 14

1ª forma: inserir os elementos durante a declaração do vetor.
VETOR EM C

## Slide 15

2ª forma: inserir os elementos de forma manual em cada posição do vetor.
VETOR EM C

## Slide 16

3ª forma: utilizar um laço de repetição que permitirá com que possamos percorrer cada uma das posições do vetor.
VETOR EM C

## Slide 17

Nem sempre sabe-se quantos elementos serão armazenados dentro de um vetor. Para isso, pode-se utilizar a definição de uma constante como o tamanho da estrutura.
VETOR EM C

## Slide 18

Exemplo 01: Encontrar o maior valor dentro de um vetor.
EXEMPLOS COM VETOR EM C

## Slide 19

Exemplo 02: Copiar dados de um vetor para outro.
EXEMPLOS COM VETOR EM C

## Slide 20

Exemplo 03: Leitura dos dados de um vetor.
EXEMPLOS COM VETOR EM C

## Slide 21

Exercício 01: Crie um programa em C que armazene 4 notas de um aluno em um vetor, em seguida, calcule a média aritmética entre essas notas.
Exercício 02: Crie um programa em C para armazenar números fornecidos pelos usuários em 2 vetores inteiros de 5 elementos cada. Em seguida, imprima a soma das posições equivalentes.
PRATIQUE

## Slide 22

DÚVIDAS?
DÚVIDAS?
