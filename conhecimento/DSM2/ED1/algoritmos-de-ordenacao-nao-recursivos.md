---
disciplina: DSM2/ED1
titulo: ALGORITMOS DE ORDENAÇÃO NÃO RECURSIVOS
fonte: DSM2/ED1/ALGORITMOS DE ORDENAÇÃO NÃO-RECURSIVOS.pptx
tipo: pptx
paginas: 0
extraido_em: 2026-10-24
---

## Slide 1

AULA 03 – ALGORITMOS DE ORDENAÇÃO NÃO-RECURSIVOS

## Slide 2

ORDENAÇÃO DE DADOS
BUBBLE SORT
INSERTION SORT
SELECTION SORT
ROTEIRO

## Slide 3

A ordenação de dados é a operação de rearranjar os dados em uma determinada ordem.
A eficiência no manuseio de dados muitas vezes pode ser aumentada se os dados estiverem dispostos de acordo com algum critério de ordem.
INTRODUÇÃO

## Slide 4

Exemplo 01: Organizar uma lista de números em ordem crescente e/ou decrescente.
INTRODUÇÃO

## Slide 5

Exemplo 02: Organizar uma lista telefônica que está sem ordem.
INTRODUÇÃO

## Slide 6

Os algoritmos de ordenação são ferramentas utilizadas para ordenar uma lista de objetos (itens) e podem ser aplicados a diversos tipos de estrutura, tais como: Vetores, Matrizes e Estruturas dinâmicas.
Na escolha de um algoritmo de ordenação deve ser considerado principalmente: o tempo gasto pela ordenação e o uso econômico da memória disponível.
ALGORITMOS DE ORDENAÇÃO

## Slide 7

Os principais algoritmos de ordenação não recursivos são:
Bubble Sort
Insertion Sort
Selection Sort
ALGORITMOS DE ORDENAÇÃO

## Slide 8

É bastante conhecido devido a sua facilidade de entender e de programar. Também conhecido como método das trocas sucessivas, é um método simples de ordenação que, a cada passo, posiciona(flutua) o maior elemento para o fim.
BUBBLE SORT

## Slide 9

Código em linguagem C:
BUBBLE SORT

## Slide 10

Funcionamento da 1ª iteração:
BUBBLE SORT

## Slide 11

Funcionamento da 2ª iteração:
BUBBLE SORT

## Slide 12

Funcionamento da 3ª iteração:
BUBBLE SORT

## Slide 13

Funcionamento da 4ª iteração:
BUBBLE SORT

## Slide 14

Funcionamento da 5ª iteração:
BUBBLE SORT

## Slide 15

Funcionamento da 6ª iteração:
BUBBLE SORT

## Slide 16

Funcionamento da 7ª iteração:
BUBBLE SORT

## Slide 17

VANTAGEM: Simples de entender e implementar.
DESVANTAGEM: O desempenho da sua execução depende do tamanho da estrutura, pois há um número muito grande de movimentação de elementos, assim não deve ser usado se a estrutura a ser ordenada for complexa.
BUBBLE SORT

## Slide 18

A ideia da ordenação por inserção é dividir os elementos em duas subestruturas, uma com os elementos já ordenados e outra com elementos ainda por ordenar.
INSERTION SORT

## Slide 19

A cada passo, uma porção de 0 até i-1 do vetor está ordenada.
Devemos inserir o item da posição i na posição certa para deixar o vetor ordenado até a posição i.
No passo seguinte consideramos que o vetor está ordenado até i.
INSERTION SORT

## Slide 20

Funcionamento - Suponha que desejamos ordenar um vetor com os seguintes elementos: 5, 3, 2, 1, 90 e 6.
Para isso, nós precisamos inserir cada um dos elementos na posição correta, de tal forma que ao inserir o último valor, todo o valor já esteja ordenado.
INSERTION SORT

## Slide 21

Inserção do número 5:
INSERTION SORT

## Slide 22

Inserção do número 3:
INSERTION SORT

## Slide 23

Inserção do número 2:
INSERTION SORT

## Slide 24

Inserção do número 1:
INSERTION SORT

## Slide 25

Inserção do número 90:
INSERTION SORT

## Slide 26

Inserção do número 6:
INSERTION SORT

## Slide 27

Vetor ordenado:
INSERTION SORT

## Slide 28

O número mínimo de comparações e movimentos ocorre quando os itens estão originalmente em ordem.
O número máximo de comparações e movimentos ocorre quando os itens estão originalmente em ordem reversa.
Bom método a ser usado quando a sequência está quase ordenada, ou quando se deseja adicionar poucos itens a uma sequência já ordenada.
INSERTION SORT

## Slide 29

A ideia do Selection Sort é a cada passagem pelo vetor, selecionar o menor elemento e desloca-lo para a esquerda. É um algoritmo de ordenação bastante simples e recomendado para conjuntos pequenos.
SELECTION SORT

## Slide 30

Etapas:
Procurar menor elemento e trocar com o elemento na 1ª posição;
Procurar o 2º menor elemento e trocar com o elemento na 2ª posição;
Proceder assim até a ordenação estar completa.
SELECTION SORT

## Slide 31

SELECTION SORT

## Slide 32

Uma vantagem do Selection Sort é que entre os algoritmos de ordenação ele apresenta uma das menores quantidades de movimentos entre os elementos, assim pode haver algum ganho quando se necessita ordenar estruturas complexas.
Uma desvantagem é que o número de comparações é igual para um vetor já ordenado ou não.
SELECTION SORT

## Slide 33

Gravar um vídeo utilizando a dança como recurso para explicar o funcionamento dos seguintes algoritmos:
BubbleSort
InsertionSort
SelectionSort
MergeSort
QuickSort
PRATIQUE

## Slide 34

DÚVIDAS?
DÚVIDAS?
