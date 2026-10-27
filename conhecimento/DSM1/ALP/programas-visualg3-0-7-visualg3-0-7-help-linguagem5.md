---
disciplina: DSM1/ALP
titulo: linguagem5
fonte: DSM1/ALP/PROGRAMAS/visualg3.0.7/visualg3.0.7/help/linguagem5.htm
tipo: htm
paginas: 0
extraido_em: 2026-10-24
---

A Linguagem de Programao do Visualg (4)


A Linguagem de Programao do VisuAlg (5)


O VisuAlg implementa algumas extenses s
linguagens "tradicionais" de programao, com o intuito
principal de ajudar o seu uso como ferramenta de ensino. Elas so mostradas a
seguir.


Comando Aleatrio


Muitas vezes a digitao de dados para o teste
de um
programa torna-se uma tarefa entediante. Com o uso do comando
aleatorio
 do
VisuAlg, sempre que um comando
 leia
 for encontrado,
a digitao de valores numricos e/ou
caracteres  substituda por uma gerao aleatria. Este comando no afeta a leitura de variveis
lgicas: com
certeza, uma coisa pouco usual em programao... 


Este comando tem as seguintes
sintaxes:


aleatorio [on]


Ativa a gerao de valores aleatrios
      que substituem a digitao de
dados. A palavra-chave
on

       opcional.
 A faixa padro de valores
      gerados  de 0 a 100 inclusive.
Para a gerao de dados do tipo
      caractere, no h uma faixa pr-estabelecida: os dados gerados sero sempre

strings
 de 5 letras maisculas.


aleatorio
 <valor1 >
 [,
 <valor2
>
 ]


Ativa a gerao de
dados numricos aleatrios estabelecendo uma faixa de valores mnimos e
mximos. Se apenas
< valor1>
 for fornecido, a faixa ser de 0 a
<valor1>
 inclusive;
      caso contrrio, a faixa ser
de
<
valor1>

a
<
valor2>

inclusive. Se
<
valor2>

for menor que
<
valor1>
,
o VisuAlg os trocar para que a faixa fique correta.  

      Importante:

<
valor1>

e
<
valor2>

devem ser
constantes numricas
, e no expresses.


aleatorio off


Desativa

a
 gerao de valores aleatrios. A palavra-chave
off

 obrigatria.


Comando Arquivo


Muitas vezes  necessrio repetir os testes de um
programa com uma srie igual de dados. Para casos como este, o VisuAlg permite
o armazenamento de dados em um arquivo-texto, obtendo deles os dados ao executar
os comandos
leia
. 

 Esta caracterstica funciona da seguinte maneira:

    1) Se
no existir
 o arquivo com nome especificado, o
VisuAlg far uma leitura de dados atravs da digitao, armazenando os dados
lidos neste
arquivo, na ordem em que forem fornecidos.

    2) Se o arquivo
existir
, o VisuAlg obter os dados
deste arquivo at chegar ao seu fim. Da em diante, far as leituras de dados
atravs da digitao.

    3) Somente um comando
 arquivo
 pode ser empregado
em cada pseudocdigo, e ele dever estar na seo de declaraes (dependendo do
"sucesso" desta caracterstica, em futuras verses ela poder ser
melhorada...).

    4) Caso no seja fornecido um caminho, o VisuAlg ir procurar
este arquivo na pasta de trabalho corrente (geralmente,  a pasta onde o
programa VISUALG.EXE est). Este comando no prev uma
extenso padro; portanto, a especificao do nome do arquivo deve ser
completa, inclusive com sua extenso (por exemplo, .txt, .dat, etc.).


A sintaxe do comando :


arquivo
 <nome-de-arquivo>


<nome-de-arquivo>

 uma constante

caractere (entre aspas duplas). Veja o exemplo a seguir:


algoritmo "lendo do arquivo"

  arquivo "teste.txt"

  var x,y: inteiro

  inicio

  para x de 1 ate 5 faca

     leia (y)

  fimpara

  fimalgoritmo


Comando Timer


