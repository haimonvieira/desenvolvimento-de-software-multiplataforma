---
disciplina: DSM1/ALP
titulo: linguagem2
fonte: DSM1/ALP/PROGRAMAS/visualg3.0.7/visualg3.0.7/help/linguagem2.htm
tipo: htm
paginas: 0
extraido_em: 2026-10-24
---

A Linguagem de Programao do Visualg (2)


A Linguagem de Programao do VisuAlg (2)


Operadores Aritmticos


+,-


Operadores unrios, isto ,
      so aplicados a um nico operando. So os operadores aritmticos de
      maior precedncia. Exemplos:
-3,
      +x
. Enquanto o operador unrio
-

      inverte o sinal do seu operando, o operador
+

      no altera o valor em nada o seu valor.


\


Operador
de diviso inteira. Por exemplo, 5 \ 2 = 2. Tem a mesma precedncia do
operador de diviso tradicional.


+,-,*,/


Operadores
aritmticos tradicionais de adio, subtrao, multiplicao e
diviso. Por conveno,
 *
 e

 /
 tm precedncia sobre

 +

e
-
. Para modificar a ordem de
avaliao das operaes,  necessrio usar
parnteses como em qualquer expresso aritmtica.


MOD ou %


Operador de mdulo (isto , resto
      da diviso inteira). Por exemplo,
8
      MOD 3 = 2
. Tem a mesma precedncia do operador de diviso tradicional.


^


Operador
de potenciao. Por exemplo, 5 ^ 2 = 25. Tem a maior precedncia entre os
operadores aritmticos binrios (aqueles que tm dois operandos).


Operadores de Caracteres


+


Operador de concatenao de

 strings
 (isto , cadeias de caracteres), quando
usado com dois valores (variveis ou constantes) do tipo "caractere". Por exemplo:
"Rio
" + " de Janeiro" = "Rio de Janeiro"
.


Operadores Relacionais


=, <, >, <=, >=, <> 


Respectivamente: igual,
menor que, maior
que, menor ou igual a, maior ou igual a, diferente de. So utilizados em
expresses lgicas para se testar a relao entre dois valores do mesmo tipo.
Exemplos:
3 = 3

( 3  igual a 3?) resulta em
VERDADEIRO

;
"A" > "B"

("A" est depois de "B" na ordem alfabtica?) resulta
em
FALSO
.


Importante:
 No VisuAlg, as comparaes
entre
strings

no diferenciam
as letras maisculas das minsculas. Assim,
"ABC"

 igual a
"abc"
.
Valores lgicos obedecem  seguinte ordem:

FALSO < VERDADEIRO
.


Operadores Lgicos


nao


Operador
unrio de negao.
nao VERDADEIRO =
FALSO
, e
nao
FALSO = VERDADEIRO
. Tem a maior precedncia
entre os operadores lgicos. Equivale ao

NOT
 do Pascal.


ou


Operador
que resulta
VERDADEIRO

quando um dos seus operandos lgicos for verdadeiro. Equivale ao

OR
 do Pascal.


e


Operador que resulta

VERDADEIRO

somente se seus dois operandos lgicos forem verdadeiros. Equivale ao

AND
 do Pascal.


xou


Operador
que resulta
VERDADEIRO

se seus dois operandos lgicos forem diferentes, e
FALSO

se forem iguais. Equivale ao
 XOR

do Pascal.


Comandos de Sada de Dados


escreva (<
lista-de-expresses>
)


Escreve no dispositivo de
sada padro (isto , na rea  direita da metade inferior da tela do VisuAlg) o
contedo de cada uma das expresses que compem

<lista-de-expresses>
. 
As expresses dentro desta lista devem estar separadas por vrgulas; depois de
serem avaliadas, seus resultados so impressos na ordem indicada.
equivalente ao comando
write

do Pascal.


De modo semelhante a Pascal,  possvel especificar o nmero de espaos no
qual se deseja escrever um determinado valor. Por exemplo, o comando
escreva(x:5)

escreve o valor da varivel
x

em 5 espaos, alinhado-o  direita. Para variveis reais, pode-se tambm
especificar o nmero de casas fracionrias que sero exibidas. Por exemplo,
considerando
y

como uma varivel real, o comando
escreva(y:6:2)
escreve seu valor em 6
espaos colocando 2 casas decimais. 


escreval (
<lista-de-expresses>
)
. 


Idem ao anterior, com a nica diferena que pula uma linha em seguida.
equivalente ao
writeln

