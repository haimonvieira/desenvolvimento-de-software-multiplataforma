---
disciplina: DSM1/ALP
titulo: AULA 04   TIPOS DE DADOS, VARIÁVEIS E OPERADORES
fonte: DSM1/ALP/SLIDES/AULA 04 - TIPOS DE DADOS, VARIÁVEIS E OPERADORES.pptx
tipo: pptx
paginas: 0
extraido_em: 2026-10-24
---

## Slide 1

TIPOS DE DADOS, VARIÁVEIS E OPERADORES

**Notas do slide 1:** 4

## Slide 2

ROTEIRO
LINGUAGEM C
VARIÁVEIS E CONSTANTES
TIPOS DE DADOS
OPERADORES
EXERCÍCIOS
2

**Notas do slide 2:** 5

## Slide 3

INTRODUÇÃO
3

**Notas do slide 3:** 6

## Slide 4

INTRODUÇÃO
Na prática, é inviável desenvolver programas complexos em linguagem de máquina.
Em geral, utilizamos linguagens de alto nível (C, Java, Python, Javascript, PHP, entre outras) que podem, de alguma forma, serem traduzidas (compiladas) para a linguagem de baixo nível ou interpretadas em tempo de execução.
4

**Notas do slide 4:** 7

## Slide 5

INTRODUÇÃO
Um programa fonte ainda não é entendido pelo computador. É necessário converter este programa para a linguagem do computador (binário).
Este processo é chamado de geração de programa executável, o qual é composto por duas fases: Compilação e Linkedição.
5

**Notas do slide 5:** 8

## Slide 6

INTRODUÇÃO
6
Compilador                                             Likeditor

**Notas do slide 6:** 10

## Slide 7

INTRODUÇÃO
A ferramenta que realiza a compilação é chamado de compilador e gera um código chamado de código objeto.
A ferramenta que gera o programa executável final a partir do código objeto é chamado de Likeditor.
7

**Notas do slide 7:** 11

## Slide 8

INTRODUÇÃO
8

**Notas do slide 8:** 13

## Slide 9

LINGUAGEM C – CARACTERÍSTICAS
9

**Notas do slide 9:** 15

## Slide 10

LINGUAGEM C
A linguagem C foi criada nos anos 1970 para desenvolvimento de sistemas operacionais. Ela é amplamente utilizada em sistemas embarcados.
É chamada de linguagem nível intermediária, pois combina os elementos das linguagens de alto nível com o funcionalismo da linguagem nível máquina.
10

**Notas do slide 10:** 16

## Slide 11

LINGUAGEM C
Com C é possível ter controle exato de como um programa se comporta e dá acesso direto à partes do hardware, como o espaço na memória do computador.
Tem como características principais: a portabilidade (pode ser compilada em diversas arquiteturas) e a simplicidade (seguindo as regras, dificilmente vai cometer erros que possam comprometer o seu programa).
11

**Notas do slide 11:** 18

## Slide 12

LINGUAGEM C – ESTRUTURA
12

**Notas do slide 12:** 20

## Slide 13

ESTRUTURA DE UM PROGRAMA EM C
13
IMPORTAÇÃO DAS BIBLIOTECAS
DECLARAÇÃO DA FUNÇÃO MAIN
COMANDOS

**Notas do slide 13:** 21

## Slide 14

LINGUAGEM C – BIBLIOTECAS
14

**Notas do slide 14:** 23

## Slide 15

BIBLIOTECAS
Diretiva #include permite incluir uma biblioteca (contêm funções pré-definidas, utilizadas nos programas).
15

**Notas do slide 15:** 24

## Slide 16

FUNÇÕES MATEMÁTICAS
16

**Notas do slide 16:** 25

## Slide 17

LINGUAGEM C – FUNÇÃO MAIN
17

**Notas do slide 17:** 26

## Slide 18

FUNÇÃO MAIN
A função main é o ponto de partida de um programa em C, ou seja, é onde o código-fonte começa a ser executado.
Pode chamar outras funções do programa para executar tarefas específicas. Quando uma função é chamada, a execução começa na primeira instrução da função e o controle é devolvido a main quando a função termina ou quando é executada uma instrução return.
18

**Notas do slide 18:** 27

## Slide 19

LINGUAGEM C – VARIÁVEIS
19

**Notas do slide 19:** 28

## Slide 20

DECLARAÇÕES
A linguagem C possui 4 tipos principais: int, float, double e char. Para declarar uma variável é necessário informar o seu tipo e em seguida o seu nome.
Os nomes das variáveis devem conter apenas letras, dígitos e o símbolo _. Cuidado com a diferença entre letras maiúsculas e minúsculas.
20

**Notas do slide 20:** 30

## Slide 21

DECLARAÇÕES
21

**Notas do slide 21:** 32

## Slide 22

LINGUAGEM C – OPERADORES
22

**Notas do slide 22:** 33

## Slide 23

OPERADORES MATEMÁTICOS
23

## Slide 24

OPERADORES DE ATRIBUIÇÃO
A linguagem C utiliza o símbolo de “=” (igual) para atribuir valores a uma variável. O valor pode ser: uma constante, uma variável ou uma expressão.
24

## Slide 25

OPERADORES DE ATRIBUIÇÃO
25

## Slide 26

OPERADORES RELACIONAIS
26
As expressões relacionais em C retornam:
1 se verdadeiro
0 se falso

## Slide 27

OPERADORES LÓGICOS
&& (E lógico): retorna verdadeiro se ambos os operandos são verdadeiros e falso nos demais casos.
|| (OU lógico): retorna verdadeiro se um ou ambos os operandos são verdadeiros e falso se ambos são falsos.
! (NÃO lógico): usada com apenas um operando. Retorna verdadeiro se o operando é falso e vice-versa.
27

## Slide 28

OPERADORES LÓGICOS
28

## Slide 29

LINGUAGEM C – ENTRADA DE DADOS
29

## Slide 30

ENTRADA DE DADOS
A linguagem C utiliza a função scanf() para realizar a leitura e o armazenamento dos dados de entrada.
30

## Slide 31

LINGUAGEM C – SAÍDA DE DADOS
31

## Slide 32

SAÍDA DE DADOS
Por meio da função printf() é possível apresentar o resultado da etapa de processamento de dados para o usuário por meio de um dispositivo de saída de dados.
É utilizada para mostrar uma mensagem na tela ao usuário, que pode ser no formato de puro texto ou ainda a impressão do conteúdo que foi armazenado dentro de uma variável.
32

## Slide 33

SAÍDA DE DADOS
33

## Slide 34

1
3
2
4
5
FIXAÇÃO – FAÇAMOS JUNTOS!
34

## Slide 35

PRATIQUE 01
Construa um programa que calcule a quantidade de latas de tinta necessárias e o custo para pintar tanques cilíndricos de combustível, onde são fornecidos pelo usuário à altura (h) e o raio (r) desse cilindro.
35

## Slide 36

PRATIQUE 01
Sabendo-se que:
a lata de tinta custa R$20,00
cada lata contém 5 litros
cada litro de tinta pinta 3 m²
Área do cilindro =  3.14 * r * 2 * (r+h)
36

## Slide 37

PRATIQUE 01
37

## Slide 38

1
3
2
4
5
FIXAÇÃO – FAÇA VOCÊ MESMO!
38

## Slide 39

PRATIQUE 01
Faça os exercícios da lista “Lista de exercícios – Algoritmos.pdf” utilizando os conceitos vistos sobre Linguagem C.
39

## Slide 40

DÚVIDAS
40
