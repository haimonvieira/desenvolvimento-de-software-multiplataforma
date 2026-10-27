---
disciplina: DSM2/ED1
titulo: ALGORITMOS DE ORDENAÇÃO RECURSIVOS
fonte: DSM2/ED1/ALGORITMOS DE ORDENAÇÃO RECURSIVOS.pptx
tipo: pptx
paginas: 0
extraido_em: 2026-10-24
---

## Slide 1

AULA 04 – ALGORITMOS DE ORDENAÇÃO RECURSIVOS

## Slide 2

INTRODUÇÃO
MERGE SORT
QUICKSORT
IMPLEMENTAÇÃO RECURSIVA
ROTEIRO

## Slide 3

Existem problemas na computação que a sua solução computacional depende do tamanho da entrada de dados e isso pode se tornar um processo lento e bastante custoso, como por exemplo, a tarefa de ordenação de dados.
Para esses tipos de problemas costuma-se utilizar um recurso da computação denominado de recursão.
INTRODUÇÃO

## Slide 4

Um programa recursivo é mais elegante e menor que a sua versão iterativa e exibe com maior clareza o processo utilizado.
Em termos gerais, a recursão pode ser considerada como um processo de repetição de uma rotina. Portanto, de maneira, bem simplista, pode ser definida como uma rotina (procedimento ou função) que chama a si mesma, de forma direta ou indireta.
INTRODUÇÃO

## Slide 5

No caso da recursão, ela sabe como resolver uma parte do problema, mas outra parte ela não tem muita certeza, então, a recursão vai dividindo o problema em duas partes sucessivamente: a primeira em que ela sabe como resolver e a segunda que ela não sabe como resolver, sendo esta semelhante ao problema original, que se está tentando resolver, mas deve ser uma versão mais simples ou menor.
INTRODUÇÃO

## Slide 6

Dessa forma temos:
Caso Trivial: Fácil de se resolver e retorna um resultado, geralmente é o caso mais básico, ou simples, do problema, inclusive não há necessidade de se aplicar recursão.
Caso Geral: Neste caso, o problema é, em sua essência, igual ao problema original, porém deve ser uma versão mais genérica. Como esse novo problema é parecido com o original, a rotina chama uma nova cópia de si mesma para trabalhar no problema menor.
INTRODUÇÃO

## Slide 7

Enquanto for necessário dividir o problema em problemas menores, a função recursiva continuará chamando a si mesma, para continuar dividindo, até chegar no caso mais básico e, quando isso ocorre, a função para de dividir e começa a gerar os resultados.
Todos os dados de todas as variáveis envolvidas na função recursiva devem ser guardados a cada chamada, isso significa que uma pilha de chamadas da função deve ser criada.
INTRODUÇÃO

## Slide 8

Quando a função começa a retornar os resultados (retornos das chamadas) então temos o desempilhamento das chamadas da função da pilha de controle de chamadas e retornos da função recursiva, que retornarão a quem chamou o resultado solicitado.
Esse resultado é agrupado com o próximo e assim sucessivamente, até formar o resultado final. Conforme são desempilhados, os valores também são liberados da memória.
INTRODUÇÃO

## Slide 9

Vamos usar a técnica de recursão para resolver o problema de ordenação. Imaginem o seguinte problema:
Temos uma lista v de inteiros de tamanho n
Devemos deixar v ordenada em ordem crescente de valores
INTRODUÇÃO

## Slide 10

Dividir e Conquistar
Temos que resolver um problema P de tamanho n
Dividir: Quebramos P em subproblemas menores
Resolvemos os subproblemas de forma recursiva
Conquistar: unimos as soluções dos sub-problemas para obter solução do problema maior P.
INTRODUÇÃO

## Slide 11

Dividir e conquistar
Temos que resolver um problema P de tamanho n
Dividir: Quebramos P em sub-problemas menores
Resolvemos os sub-problemas de forma recursiva
Conquistar: Unimos as soluções dos sub-problemas para obter solução do problema maior P.
MERGE SORT

## Slide 12

O Merge Sort é um algoritmo baseado na técnica dividir e conquistar. Neste caso temos que ordenar uma lista de tamanho n.
Dividir: Dividimos a lista de tamanho n em duas sub-listas de tamanho aproximadamente iguais (de tamanho n/2).
Resolvemos o problema de ordenação de forma recursiva para estas duas sub-listas.
Conquistar: Com as duas sub-listas ordenadas, construímos uma lista ordenada de tamanho n ordenado.
MERGE SORT: ORDENAÇÃO POR INTERCALAÇÃO

## Slide 13

Conquistar: Dados duas listas v1 e v2 ordenadas, como obter uma outra lista ordenada contendo os elementos de v1 e v2?
MERGE SORT: ORDENAÇÃO POR INTERCALAÇÃO

## Slide 14

A ideia é executar um laço que testa em cada iteração quem é o menor elemento dentre v1[i] e v2[j], e copia este elemento para uma nova lista.
Durante a execução deste laço podemos chegar em uma situação onde todos os elementos de uma das listas (v1 ou v2) foram todos avaliados. Neste caso terminamos o laço e copiamos os elementos restantes da outra lista.
MERGE SORT: FUSÃO

## Slide 15

MERGE SORT: FUSÃO

## Slide 16

Teremos posições início, meio, fim de uma lista e devemos fazer a intercalação das duas sub-listas: uma de início até meio, e outra de meio+1 até fim.
Para isso, a função utiliza uma lista auxiliar, que receberá o resultado da intercalação, e que no final é copiado para a lista original a ser ordenada.
MERGE SORT: FUSÃO

## Slide 17

O Merge Sort resolve de forma recursiva dois sub-problemas, cada um contendo uma metade da lista original.
Com a resposta das chamadas recursivas podemos chamar a função merge para obter uma lista ordenada.
MERGE SORT

## Slide 18

MERGE SORT

## Slide 19

MERGE SORT - EXEMPLO

## Slide 20

Faça uma execução passo-a-passo do MergeSort com o vetor (30,45,21,20,6,715,100,65,33).
FAÇAMOS JUNTOS

## Slide 21

Vamos supor que devemos ordenar uma lista de uma posição inicial até o fim.
Dividir:
Escolha um elemento especial da lista chamado pivô.
Particione a lista em uma posição pos tal que todos os elementos de inicial até pos-1 são menores ou iguais do que o pivô, e todos elementos de pos até fim são maiores ou iguais ao pivô.
QUICKSORT

## Slide 22

A função recursiva quicksort():
QUICKSORT

## Slide 23

A função particiona_random() e particiona():
QUICKSORT - PARTICIONAMENTO

## Slide 24

A função troca():
QUICKSORT - PARTICIONAMENTO

## Slide 25

Resolvemos o problema de ordenação de forma recursiva para estas duas sub-listas (uma de inicial até pos-1 e a outra de pos até fim).
Conquistar: Nada a fazer já que a lista estará ordenada devido a fase de divisão.
QUICKSORT

## Slide 26

Faça uma execução passo-a-passo do QuickSort com o vetor (4,3,6,7,9,10,5,8).
FAÇAMOS JUNTOS

## Slide 27

DÚVIDAS?
DÚVIDAS?
