---
disciplina: DSM1/ALP
titulo: Principal
fonte: DSM1/ALP/PROGRAMAS/visualg3.0.7/visualg3.0.7/help/Principal.htm
tipo: htm
paginas: 0
extraido_em: 2026-10-24
---

Menu do Visualg


A
Tela Principal do VISUALG 3.0


A tela do
VISUALG
 compe-se: Uma barra de menus, Uma barra de
  botes, uma rea dos programas (ou rea de edio e criao do cdigo-fonte)
  e apresenta o nome dos algoritmos (arquivos). Uma rea de variveis de memria
  (globais e locais) dos programas, funes, procedimentos, que esto sendo
  executados no momento. Uma rea de programas que mostra o resultado aps a
  execuo do cdigo. E por ltimo uma rea ou
TELA

  que mostra a execuo do algoritmo, com o ttulo:
CONSOLE SIMULANDO O MODO TEXTO DO MS-DOS
.
  No final contm uma barra de status contendo informaes do programa e do
  algoritmo que est sendo editado e executado.


 


O
editor de textos
 (que na verso
  anterior ocupara a metade superior da tela), agora ocupa metade da esquerda
  da tela e dever conter o cdigo-fonte do algoritmo em
Portugol
. Antes dos programas
  serem carregados, na rea do editor h um
"esqueleto" de
  pseudocdigo
, com comentrios e informaes
 iniciais com a
  inteno de poupar trabalho ao usurio e de mostrar o formato bsico que deve
  ser seguido. Mostrando a interface do
VISUALG
.
  Da esquerda mostrando a nova roupagem com seu novo layout (leiaute) e na
  direita mostra como era a verso
2 e a verso 2.5
, j desativada.


 


A Barra
de Tarefas


Contm a barra do
MENU PRINCIPAL

no
VISUALG 3.0
,
 com as opes {
A
rquivo,
E
ditar,

R
un (executar o algoritmo),
E
xportar,
M
anuteno,
H
elp
(Ajuda)
 }.


Depois
abaixo tem uma Barra de botes com os atalhos das opes do menu (novo, abrir,
gravar, rodar, passo, time, parar, etc.), alguns botes das verses antigas
foram substitudos.


Abrir [Ctrl-A]:

Abre um arquivo anteriormente gravado,
  substituindo o texto presente no editor. Se este tiver sido modificado, o
  VisuAlg pedir sua confirmao para salv-lo antes que seja sobreposto.


Novo [Ctrl-N]:

Cria um novo
  "esqueleto" de pseudocdigo, substituindo o texto presente no
  editor. Se este tiver sido modificado, o VisuAlg pedir sua confirmao para
  salv-lo antes que seja sobreposto.


Salvar [Ctrl-S]:

Grava
  imediatamente o texto presente no editor. Na primeira vez que um novo texto
  gravado, o VisuAlg pede seu nome e localizao.


Imprimir:

Imprime
  imediatamente na impressora padro o texto presente no editor. Para
  configurar a impresso, use o comando Imprimir do menu Arquivo (acessvel
  tambm pelo atalho
Ctrl-P
).


Cortar [Ctrl-X]:

Apaga texto
  selecionado, armazenando-o em uma rea de transferncia.

  Copiar [Ctrl-C]:

Copia o texto
  selecionado para a rea de transferncia.

  Colar [Ctrl-V]:

Copia texto da
  rea de transferncia para o local em que est o cursor.

  Gravar bloco de texto:
 Permite a gravao em arquivo de um texto
  selecionado no editor. A extenso sugerida para o nome do arquivo
.inc
.

  Inserir bloco de texto:
 Permite a insero do contedo de um arquivo. A
  extenso sugerida para o nome do arquivo
.inc
.

  Desfazer [Ctrl-Z]:

Desfaz ltimo
  comando efetuado.

  Refazer [Shift-Ctrl-Z]:
 Refaz ltimo comando desfeito.

  Localizar [Ctrl-L]:
Localiza no
  texto presente no editor determinada palavra especificada.

  Substituir [Ctrl-U]:

Localiza no
  texto presente no editor determinada palavra especificada, substituindo-a por
  outra.

  Corrigir Indentao [Ctrl-G]
: Corrige automaticamente a
indentao

  (ou tabulao) do pseudocdigo, tabulando cada comando interno com espaos
  esquerda.


Numerar linhas:
 Ativa ou desativa a exibio dos nmeros das linhas na
  rea  esquerda do editor. A linha e a coluna do editor em que o cursor est
  em um determinado momento tambm so mostradas na barra de
status

  (parte inferior da tela). Por motivos tcnicos, esta opo  automaticamente
  desativada durante a execuo do pseudocdigo, mas volta a ser ativada logo
  em seguida.


