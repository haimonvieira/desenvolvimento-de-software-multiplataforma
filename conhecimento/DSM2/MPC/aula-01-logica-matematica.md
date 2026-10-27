---
disciplina: DSM2/MPC
titulo: AULA 01   LÓGICA MATEMÁTICA
fonte: DSM2/MPC/AULA 01 - LÓGICA MATEMÁTICA.pptx
tipo: pptx
paginas: 0
extraido_em: 2026-10-24
---

## Slide 1

MATEMÁTICA PARA COMPUTAÇÃO
APRESENTAÇÃO DA DISCIPLINA

**Notas do slide 1:** 40

## Slide 2

ROTEIRO
ARGUMENTO LÓGICO
LÓGICA MATEMÁTICA
PROPOSIÇÕES E CONECTIVOS
TABELA-VERDADE
ORDEM DE PRECEDÊNCIA
TAUTOLOGIA

## Slide 3

ARGUMENTO LÓGICO

## Slide 4

ARGUMENTO LÓGICO
É a afirmação de que um grupo de proposições iniciais resulta em uma proposição final, consequência das primeiras. As proposições iniciais são as PREMISSAS e a final é a CONCLUSÃO.
P1: Todo adolescente joga vídeo game.
P2: Todo jogo é divertido.
C: Todo adolescente se diverte.
P1: Todos os jogos são caros.
P2: Mário é um jogo.
C: Mário é caro.
P1: Todo músico é inteligente.
P2: Fulano é músico.
C: Fulano é inteligente.

## Slide 5

SILOGISMO
Um argumento é válido quando sua conclusão é consequência obrigatória de suas premissas. Não leva em conta a realidade dos fatos.
P1: Todos os homens são peixes
P2: Nenhum peixe é animal
C: Nenhum homem é animal

## Slide 6

FALÁCIA
Um argumento é inválido quando a verdade das premissas não é suficiente para garantir a verdade da conclusão.
P1: Toda criança gosta de doce.
P2: Fulano não é criança
C: Portanto, Fulano não gosta de doce.

## Slide 7

LÓGICA MATEMÁTICA

## Slide 8

LÓGICA MATEMÁTICA
É o ramo da matemática que estuda o raciocínio válido por meio de sistemas formais — isto é, linguagens simbólicas com regras precisas de significado (semântica) e de demonstração (provas).
Ela busca separar a forma do argumento do seu conteúdo, para decidir quando uma conclusão decorre necessariamente das premissas.

## Slide 9

LÓGICA MATEMÁTICA
A princípio, a Lógica era ligada a filosofia, que se baseava na teoria do silogismo, ou seja, em argumentações válidas.
Ela passou a ser uma área da Matemática, a partir dos trabalhos de Boole e Morgan, quando eles apresentaram os fundamentos da Lógica Algébrica.

## Slide 10

LÓGICA MATEMÁTICA
A Lógica Matemática analisa determinada proposição buscando identificar se representa uma afirmação como VERDADEIRA ou FALSA. É uma importante ferramenta para a programação de computadores.

## Slide 11

PROPOSIÇÕES

## Slide 12

PROPOSIÇÕES
As proposições são palavras ou símbolos que expressam um pensamento com um sentido completo e indicam afirmações de fatos ou de ideias.
Essas afirmações assumem valores lógicos que podem ser verdadeiros ou falsos e para representar uma proposição usualmente utilizamos as letras p e q.

## Slide 13

PROPOSIÇÕES
São exemplos de proposições:
A cidade de Registro está localizada no Estado de São Paulo. (PROPOSIÇÃO VERDADEIRA)
A Terra é um dos planetas do sistema solar. (PROPOSIÇÃO VERDADEIRA)
O resultado da operação 1+1 é 3. (PROPOSIÇÃO FALSA)
A FATEC de Registro é uma instituição de Ensino Superior. (PROPOSIÇÃO VERDADEIRA)

