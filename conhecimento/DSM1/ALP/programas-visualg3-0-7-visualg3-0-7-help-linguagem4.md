---
disciplina: DSM1/ALP
titulo: linguagem4
fonte: DSM1/ALP/PROGRAMAS/visualg3.0.7/visualg3.0.7/help/linguagem4.htm
tipo: htm
paginas: 0
extraido_em: 2026-10-24
---

A Linguagem de Programao do Visualg (4)


A Linguagem de Programao do VisuAlg (4)


Subprograma

 um programa que auxilia o programa principal atravs da realizao de uma
determinada subtarefa. Tambm costuma receber os nomes de
sub-rotina
,
procedimento,
mtodo
 ou
mdulo
.


Os
subprogramas so chamados dentro do corpo do programa principal como se fossem
comandos
.
Aps seu trmino, a execuo continua a partir do ponto onde foi chamado.
importante compreender que a chamada de um subprograma simplesmente gera um
desvio
provisrio no fluxo de execuo
.


H
um caso particular de subprograma que recebe o nome de
funo
. Uma
funo
,
alm de executar uma determinada tarefa, retorna um valor para quem a chamou,
que  o resultado da sua execuo. Por este motivo, a chamada de uma funo
aparece no corpo do programa principal como uma
expresso
, e no como
um comando.


Cada
subprograma, alm de ter acesso s variveis do programa que o chamou (so
as variveis
globais
), pode ter suas prprias variveis (so as variveis

locais
), que existem apenas durante sua chamada.


Ao
se chamar um subprograma, tambm  possvel passar-lhe determinadas informaes
que recebem o nome de
parmetros
 (so valores que, na linha de chamada,
ficam entre os parnteses
e que esto separados por vrgulas). A quantidade dos parmetros, sua seqncia
e respectivos tipos no podem mudar: devem estar de acordo com o que foi
especificado na sua correspondente declarao.


Para
se criar subprogramas,  preciso descrev-los aps a declarao das variveis
e antes do corpo do programa principal.


O VisuAlg possibilita declarao e chamada de subprogramas
nos moldes da linguagem Pascal, ou seja, procedimentos e funes com passagem
de parmetros por valor ou referncia. Isso ser explicado a seguir.


Procedimentos


Em VisuAlg, procedimento  um subprograma que no retorna
nenhum valor (corresponde ao
procedure
 do Pascal). Sua
declarao, que deve estar entre o final da declarao de
variveis e a linha
inicio

do programa principal, segue a sintaxe abaixo:


procedimento
<nome-de-procedimento>

  [(
<seqncia-de-declaraes-de-parmetros>
)]


  // Seo de Declaraes
 Internas

  inicio


  // Seo de Comandos

  fimprocedimento


O
<nome-de-procedimento>

obedece as mesmas regras de nomenclatura das variveis. Por
outro lado, a
<seqncia-de-declaraes-de-parmetros>


 uma seqncia de


[var]
<seqncia-de-parmetros>
:

  <tipo-de-dado>


separadas por ponto e vrgula. A presena
(opcional) da palavra-chave
var

indica passagem de parmetros por referncia; caso contrrio, a passagem
ser por valor. 


Por sua vez,
<seqncia-de-parmetros>

 uma seqncia de nomes de parmetros (tambm obedecem a mesma regra de
nomenclatura de variveis) separados por vrgulas.


De modo anlogo ao programa principal, a seo de declarao
internas comea
com a palavra-chave
var
,
e continua com a seguinte sintaxe:


<lista-de-variveis>
 :

  <tipo-de-dado>


Nos
prximos exemplos, atravs de um subprograma
soma
,
ser calculada a soma entre os valores
4

e
9

(ou seja, ser obtido o resultado
13
)
que o programa principal imprimir em seguida. No primeiro caso, um
procedimento
sem parmetros
 utiliza uma varivel local
aux

para armazenar provisoriamente o resultado deste clculo (evidentemente, esta
varivel  desnecessria, mas est a apenas para ilustrar o exemplo),
antes de atribu-lo  varivel global
res
:


procedimento soma

  var aux: inteiro

  inicio


//
n,
  m e res so variveis globais


aux <- n + m

  res <- aux

  fimprocedimento


No
  programa principal deve haver os seguintes comandos:


n <- 4

  m <- -9

  soma

  escreva(res)


A mesma
tarefa poderia ser executada atravs de um
procedimento com parmetros
,
como descrito abaixo:


procedimento soma (x,y: inteiro)

  inicio


//
res
   varivel global


res <- x + y

  fimprocedimento


No
  programa principal deve haver os seguintes comandos:


n <- 4

  m <- -9

  soma(n,m)

  escreva(res)