Mostrar variveis modificadas
: Ativa ou desativa a exibio da
  varivel que est sendo modificada. Como o nmero de variveis pode ser
  grande, muitas podem estar fora da janela de visualizao; quando esta
  caracterstica est ativada, o VisuAlg rola a grade de exibio de modo que
  cada varivel fique visvel no momento em est sendo modificada. Este recurso
   especialmente til quando se executa um pseudocdigo passo a passo. Por
  questes de desempenho, a configurao padro desta caracterstica
desativada,

  quando o pseudocdigo est sendo executado automaticamente. No entanto, basta
  clicar este boto para execut-lo automaticamente com a exibio ativada. No
  final da execuo, a configurao volta a ser
desativada
.


 


 


Run
  (Executar)

ou [F9]: 
Inicia (ou
  continua) a execuo automtica do pseudocdigo.


Executar com
timer
 [Shift-F9]:
: Insere um atraso (que pode ser
  especificado no intervalo ao lado) antes da execuo de cada linha. Tambm
  reala em fundo azul o comando que est sendo executado, da mesma forma que
  na execuo passo a passo.


Intervalo do
timer
: 
Atraso em cada linha, para quando se
  deseja executar o pseudocdigo com
timer
.

  Passo [F8]:
 Inicia (ou continua) a execuo linha por linha do
  pseudocdigo, dando ao usurio a oportunidade de acompanhar o fluxo de
  execuo, os valores das variveis e a pilha de ativao dos subprogramas.


Parar [Ctrl-F2]:
Termina imediatamente a execuo do pseudocdigo.
  Evidentemente, este boto fica desabilitado quando o pseudocdigo no est
  sendo executado.


Liga/desliga
breakpoint
 [F5]:
 Insere/remove um ponto de parada
  na linha em que esteja o cursor. Estes pontos de parada so teis para a
  depurao e acompanhamento da execuo dos pseudocdigos, pois permitem a
  verificao dos valores das variveis e da pilha de ativao de subprogramas.


  Desmarcar todos os
breakpoints
 [Ctrl-F5]:

Desativa todos os
breakpoints
 que estejam ativados naquele momento.

  Gerar valores aleatrios:

Ativa a
  gerao de valores aleatrios que substituem a digitao de dados. A faixa
  padro de valores gerados  de
0 a 100 inclusive
, mas pode
  ser modificada (basta alterar intervalo ao lado). Para a gerao de dados do
  tipo caractere, no h uma faixa pr-estabelecida: os dados gerados sero
  sempre
strings
 de 5 letras maisculas.

  Intervalo dos valores aleatrios:
 Faixa de valores que sero gerados
  automaticamente, quando esta opo estiver ativada.


Perfil [F7]:

Aps a execuo
  de um pseudocdigo, exibe o nmero de vezes que cada umas das suas linhas foi
  executada.  til para a anlise de eficincia (por exemplo, nos mtodos de
  ordenao).


Mostrar pilha de ativao [Ctrl-F3]:


Exibe a pilha de subprogramas ativados num dado momento. Convm
  utilizar este comando em conjunto com
breakpoints
 ou com a execuo
  passo a passo.

  Ajuda [F1]:

Possibilita acesso s
  pginas de ajuda e s informaes sobre o VISUALG.


 


Quadro de Variveis


  formado por uma grade na qual so mostrados o escopo de cada varivel (se for
  do programa principal, ser global; se for local, ser apresentado o nome do
  subprograma onde foi declarada), seus nomes (tambm com os ndices, nos casos
  em que sejam vetores), seu tipo: ("I" para inteiro, "R"
  para real, "C" para caractere e "L" para lgico) e o seu
  valor corrente.


A
  verso atual do VISUALG permite a visualizao de at 500 variveis (contando
  individualmente cada elemento dos vetores).


 


A Barra de
Status


Situada na parte
  inferior da tela, esta barra contm: 4 partes, onde na primeira parte
  apresentada o n da
Linha : Coluna
. Ex.
9:3.


Na segunda parte
  dois situao atual com as palavras
Modificado,
  Executando, Pesquisando, Substituindo ou em Branco.


 


No caso do
  pseudo-cdigo seja alterado desde que foi carregado ou salvo pela ltima vez.


Nesta barra, h ainda
  uma terceira parte que mostra um texto dizendo que: pode-se usar a sequncia
  de teclas
Ctrl e J
 que
  mostrar todos os comandos, funes e operadores e as setas para
  movimentar-se no texto.


A quarta parte,
  mostram as mensagens sensitivas que definem cada posio do programa,
  identificando-as.


 
Objetivos
   

Tela principal
   


Menu
   

A linguagem do
VisuAlg
   
Referncias da linguagem do VisuAlg
  
Mais recursos
