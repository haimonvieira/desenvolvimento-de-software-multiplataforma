---
disciplina: DSM1/ALP
titulo: menu
fonte: DSM1/ALP/PROGRAMAS/visualg3.0.7/visualg3.0.7/help/menu.htm
tipo: htm
paginas: 0
extraido_em: 2026-10-24
---

Menu do Visualg


Menu do VisuAlg


Este menu compe-se de 7 partes:


Arquivo: 
 Possui os comandos para se
abrir, salvar e imprimir algoritmos:


Novo:
Cria um novo
"esqueleto" de pseudocdigo, substituindo o texto existente no editor. Se
este texto anterior tiver sido modificado, o VisuAlg pedir sua confirmao para salv-lo
antes que seja sobreposto.


Abrir
:
Abre o texto
  de um pseudocdigo anteriormente gravado, substituindo o
texto existente no editor. Se este tiver sido modificado, o VisuAlg pedir sua
confirmao para salv-lo antes que seja sobreposto.


Salvar:
Salva imediatamente o texto
  presente no editor. Caso seja a
primeira vez que um novo texto  gravado, o VisuAlg pedir o nome do arquivo e
  sua localizao.


Salvar como:
Permite salvar o texto presente no editor exibindo antes
  uma
  janela na qual se pode escolher o nome do arquivo e sua localizao.


Enviar por email:
Permite o envio por email do texto presente no
  editor.


Imprimir:
Permite a impresso do algoritmo corrente, mostrando
  antes a janela de configurao de impresso (o correspondente boto da barra de
  tarefas imprime imediatamente o texto do pseudocdigo na impressora padro).


Sair:
Abandona o VisuAlg.


  Alm destes comandos, h ainda a lista dos 5 ltimos algoritmos utilizados,
  que podem ser abertos diretamente ao se escolher o seu nome.


Editar:
Alm dos conhecidos comandos de
um editor de texto (copiar, cortar, colar, desfazer, refazer, selecionar tudo,
localizar, localizar de novo, substituir), h tambm as seguintes opes:


Corrigir indentao:
Corrige automaticamente a

indentao
 do pseudocdigo, tabulando cada comando interno com espaos
  esquerda.


Gravar bloco de texto:
Permite a gravao em arquivo de um texto selecionado
  no editor. A extenso sugerida para o nome do arquivo
.inc
.


Inserir bloco de texto:
Permite a insero do contedo de um arquivo. A
  extenso sugerida para o nome do arquivo
.inc
.


Exibir:
Possui os comandos para ativar/desativar as seguintes caractersticas:


Nmero de linhas:
Ativa/desativa a exibio
  da numerao das linhas na
rea  esquerda do editor. A numerao corrente da posio do cursor tambm
   mostrada na primeira parte da barra de
status, situada na parte inferior da tela. Por motivos tcnicas, a numerao
   desativada durante a execuo do pseudocdigo, voltando  situao
  anterior logo em seguida.


Variveis modificadas:
Ativa/desativa a exibio da varivel que
  est sendo modificada. Como o nmero de variveis pode ser grande, muitas
  podem estar fora da janela de visualizao; quando esta caracterstica est
  ativada, o VisuAlg rola a grade de exibio de modo que cada varivel fique
  visvel no momento em est sendo modificada. Este recurso  especialmente
  til quando se executa um pseudocdigo passo a passo. Por questes de
  desempenho, a configurao padro desta caracterstica
desativada,

  quando o pseudocdigo est sendo executado automaticamente. No entanto,
  basta clicar este boto para execut-lo automaticamente com a exibio
  ativada. No final da execuo, a configurao volta a ser
desativada
.


Pseudocdigo:
Contm os comandos relativos
 execuo do algoritmo:


Executar:
Inicia (ou continua) a execuo automtica do pseudocdigo.


Passo a passo:
Inicia (ou continua) a execuo linha por linha do
  pseudocdigo, dando ao usurio a oportunidade de acompanhar o fluxo de
  execuo, os valores das variveis e a pilha de ativao dos
  subprogramas.


Executar com
 timer
:
Insere um atraso (que pode ser especificado) antes da
execuo de cada linha. Tambm reala em fundo
azul o comando que est sendo executado, da mesma forma que na execuo passo a
passo.


Parar:
Termina imediatamente a execuo do pseudocdigo. Evidentemente,
  este item fica desabilitado quando o pseudocdigo no est sendo executado.


Liga/desliga
breakpoint
:
 Insere/remove um ponto de parada na
  linha em que esteja o cursor. Estes pontos de parada so teis para a
  depurao e acompanhamento da execuo dos pseudocdigos, pois permitem a
  verificao dos valores das variveis e da pilha de ativao de
  subprogramas.


Desmarcar todos os
breakpoints
:
Desativa todos os
 breakpoints

  que estejam ativados naquele momento.


Executar em modo DOS:
Com esta opo ativada, tanto a entrada como a
  sada-padro passa a ser uma janela que imita o DOS, simulando a execuo
  de um programa neste ambiente.


Gerar valores aleatrios:
Ativa a gerao de valores aleatrios
      que substituem a digitao de
dados. A faixa padro de valores
      gerados  de 0 a 100 inclusive, mas pode ser modificada. Para a gerao de dados do tipo
      caractere, no h uma faixa pr-estabelecida: os dados gerados sero sempre

strings
 de 5 letras maisculas.


Perfil:
Aps a execuo de um pseudocdigo, exibe o nmero de vezes
  que cada umas das suas linhas foi executada.  til para a anlise de eficincia
  (por exemplo, nos mtodos de ordenao).


Pilha de ativao:
Exibe a pilha de subprogramas ativados num dado
  momento. Convm utilizar este comando em
  conjunto com
breakpoints
 ou com a execuo passo a passo.


Linguagens:
Permite a traduo
automtico do pseudocdigo presente no editor para outras linguagens de
programao. Atualmente, apenas a traduo para Pascal est implementada,
mas ainda em fase de testes.


Ferramentas:
Neste menu,  possvel
configurar algumas opes do VisuAlg: cores e tipos de letras na exibio do
pseudocdigo, nmero de espaos para indentao automtica, etc.


Ajuda:
Entre outras coisas, possibilita acesso s pginas de
ajuda e s informaes sobre o VisuAlg.


 
Objetivos
   

Tela principal
   

Menu
   

A linguagem do VisuAlg
   

Referncias da linguagem do VisuAlg
  

Mais
recursos