Embora o VisuAlg seja um interpretador de
pseudocdigo, seu desempenho  muito bom: o tempo gasto para interpretar cada linha
digitada  apenas uma frao de segundo. Entretanto,
por motivos educacionais, pode ser conveniente exibir o fluxo de execuo do
pseudocdigo comando por
comando, em "cmera lenta". O comando
timer

serve para este propsito: insere um atraso (que pode ser especificado) antes da
execuo de cada linha. Alm disso, reala em fundo
azul o comando que est sendo executado, da mesma forma que na execuo passo a
passo.


Sua sintaxe  a seguinte:


timer on


Ativa

      o
timer
.


timer
 <tempo-de-atraso>


Ativa o
timer
 estabelecendo
      seu tempo de atraso em milissegundos. O valor padro  500, que equivale a meio
      segundo. O argumento
<
tempo-de-atraso>

deve ser uma constante inteira com valor entre 0 e 10000. Valores
menores que 0 so corrigidos para 0, e maiores que 10000 para 10000.


timer off


Desativa o
timer.


Ao longo do pseudocdigo, pode haver vrios comandos
timer
.
Todos eles devem estar na seo de comandos. Uma vez ativado, o atraso na execuo dos comandos
ser mantido at se chegar ao final do pseudocdigo ou at ser encontrado um comando
timer


off
.


Comandos de Depurao


Nenhum ambiente de desenvolvimento est completo
se no houver a possibilidade de se inserir pontos de interrupo (
breakpoints
)
no pseudocdigo para fins de depurao. VisuAlg implementa dois comandos que
auxiliam a
depurao ou anlise de um pseudocdigo: o comando
pausa

e o comando
debug
.


Comando Pausa


Sua sintaxe  simplesmente:


pausa


Este comando insere uma interrupo incondicional no
pseudocdigo. Quando ele  encontrado, o VisuAlg pra a execuo do
pseudocdigo e espera alguma ao do programador. Neste momento,
possvel: analisar os
valores das variveis ou das sadas produzidas at o momento; executar o
pseudocdigo passo a passo (com F8); prosseguir sua execuo normalmente (com F9);
ou simplesmente termin-lo (com Ctrl-F2). Com exceo da alterao do texto
do pseudocdigo, todas as funes do VisuAlg esto
disponveis.


Comando Debug


Sua sintaxe :


debug <
expresso-lgica
>


Se a avaliao de
<
expresso-lgica
>


resultar em valor VERDADEIRO, a execuo do
pseudocdigo ser interrompida como no comando
pausa
.
Dessa forma,  possvel a insero de um
breakpoint
 condicional no
pseudocdigo.


Comando Eco


Sua sintaxe : 


eco on | off  


Este comando ativa (
eco


on
)
ou desativa (
eco


off
)
a impresso dos dados de entrada na sada-padro do VisuAlg, ou seja, na rea
direita da parte inferior da tela. Esta caracterstica pode ser til quando houver
uma grande quantidade de dados de entrada, e se deseja apenas analisar a sada produzida.
Convm utiliz-la tambm quando os dados de entrada provm de um arquivo j
conhecido.


Comando Cronmetro


Sua sintaxe :


cronometro on | off  


Este comando ativa (
cronometro
  on
) ou desativa (
cronometro
  off
) o cronmetro interno do VisuAlg. Quando
  o comando
cronometro on

   encontrado, o VisuAlg imprime na sada-padro a informao "Cronmetro
  iniciado.", e comea a contar o tempo em milissegundos. Quando o comando

cronometro off

   encontrado, o VisuAlg imprime na sada-padro a informao "Cronmetro
  terminado. Tempo decorrido: xx segundo(s) e xx ms". Este comando  til
  na anlise de desempenho de algoritmos (ordenao, busca, etc.). 


Comando
  Limpatela


Sua sintaxe é


limpatela


Este comando simplesmente
  limpa a tela DOS do Visualg (a simulação da tela do computador).
  Ele não afeta a "tela" que existe na parte inferior direita
  da janela principal do Visualg.


Anterior


 
Objetivos
   

Tela principal
   

Menu
   

A linguagem do VisuAlg
   

Referncias da linguagem do VisuAlg
  

Mais
recursos