A
passagem de parmetros do exemplo acima chama-se
passagem por valor
.
Neste caso, o subprograma simplesmente recebe um valor que utiliza durante sua
execuo. Durante essa execuo, os parmetros passados por valor so anlogos
s suas variveis locais, mas com uma nica diferena: receberam um valor
inicial no momento em que o subprograma foi chamado.


Funes


Em VisuAlg, funo  um subprograma que retorna
  um valor (corresponde ao
function
 do Pascal). De modo anlogo aos procedimentos,
  sua declarao deve estar entre o final da declarao de variveis e a linha

inicio

  do programa principal, e segue a sintaxe abaixo:


funcao
<nome-de-funo>

  [(
<seqncia-de-declaraes-de-parmetros>
)]:
<tipo-de-dado>

  // Seo de Declaraes Internas

  inicio

  // Seo de Comandos

  fimfuncao


O
<nome-de-funo>
 obedece as mesmas regras de nomenclatura das variveis. Por
outro lado, a
<seqncia-de-declaraes-de-parmetros>


 uma seqncia de


[var]
<seqncia-de-parmetros>
:

  <tipo-de-dado>


separadas por ponto e vrgula. A presena
(opcional) da palavra-chave
var

indica passagem de parmetros por referncia; caso contrrio, a passagem
ser por valor. 


Por sua vez,
<seqncia-de-parmetros>

 uma seqncia de nomes de parmetros (tambm obedecem a mesma regra de
nomenclatura de
variveis) separados por vrgulas.


O valor retornado pela funo ser do tipo
especificado
na sua declarao (logo aps os dois pontos). Em alguma parte da funo (de
modo geral, no seu final), este valor deve ser retornado atravs do comando
retorne
.


De modo anlogo ao programa principal, a seo de declarao
internas comea
com a palavra-chave
var
,
e continua com a seguinte sintaxe:


<lista-de-variveis>
 :

  <tipo-de-dado>


Voltando
ao exemplo anterior, no qual calculamos e imprimimos a soma entre os valores
4

e
9
,
vamos mostrar como isso poderia ser feito atravs de
uma

funo sem parmetros
. Ela tambm utiliza uma varivel local
aux

para armazenar provisoriamente o resultado deste clculo, antes de atribu-lo
 varivel global
res
:


funcao
 soma: inteiro

  var aux: inteiro

  inicio


//
n,
  m e res so variveis globais


aux <- n + m

  retorne aux

  fimfuncao


No
  programa principal deve haver os seguintes comandos:


n <- 4

  m <- -9

  res <- soma

  escreva(res)


Se
realizssemos essa mesma tarefa com uma
funo com parmetros passados
por valor
, poderia ser do seguinte modo:


funcao
 soma (x,y: inteiro): inteiro

  inicio

  retorne x + y

  fimfuncao


No
  programa principal deve haver os seguintes comandos:


n <- 4

  m <- -9

  res <- soma(n,m)

  escreva(res)


Passagem de Parmetros por Referncia


H
ainda uma outra forma de passagem de parmetros para subprogramas:  a
passagem por referncia. Neste caso, o subprograma no recebe apenas um valor,
mas sim o
endereo

de
uma varivel global. Portanto, qualquer modificao que for realizada no
contedo deste parmetro afetar tambm a varivel global que est
associada a ele. Durante a execuo do subprograma, os parmetros passados
por referncia so anlogos s variveis globais. No VisuAlg, de forma
anloga a Pascal, essa passagem  feita atravs da palavra
var

na declarao do parmetro.


Voltando ao
exemplo da soma, o procedimento abaixo realiza a mesma tarefa utilizando
passagem de parmetros por referncia:


procedimento soma (x,y: inteiro; var
  result: inteiro)

  inicio

  result <- x + y

  fimprocedimento


No
  programa principal deve haver os seguintes comandos:


n <- 4

  m <- -9

  soma(n,m,res)

  escreva(res)


Recurso e Aninhamento


A atual
verso do VisuAlg permite recurso, isto , a possibilidade de que um
subprograma possa chamar a si mesmo. A funo do exemplo abaixo calcula
recursivamente o fatorial do nmero inteiro que recebe como parmetro:


funcao fatorial (v:
  inteiro): inteiro

  inicio

  se v <= 2 entao

   retorne v

  senao

   retorne v * fatorial(v-1)

  fimse

  fimfuncao


Em
Pascal,  permitido o aninhamento de subprogramas, isto , cada subprograma
tambm pode ter seus prprios subprogramas. No entanto, esta caracterstica
dificulta a elaborao dos compiladores e, na prtica, no  muito
importante. Por este motivo, ela no  permitida na maioria das linguagens de
programao (como C, por exemplo), e o VisuAlg no a implementa.


Anterior

Prxima


 
Objetivos
   

Tela principal
   

Menu
   

A linguagem do VisuAlg
   

Referncias da linguagem do VisuAlg
  

Mais
recursos