## Slide 14

PROPOSIÇÕES
Uma proposição não pode ser ao mesmo tempo VERDADEIRA e FALSA. Além disso, não existe a possibilidade de uma terceira situação diferente de VERDADEIRO ou FALSO.
As proposições podem ser simples, quando apresentam apenas uma sentença, e compostas quando são formadas pela combinação de duas ou mais proposições simples.

## Slide 15

PROPOSIÇÕES
Exemplos:
O céu é azul. (PROPOSIÇÃO SIMPLES)
As nuvens são brancas. (PROPOSIÇÃO SIMPLES)
O céu é azul e as nuvens são brancas. (PROPOSIÇÃO COMPOSTA)
Toda baleia é um mamífero. (PROPOSIÇÃO SIMPLES)
Toda baleia é um mamífero e tem pulmões. (PROPOSIÇÃO COMPOSTA)

## Slide 16

CONECTIVOS

## Slide 17

CONECTIVOS
As proposições simples que formam uma proposição composta são ligadas por CONECTIVOS. Além disso, podemos utilizar conectivos para modificar uma proposição.
Na proposição “O céu é azul e as nuvens são brancas”, o elemento e é um conectivo que une duas proposições, já na proposição “O céu não é azul” o conectivo não modifica a proposição.

## Slide 18

CONECTIVOS
Os conectivos da lógica são:
NOT (NÃO) também representado por !, ~ ou ⌐
AND (E) também representado por &&, ^ ou &
OR (OU) também representado por || ou v
XOR (OU EXCLUSIVO)
-> (ENTÃO)
<-> (SE E SOMENTE SE)

## Slide 19

CONECTIVOS
Com mais de uma proposição podemos usar os conectivos e formar:
CONJUNÇÃO: p AND q
DISJUNÇÃO: p OR q
DISJUNÇÃO EXCLUSIVA: p XOR q
CONDICIONAIS: p -> q
BICONDICIONAIS: p <-> q

## Slide 20

TABELA-VERDADE

## Slide 21

TABELA-VERDADE
Quando temos proposições compostas, os valores lógicos resultantes dependem única e exclusivamente dos valores de cada proposição simples.
Diante disso, utilizamos um dispositivo chamado tabela-verdade, onde são colocados os valores de cada proposição composta, sendo que em cada coluna é colocada uma proposição.

## Slide 22

TABELA-VERDADE

## Slide 23

OPERAÇÕES LÓGICAS

## Slide 24

OPERAÇÕES LÓGICAS
As operações feitas a partir de proposições são chamadas de operações lógicas. Este tipo de operação segue as regras do chamado cálculo proposicional.
As operações lógicas fundamentais: negação, conjunção, disjunção, disjunção exclusiva, condicional e bi condicional.

## Slide 25

NEGAÇÃO
Esta operação representa o valor lógico oposto de uma dada proposição. Desta forma, quando uma proposição é verdadeira, a não proposição será falsa.
Com o objetivo de indicar a negação de uma proposição colocamos o símbolo de ~ na frente da letra que representa a proposição, assim, ~p significa a negação de p.

## Slide 26

NEGAÇÃO
Exemplo:
p: Maria estuda muito.
~p: Maria não estuda muito.

## Slide 27

CONJUNÇÃO
A conjunção é utilizada quando entre as proposições existe o conectivo e. Esta operação será verdadeira quando todas as proposições forem verdadeiras.
O símbolo utilizado para representar essa operação é o ^, colocado entre as proposições. Desta forma, quando temos p ^ q, significa “p e q”.

## Slide 28

CONJUNÇÃO
Exemplo:
p: Quero jogar tênis.
q: Tempo ensolarado.

## Slide 29

DISJUNÇÃO
Nesta operação, o resultado será verdadeiro quando pelo menos uma das proposições é verdadeira. Sendo assim, será falso apenas quando todas as proposições forem falsas.
A disjunção é usada quando entre as proposições existe o conectivo ou e para representar esta operação é usado o símbolo v entre as proposições, assim, p v q significa “p ou q”.

