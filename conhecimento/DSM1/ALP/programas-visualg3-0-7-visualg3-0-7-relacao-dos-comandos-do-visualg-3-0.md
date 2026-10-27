---
disciplina: DSM1/ALP
titulo: RELAÇÃO DOS COMANDOS DO VISUALG 3.0
fonte: DSM1/ALP/PROGRAMAS/visualg3.0.7/visualg3.0.7/RELAÇÃO DOS COMANDOS DO VISUALG 3.0.txt
tipo: txt
paginas: 0
extraido_em: 2026-10-24
---

Dentro do VISUALG 3.0 tem uma CTRL+J mas acho que tambm est incompleta,  que so tantas coisas, que eu estou ainda me organizando.
A maioria deles esto dentro do HELP.CHM

A relao dos comandos, funes, variveis, constantes e dados  :

Funes pr definidas no visualg 3.0 (pseudo-linguagem em portugol)
Abs( )
Log( )
Div( )
Tan( )
Sen( )
Cos( )
Rand( )
Randi( )
Quad( )
Exp( )
Pot( )
Cotan( )
ArcCos( )
ArcSen( )
Raizq( )

Mod ==> usado para achar o mdulo de um nmero em comparaes (o mesmo que ' % ' )
------------------------------------------- teclado ------------------------------------------------------
Leia( varivel_nome ) ==> L do teclado e coloca em uma varivel 'varivel_nome'
--------------------------------------------------------------------------------------------------------------
Funes especiais de converses
Pos( )
Asc( )
Carac( )
Copia ( )
Int( )
Compr( )
Maiusc( )
Minusc( )
NumPCarac( )
CaracPNum( )

Funes especiais que no retornam valores pra variveis s com os PERIFRICO (MONITOR)
Escreva( )   ==> Escreve na tela do monitor do computador fica na linha
Escreval( )  ==> Escreve na tela do monitor do computador mas pulando um linha.

MudaCor( ) ==> Muda a cor dos caracteres(letras) e do fundo (tela)
Mudacor(Cor, posio)
Cores =>   Entre "aspas": Amarelo, Branco, Preto, Azul, Verde, Vermelho
Posio=> Entre "aspas" tambm: FRENTE, FUNDOS

Extras (ainda no criadas)
*Posicionar
*Tecla
*Etrim
*Dtrim
*Esquerda
*Direita
*Replicar

Comandos do Visualg 3.0 (pseudo-linguagem em portugol)
Limpatela  ==> Limpa a tela do monitor do computador
Pausa
Arquivo

Desvios multiplos condicionais : s use variveis e controles do tipo caracter
Escolha  xvar(caracter)
Caso "texto"
Outrocaso
Fimescolha (FIMESCOLHA)

Desvios simples e compostos
Se (condio) ento
     comandos
seno
     comandos
FimSe

SE Entao Ento (ENTO)
Senao, Seno (SENO)
FimSe

Controle de Laos sequenciais e finitos
PARA varivel(inteira) DE inicio AT fim FAA
     comandos
FIMPARA

Para De (DE) Ate (ATE) At (AT) Passo Faca (FACA) Faa (FAA)
FimPara (FIMPARA)

Controle de Laos sequenciais e infinitos
Enquanto condio FAA
        comandos
FimEnquanto

Enquanto (ENQUANTO)
FimEnquanto (FIMENQUANTO)

Repita
Fimrepita (FIMREPITA)

Interrompa
Retorne
Pausa

Operadores lgicos
e (E)
ou (OU)
Nao
No (NO)
Xou (XOU)

Declarao de UDFs (FUNES DEFINIDAS PELOS USURIOS)
Funcao
Funo (FUNO)
Fimfuncao (FIMFUNO)
Mensagem
Procedimento (PROCEDIMENTO)
Fimprocedimento (FIMPROCEDIMENTO)

