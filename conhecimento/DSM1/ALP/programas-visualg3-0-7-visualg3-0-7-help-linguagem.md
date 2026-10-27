---
disciplina: DSM1/ALP
titulo: linguagem
fonte: DSM1/ALP/PROGRAMAS/visualg3.0.7/visualg3.0.7/help/linguagem.htm
tipo: htm
paginas: 0
extraido_em: 2026-10-24
---

A Linguagem de Programao do Visualg (1)


A Linguagem de Programao do VisuAlg (1) 


Introduo


A linguagem que o VisuAlg interpreta  bem
simples:  uma verso portuguesa dos pseudocdigos largamente utilizados nos livros de introduo
programao, conhecida como "Portugol". Tomei a liberdade de acrescentar-lhe
alguns comandos novos,
com o intuito de criar facilidades especficas para o ensino de tcnicas de
elaborao de algoritmos. Inicialmente, pensava em criar uma sintaxe muito simples e
"liberal", para que o usurio se preocupasse apenas com a lgica da
resoluo dos problemas e no com as palavras-chave, pontos e vrgulas, etc.
No entanto, cheguei depois  concluso de que alguma formalidade seria no s
necessria como til, para criar um sentido de disciplina na elaborao do
"cdigo-fonte".


A linguagem do VisuAlg permite apenas
 um comando
por linha
: desse modo, no h necessidade de
tokens
 separadores de
estruturas, como o ponto e vrgula em Pascal. Tambm no existe o conceito de
blocos de comandos (que correspondem ao
begin

e
end
 do Pascal e ao
{

e
}

do C), nem comandos de desvio incondicional como o
goto
. Na verso atual do
VisuAlg, com exceo das rotinas de entrada e sada,
 no
 h nenhum
subprograma embutido, tal como
Inc()
,
Sqr()
,
Ord()
,

Chr()
,
Pos()
,
Copy()
 ou outro.


Importante:
 para facilitar a digitao e
evitar confuses,
todas as palavras-chave do VisuAlg foram implementadas sem acentos, cedilha, etc.
Portanto, o tipo de dados
lgico
  definido como
logico
, o
comando
se..ento..seno
  definido como
se..entao..senao
, e assim por diante. O
VisuAlg tambm no distingue maisculas e minsculas no reconhecimento
de palavras-chave e nomes de variveis.


Formato Bsico do Pseudocdigo e Incluso
de Comentrios


O formato bsico do nosso pseudocdigo  o seguinte:


algoritmo
 "semnome"

  // Funo :

  // Autor :

  // Data : 

  // Seo de Declaraes 


inicio

  // Seo de Comandos 


fimalgoritmo


A primeira linha  composta pela
palavra-chave
algoritmo

seguida do seu nome delimitado por aspas duplas. Este nome ser usado como
ttulo nas janelas de leitura de dados (nas futuras verses do VisuAlg, talvez utilizemos este dado de outras formas). A seo que se segue  a de
declarao de variveis, que termina com a linha que contm a palavra-chave
inicio
.
Deste ponto em diante est a seo de comandos, que continua at a linha em
que se encontre a palavra-chave
fimalgoritmo
.
Esta ltima linha marca o final do pseudocdigo: todo texto existente a
partir dela  ignorado pelo interpretador.


O VisuAlg permite a incluso de comentrios: qualquer texto precedido de "//"
ignorado, at se atingir o final da sua linha. Por este motivo, os comentrios no
se estendem por mais de uma linha: quando se deseja escrever comentrios mais longos,
que ocupem vrias linhas, cada uma delas dever comear por "//".


Tipos de Dados


O VisuAlg prev quatro tipos de dados:
inteiro
,

real
,
cadeia de caracteres
 e
lgico
 (ou
booleano
). As palavras-chave que os definem so as
seguintes (observe que elas no tm acentuao):


inteiro
: define variveis
  numricas do tipo inteiro, ou seja, sem casas decimais.


real
: define variveis
  numricas do tipo real, ou seja, com casas decimais.


caractere
: define variveis do tipo

string
, ou seja, cadeia de caracteres.


logico
: define variveis do tipo

 booleano
, ou seja, com valor VERDADEIRO ou FALSO.


O VisuAlg permite tambm a
declarao de variveis estruturadas atravs da palavra-chave
vetor
,
como ser explicado a seguir.


Nomes de Variveis e sua
Declarao


Os nomes das variveis devem comear por uma
letra e depois conter letras, nmeros ou
underline
, at um limite de 30
caracteres. As variveis podem ser simples ou estruturadas (na verso atual,
os vetores podem ser de uma ou duas dimenses). No pode haver duas variveis com o
mesmo nome, com a natural exceo dos elementos de um mesmo vetor.


A seo de declarao de variveis comea
com a palavra-chave
var
,
e continua com as
 seguintes sintaxes:


<lista-de-variveis>
 :

  <tipo-de-dado>

  <lista-de-variveis>
 : vetor "["
<lista-de-intervalos>"
]"
  de
<tipo-de-dado>


Na
<lista-de-variveis>
,
os nomes das variveis esto separados por vrgulas. Na
<lista-de-intervalos>
,
os
<intervalo>

so separados por vrgulas, e tm a seguinte sintaxe:


<intervalo>
:
<valor-inicial>

  ..
<valor-final>
 


Na verso atual do VisuAlg, tanto
<valor-inicial>

como
<valor-final>

devem ser inteiros. Alm disso, exige-se evidentemente que
<valor-final>

seja maior do que
<valor-inicial>
.


Exemplos:


var a: inteiro

      Valor1, Valor2: real

      vet: vetor [1..10] de real

      matriz: vetor [0..4,8..10] de inteiro

      nome_do_aluno: caractere

      sinalizador: logico


Note que no h a necessidade de ponto e
vrgula aps cada declarao: basta pular linha. A declarao de vetores
 anloga  linguagem Pascal: a varivel
 vet
 acima tem 10 elementos, com os ndices de
[1] a [10], enquanto
 matriz
 corresponde a 15 elementos com ndices [0,8], [0,9],
[0,10], [1,8], [1,9], [1,10], ... at [4,10]. O nmero total de variveis suportado pelo
VisuAlg  500 (cada
elemento de um vetor  contado individualmente).


Constantes e Comando de Atribuio


O VisuAlg tem trs tipos de constantes:


Numricos
: so valores numricos escritos na
  forma usual das linguagens de programao. Podem ser inteiros ou reais.
  Neste ltimo caso, o separador de decimais  o
  ponto e no a vrgula, independente da configurao regional do computador
  onde o VisuAlg est sendo executado. O VisuAlg tambm no suporta
  separadores de milhares.


  Caracteres
: qualquer cadeia de caracteres delimitada por aspas duplas
  (").


  Lgicos
: admite os valores VERDADEIRO ou FALSO.


A atribuio de valores a variveis  feita
com o operador
<-
.
Do seu lado esquerdo fica a varivel  qual est sendo atribudo o
valor, e  sua direita pode-se colocar qualquer expresso (constantes, variveis,
expresses numricas), desde que seu resultado tenha tipo igual ao da varivel.


Alguns exemplos de atribuies, usando as variveis declaradas
acima:


a <- 3

  Valor1 <- 1.5

  Valor2 <- Valor1 + a

  vet[1] <- vet[1] + (a * 3)

  matriz[3,9] <- a/4 - 5

  nome_do_aluno <- "Jos da Silva"

  sinalizador <- FALSO


Prxima


 
Objetivos
   

Tela principal
   

Menu
   

A linguagem do VisuAlg
   

Referncias da linguagem do VisuAlg
  

Mais
recursos