## Slide 30

DISJUNÇÃO
Exemplo: (Chance de aprovação)
p: Tirar nota acima de 6.
q: Tirar nota acima de 2.

## Slide 31

DISJUNÇÃO EXCLUSIVA
Nesta operação, o resultado será verdadeiro quando o valor da proposição p e q forem opostos. O operador utilizado será o XOR.

## Slide 32

CONDICIONAL
A condicional é a operação realizada quando na proposição utiliza-se o conectivo “se então”. Para representar esse operador usamos o símbolo ->. Assim, p -> q significa “se p, então q”.
O resultado desta operação só será falso quando a primeira proposição for verdadeira e a consequente for falsa. É importante ressaltar que uma operação condicional não significa que uma proposição é a consequência da outra.

## Slide 33

CONDICIONAL
Exemplo:
p: Está chovendo.
q: Vou levar um guarda-chuva.

## Slide 34

BICONDICIONAL
O operador bicondicional é representado pelo símbolo <-> e indica uma proposição do tipo “se e somente se”. Portanto, p <-> q significa “p se e somente se q”, ou seja, p é condição necessária e suficiente para q.
Ao usar esse operador, a sentença será verdadeira quando as proposições forem ambas verdadeiras ou ambas falsas.

## Slide 35

BICONDICIONAL
Exemplo:
p: Estudo para a prova.
q: Tiro uma boa nota.

## Slide 36

RESUMO DAS OPERAÇÕES

## Slide 37

ORDEM DE PRECEDÊNCIA
Ao montar a tabela-verdade precisamos nos atentar para a precedência dos conectivos:
Parênteses
Negações
Conjunções e disjunções na sequência
Condicionais
Bi condicionais

## Slide 38

TAUTOLOGIA E CONTRADIÇÃO

## Slide 39

TAUTOLOGIA
É toda proposição composta em cuja última coluna da sua tabela só aparece V(VERDADEIRO). Em outras palavras, independentemente do valor de p e q, R(resultado) é sempre verdade.

## Slide 40

CONTRADIÇÃO
É toda proposição cuja última coluna só tem F (falso). Em outras palavras, não importa o valor de p e q, R (resultado) é sempre FALSO.

## Slide 41

PRATIQUE

## Slide 42

PRATIQUE 01 – PARTE 1
Na ilha de Anchúria, há três tipos de pessoas: os heróis que sempre falam a verdade, os ladrões que sempre mentem e as pessoas comuns que ás vezes mentem e ás vezes falam a verdade. Certa vez, um viajante chegou a ilha e encontrou-se com três moradoras: Andressa (A), Beatriz (B) e Carolina (C), tendo escutado delas as seguintes frases:

## Slide 43

PRATIQUE 01 – PARTE 2
A: Eu sou uma pessoa comum.
B: Andressa diz a verdade.
C: Eu não sou uma pessoa comum.
Sabendo que dentre essas pessoas há uma de cada tipo, quem é o herói, quem é o ladrão e quem é a pessoa comum?

## Slide 44

PRATIQUE 02
João mente nas terças, quintas e sábados e no resto dos dias fala a verdade. Um dia, Pedro encontra João:
P: Que dia é hoje?
J: Sábado
P: Que dia será amanhã?
J: Quarta-feira.
Que dia da semana Pedro encontrou João?

## Slide 45

PRATIQUE 03
Monte a tabela verdade para as seguintes proposições:
a) p v ~(p ^ q)
b) p ^ q -> (p <-> q)
c) (p ^ q) ^ ~(p v q)
d) ~p ^ (p ^ ~q)
e) (q -> p) -> (p -> q)
f) p v (q ^ ~q) <-> p

## Slide 46

DÚVIDAS?
