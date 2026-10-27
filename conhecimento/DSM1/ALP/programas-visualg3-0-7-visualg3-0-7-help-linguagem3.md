---
disciplina: DSM1/ALP
titulo: linguagem3
fonte: DSM1/ALP/PROGRAMAS/visualg3.0.7/visualg3.0.7/help/linguagem3.htm
tipo: htm
paginas: 0
extraido_em: 2026-10-24
---

A Linguagem de Programao do Visualg (3)


A Linguagem de Programao do VisuAlg (3)


Comandos de Repetio


O VisuAlg implementa as trs estruturas de
repetio usuais nas linguagens de programao: o lao contado
para...ate...faca

(similar ao
for...to...do

do Pascal), e os laos condicionados
enquanto...faca

(similar ao
while...do
)
e
repita...ate

(similar ao
repeat...until
).
A sintaxe destes comandos  explicada a seguir.


Para ... faa


Esta estrutura repete uma seqncia de comandos um determinado
nmero de vezes.


para
 <varivel>
 de
 <valor-inicial>
 ate

 <valor-limite>
 [passo
 <incremento>
] faca


  
<seqncia-de-comandos>

  fimpara


<
varivel
 >


 a varivel contadora que controla o nmero de repeties do lao.
      Na verso atual, deve ser necessariamente uma varivel do tipo
inteiro
,
      como todas as expresses deste comando.


<valor-inicial>


uma expresso que especifica o valor de inicializao da varivel contadora antes da primeira
      repetio do lao.


<valor-limite >


 uma
expresso que especifica o valor mximo que a varivel contadora pode alcanar.


<incremento >


 opcional. Quando presente,
      precedida pela palavra
passo
,  uma expresso que
      especifica o incremento que ser acrescentado  varivel contadora em cada repetio do
      lao. Quando esta opo no  utilizada, o valor padro de
<
incremento>


      1. Vale a pena ter em conta que tambm  possvel especificar valores
      negativos para
<incremento>
.
      Por outro lado, se a avaliao da expresso
 <
incremento
 >


resultar em valor nulo, a execuo do
      algoritmo ser interrompida, com a impresso de uma mensagem de erro.


fimpara


Indica o fim da seqncia de comandos a serem repetidos. Cada vez que o programa
chega neste ponto,  acrescentado  varivel contadora o valor de
 <
incremento
 >
, e
comparado a

<valor-limite >
. Se for menor ou igual (ou maior ou igual,
      quando
<incremento >
 for negativo), a
      seqncia de comandos
ser executada mais uma vez; caso contrrio, a execuo prosseguir a
      partir do primeiro
comando que esteja aps o
fimpara
.


<valor-inicial >
,


<valor-limite >
e


<incremento >

so avaliados uma
nica vez
 antes da execuo da primeira repetio, e

 no se alteram
durante a execuo do lao
, mesmo que variveis eventualmente presentes
nessas expresses tenham seus valores alterados.


No exemplo a seguir, os nmeros de 1 a 10 so
exibidos em ordem crescente.


algoritmo "Nmeros de 1 a 10"

  var j: inteiro

  inicio

  para j de 1 ate 10 faca

     escreva (j:3)

  fimpara

  fimalgoritmo


Importante:
 Se, logo no incio da primeira
repetio,
<valor-inicial >


for maior que

<valor-limite >

 (ou menor, quando
<incremento>
 for negativo), o lao no ser
executado nenhuma vez. O exemplo a seguir no imprime nada.


algoritmo "Numeros de 10 a 1 (no
  funciona)"

  var j: inteiro

  inicio

  para j de 10 ate 1 faca

       escreva (j:3)

  fimpara

  fimalgoritmo


Este outro exempo, no entanto, funcionar por causa
  do
passo -1
:


algoritmo "Numeros de 10 a 1 (este
  funciona)"

  var j: inteiro

  inicio

  para j de 10 ate 1 passo -1 faca

       escreva (j:3)

  fimpara

  fimalgoritmo


Enquanto ... faa