do Pascal.


Exemplos:


algoritmo "exemplo"

  var x: real

      y: inteiro

      a: caractere

      l: logico

  inicio

  x <- 2.5

  y <- 6

  a <- "teste"

  l <- VERDADEIRO

  escreval ("x", x:4:1, y+3:4)  // Escreve: x 2.5    9

  escreval (a, "ok")          
  // Escreve: testeok   (e depois pula linha)

  escreval (a, " ok")          // Escreve: teste ok  (e depois pula linha)

  escreval (a + " ok")         // Escreve: teste ok  (e depois pula linha)

  escreva (l)                 
  // Escreve: VERDADEIRO

  fimalgoritmo


Note que o VisuAlg separa expresses do tipo
numrico e lgico com um espao  esquerda, mas no as expresses do tipo caractere, para
que assim possa haver a concatenao. Quando se deseja separar expresses
do tipo caractere,  necessrio acrescentar espaos nos locais adequados.


Comando de Entrada de Dados


leia (
<lista-de-variveis>
)


Recebe valores digitados pelos usurio, atribuindo-os s
variveis cujos nomes esto em
<lista-de-variveis>

( respeitada a ordem especificada nesta lista).  anlogo ao comando
read

do Pascal.


 Veja no
exemplo abaixo o resultado:


algoritmo "exemplo 1"

var x: inteiro;

inicio

leia (x)

escreva (x)

fimalgoritmo


O comando de leitura acima ir exibir uma janela
como a que se v ao lado, com a mensagem padro:

 "Entre com o valor de
<nome-de-varivel>"


 


Se voc clicar em
 Cancelar
 ou teclar
Esc
 durante
a leitura de dados, o programa ser imediatamente interrompido.


Comando de Desvio Condicional


se
 <expresso-lgica>

entao

   
<seqncia-de-comandos>

fimse


Ao encontrar este comando, o VisuAlg analisa a
<expresso-lgica>
. Se o seu
resultado for
VERDADEIRO
,
todos os comandos da
<seqncia-de-comandos>


(
entre esta linha e a linha com
fimse
)

so executados. Se o resultado for
FALSO
,
estes comandos so desprezados e a execuo do algoritmo continua a partir
da primeira linha depois do
fimse
.


se
 <expresso-lgica>

entao

   
<seqncia-de-comandos-1>

senao

   
<seqncia-de-comandos-2>

fimse


Nesta outra forma do comando, se o resultado da
avaliao de
<expresso-lgica>

for
VERDADEIRO
,
todos os comandos da
<seqncia-de-comandos-1>

(entre esta linha e a linha com
senao
)
so executados, e a execuo continua depois a partir da primeira linha
depois do
fimse
.
Se o resultado for
FALSO
,
estes comandos so desprezados e o algoritmo continua a ser executado a partir
da primeira linha depois do
senao
,
executando todos os comandos da
<seqncia-de-comandos-2>

(at a linha com
fimse
).


Estes comandos equivalem ao


if...then

 e
if...then...else

do
Pascal. Note que no h necessidade de delimitadores de bloco (como
begin

e
end
),
pois as seqncias de comandos j esto delimitadas pelas palavras-chave
senao

e
fimse
.
O VisuAlg permite o aninhamento desses comandos de desvio condicional.


Comando de Seleo
Mltipla


O VisuAlg implementa (com certas variaes) o
comando
case

do Pascal. A sintaxe  a seguinte:


escolha
 <expresso-de-seleo>

caso
 <exp11>, <exp12>, ..., <exp1n>

  
<seqncia-de-comandos-1>

caso
 <exp21>, <exp22>, ..., <exp2n>

  
<seqncia-de-comandos-2>

...

outrocaso

  
<seqncia-de-comandos-extra>

fimescolha


Veja o exemplo a seguir, que ilustra bem o que
faz este comando:


algoritmo "Times"

var time: caractere

inicio

escreva ("Entre com o nome de um time de futebol: ")

leia (time)

escolha time

caso "Flamengo", "Fluminense", "Vasco", "Botafogo"

   escreval (" um time carioca.")

caso "So Paulo", "Palmeiras", "Santos", "Cornthians"

   escreval (" um time paulista.")

outrocaso

   escreval (" de outro estado.")

fimescolha

fimalgoritmo


 


Anterior

Prxima


 
Objetivos
   

Tela principal
   

Menu
   

A linguagem do VisuAlg
   

Referncias da linguagem do VisuAlg
  

Mais
recursos