Palavras reservadas Especiais
===================================
Algoritmo     --> Comeo de todos os algoritmos
var              --> declarao dos tipos das variveis
Inicio           --> inicio do programa(Algoritmo) ou funo ou procedimento
FimAlgoritmo --> termino do algoritmo e fim do programa
=========================================
Cronometro
Timer
On
Off
Eco (ECO)
Aleatorio (ALEATRIO)
Perfil
Dos (DOS)
Debug (DEBUG)
Tipo (TIPO)
var (VAR)
const (CONST)

======================================
Declarao de constantes padro
const (CONST)
Lista
Pi (PI)

================================================
Declaradores de Variveis no cabealho do programa (rea de declaraes)
Var (VAR)
Varivel  (VARIVEL)
Variavel  (VARIAVEL)

 eu sei, estou montando ainda, mas me falta tempo!
Dentro do VISUALG 3.0 tem uma CTRL+J mas acho que tambm est incompleta,  que so tantas coisas, que eu estou ainda me organizando.
A maioria deles esto dentro do HELP.CHM


A relao dos comandos, funes, variveis, constantes e dados  :

Funes pr definidas no visualg 3.0 (pseudo-linguagem em portugol)
Abs( )
Log
Div
Tan(
Sen
Cos
Rand
Randi
Quad
Exp
Pot
Cotan
ArcCos
ArcSen
Raizq

Mod ==> usado para achar o mdulo de um nmero em comparaes (o mesmo que ' % ' )
------------------------------------------- teclado ------------------------------------------------------
Leia( varivel_nome ) ==> L do teclado e coloca em uma varivel 'varivel_nome'
--------------------------------------------------------------------------------------------------------------
Funes especiais de converses
Pos
Asc( )
Carac( )
Copia ( )
Int
Compr (
Maiusc
Minusc
NumPCarac
CaracPNum

Funes especiais que no retornam valores pra variveis s com os PERIFRICO (MONITOR)
Escreva( )   ==> Escreve na tela do monitor do computador
Escreval( )  ==> Escreve na tela do monitor do computador mas pulando um linha.
MudaCor( ) Mudacor(Cor, posio) Cores =>   Entre "aspas": Amarelo, Branco, Preto, Azul, Verde, Vermelho
                                                   Posio=> Entre "aspas" tambm: FRENTE, FUNDOS


Extras (ainda no criadas)
*Posicionar
*Tecla
*Etrim
*Dtrim
*Esquerda
*Direita
*Replicar

Comandos do Visualg 3.0 (pseudo-linguagem em portugol)
Limpatela  ==> Limpa a tela do monitor do computador
Pausa
Arquivo

Escolha de
Caso

Outrocaso
Fimescolha (FIMESCOLHA)

Se Entao Ento (ENTO)
Senao, Seno (SENO)
FimSe

Para De (DE) Ate (ATE) At (AT) Passo Faca (FACA) Faa (FAA)
FimPara (FIMPARA)


Enquanto
FimEnquanto (FIMENQUANTO)

Repita
Fimrepita (FIMREPITA)

Interrompa
Retorne

Pausa

Operadores lgicos
e (E)
ou (OU)
Nao
No (NO)
Xou (XOU)

Declarao de UDFs (FUNES DEFINIDAS PELOS USURIOS)
Funcao
Funo (FUNO)
Fimfuncao (FIMFUNO)
Mensagem
Procedimento (PROCEDIMENTO)
Fimprocedimento (FIMPROCEDIMENTO)


Palavras reservadas Especiais
===================================
Algoritmo     --> Comeo de todos os algoritmos
var              --> declarao dos tipos das variveis
Inicio           --> inicio do programa(Algoritmo) ou funo ou procedimento
FimAlgoritmo --> termino do algoritmo e fim do programa
=========================================
Cronometro
Timer
On
Off
Eco (ECO)
Aleatorio (ALEATRIO)
Perfil
Dos (DOS)
Debug (DEBUG)
Tipo (TIPO)
var (VAR)
const (CONST)

======================================
Declarao de constantes padro
const (CONST)
Lista
Pi (PI)

================================================
Declaradores de Variveis no cabealho do programa (rea de declaraes)
Var (VAR)
Varivel  (VARIVEL)
Variavel  (VARIAVEL)