Esta estrutura repete uma seqncia de comandos enquanto uma
determinada condio (especificada atravs de uma expresso lgica) for satisfeita.


enquanto


  <expresso-lgica>
 faca


  
<seqncia-de-comandos>

  fimenquanto


<expresso-lgica>


Esta expresso
que  avaliada antes de cada repetio do lao. Quando seu resultado for
VERDADEIRO,
 <seqncia-de-comandos>
  executada.


fimenquanto


Indica o fim da
 <seqncia-de-comandos>
 
      que ser repetida. Cada vez que
      a execuo atinge este ponto, volta-se
ao incio do lao para que

  <expresso-lgica>


 seja avaliada novamente. Se o resultado
      desta avaliao for VERDADEIRO, a
 <seqncia-de-comandos>
 
      ser
executada mais uma vez; caso contrrio, a execuo prosseguir a partir do primeiro comando
aps
fimenquanto
.


 O mesmo exemplo anterior pode ser resolvido
com esta estrutura de repetio:


algoritmo "Nmeros de 1 a 10 (com enquanto...faca)"

  var j: inteiro

  inicio

  j <- 1

  enquanto j <= 10 faca

     escreva (j:3)

     j <- j + 1

  fimenquanto

  fimalgoritmo


Importante:
 Como o lao
enquanto...faca

testa sua condio de parada
 antes
 de executar sua seqncia de comandos,
esta seqncia poder ser executada
zero ou mais vezes
.


Repita ... at


Esta estrutrura repete uma seqncia de comandos at que uma
determinada condio (especificada atravs de uma expresso lgica) seja
satisfeita.


repita


  
<seqncia-de-comandos>


ate


  <expresso-lgica>


repita


Indica o incio do lao.


ate

<
expresso-lgica
>


Indica o
fim da
 <seqncia-de-comandos>

a serem repetidos. Cada vez que o programa chega
neste ponto,
<expresso-lgica>
  avaliada: se seu resultado for FALSO,
      os comandos presentes entre esta linha e a linha
repita

      so executados; caso contrrio, a execuo prosseguir a partir do primeiro comando aps esta
linha.


Considerando ainda o mesmo exemplo:


algoritmo "Nmeros de 1 a 10 (com repita)"

  var j: inteiro

  inicio

  j <- 1

  repita

     escreva (j:3)

       j <- j + 1

  ate j > 10

  fimalgoritmo


Importante:
 Como o lao
repita...ate

testa sua condio de parada
depois
 de executar sua seqncia de comandos,
esta seqncia poder ser executada
uma ou mais vezes
.


Comando Interrompa


As trs estruturas de repetio acima permitem
  o uso do comando
interrompa
,
  que causa uma sada imediata do lao. Embora esta tcnica esteja de certa forma em desacordo com os
  princpios da programao estruturada, o comando
interrompa

  foi includo no VisuAlg por ser encontrado na literatura de introduo
  programao e mesmo em linguagens como o Object Pascal (Delphi/Kylix), Clipper, VB, etc.
  Seu uso  exemplificado a seguir:


algoritmo "Nmeros de 1 a 10 (com
  interrompa)"

  var x: inteiro

  inicio

  x <- 0

  repita

     x <- x + 1

     escreva (x:3)

     se x = 10 entao

        interrompa

     fimse

  ate falso

  fimalgoritmo


O VisuAlg permite ainda uma forma alternativa do
comando
repita...ate
,
com a seguinte sintaxe:


algoritmo "Nmeros de 1 a 10 (com interrompa) II"

  var x: inteiro

  inicio

  x <- 0


  repita

     x <- x + 1

     escreva (x:3)

     se x = 10 entao

        interrompa

     fimse


fimrepita

  fimalgoritmo


Com esta sintaxe alternativa, o uso do
interrompa

 obrigatrio, pois  a nica maneira de se sair do lao
repita...fimrepita
;
caso contrrio, este lao seria executado indeterminadamente.


Anterior

Prxima


 
Objetivos
   

Tela principal
   

Menu
   

A linguagem do VisuAlg
   

Referncias da linguagem do VisuAlg
  

Mais
recursos
