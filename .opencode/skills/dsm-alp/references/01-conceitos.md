# Conceitos consolidados — ALP

> Slides são citados por `slide N`; o plano de ensino e a lista, por `p. N`; o
> Help do VisuAlg, por `§seção`. Nenhuma página de slide foi inventada.

## 1. Lógica e resolução de problemas

### Lógica

O uso corriqueiro da palavra lógica está ligado a **coerência e racionalidade**.
A lógica estuda "quais operações são válidas e quais não são", analisando as
formas e leis do pensamento — `slides-aula-01`, slide 4.

Um argumento tem **duas premissas e uma conclusão**; o objetivo da lógica é
verificar sua validade — slide 6. Exemplos do slide 5:

- Todo mamífero é um animal; todo cavalo é um mamífero; logo, todo cavalo é um
  animal (válido).
- Lux é país do planeta Marte; todos os Ets são de Lux; logo, todos os Ets são
  marcianos (válido).

### Raciocínio

É um **processo lógico** com ideia concreta, desenvolvimento e conclusão — slide
10. A lógica serve para solucionar problemas, obter eficiência e eficácia e ter
boa performance de conhecimento — slide 11.

### Lógica de Programação

"O uso correto das leis do pensamento, da ordem da razão e de processos de
raciocínio e simbolização formais na programação de computadores" — slide 13.

### As cinco etapas

```
Problema → Solução → Algoritmo → Programa → Resultado/Teste
```

Fonte: `slides-aula-01`, slide 14.

| Etapa | O que exige |
| --- | --- |
| **Problema** | Conhecer todos os aspectos, responder a todas as perguntas, considerar todas as situações |
| **Solução** | Existir, ter custo de implementação e de execução, e forma de representação |
| **Algoritmo** | Conjunto finito de regras bem definidas, com número finito de passos |
| **Programa** | Escrito em linguagem de programação a partir do algoritmo |
| **Resultado** | Executar, processar e apresentar a saída |

Fonte: `slides-aula-01`, slides 15–20.

"Um programa escrito em uma linguagem de programação é chamado de **programa
fonte**" — slide 19.

## 2. Algoritmo

### Definição

"Um algoritmo é a especificação de uma sequência ordenada de instruções,
finitas e não-ambíguas, que deve ser seguida para a solução de um determinado
problema, garantindo sua repetibilidade" — `slides-aula-02`, slide 9.

Definição alternativa: "procedimento composto por uma sequência de instruções
precisas, que a partir de uma entrada produz uma saída" — `slides-aula-03`,
slide 4.

### Propriedades essenciais

| Propriedade | Exigência |
| --- | --- |
| **Completo** | Todas as ações descritas e únicas |
| **Sem redundância** | Uma única forma de interpretar |
| **Determinístico** | O resultado esperado é sempre atingido |
| **Finito** | Termina após um número limitado de passos |

Fonte: `slides-aula-02`, slide 13.

### Entrada, processamento e saída

1. **Entrada** — informações necessárias para executar.
2. **Processamento** — operações sobre os dados, avaliando as expressões.
3. **Saída** — resultado enviado a um ou mais dispositivos.

Fonte: `slides-aula-02`, slide 15. O exemplo condutor é a omelete (slides 16–17)
e a banca de revistas (slides 18–19).

## 3. As três formas de representação

Fonte: `slides-aula-02`, slide 20.

### Descrição narrativa

Escrita em **linguagem natural**. Vantagem: simplicidade. Desvantagem: "uma
palavra pode ter muitos significados", gerando ambiguidade e imprecisão —
slides 22–23.

### Fluxograma

Também chamado de **Diagrama de Fluxo** ou **Diagrama de Bloco**. Usa formas
geométricas padronizadas ligadas por setas — slides 26–27. Desvantagens: dados
podem não ser detalhados o bastante, é preciso aprender a simbologia e o
diagrama fica complicado em algoritmos extensos — slide 29.

### Portugol

"Português Estruturado, também conhecido como Portugol, Pseudocódigo ou
Pseudolinguagem" — slide 32. É a **linguagem intermediária** entre a natural e a
de programação. Na disciplina, a ferramenta usada é o **VisuAlg** — slide 33.
Desvantagem: não há padronização na literatura, então o mesmo termo aparece de
formas diferentes — slide 36.

## 4. Programa, linguagem e ambiente

- "Um programa é um algoritmo escrito em uma linguagem que um computador
  entende" — `slides-aula-03`, slide 8.
- "O mais importante na resolução de um problema é encontrar um algoritmo
  correto e eficiente"; a tradução para a linguagem é só uma ferramenta —
  slide 8.
- Linguagem de programação define **comandos** e **regras de construção** —
  slide 10.
- Linguagens aceitas na disciplina: **C, Java, Python, JavaScript e PHP** —
  slide 12.
- **Ambiente de programação** é o slide 14, mas o conteúdo é só imagem.

## 5. Compilação e linkedição

Um programa fonte não é entendido pelo computador; é preciso convertê-lo em
binário. A **geração do programa executável** tem duas fases: **compilação** e
**linkedição** — `slides-aula-04`, slide 5.

| Ferramenta | O que faz |
| --- | --- |
| **Compilador** | Compila e gera o **código objeto** |
| **Linkeditor** *(escrito "Likeeditor" no slide)* | Gera o executável a partir do código objeto |

Fonte: `slides-aula-04`, slide 7.

## 6. Linguagem C

### Características

Criada nos **anos 1970** para sistemas operacionais, muito usada em sistemas
embarcados. É **nível intermediário**: combina elementos de alto nível com
funcionalismo de máquina. Dá controle exato do comportamento e acesso direto a
partes do hardware. Características principais: **portabilidade** e
**simplicidade** — `slides-aula-04`, slides 10–11.

### Estrutura

```c
#include <stdio.h>      // importação das bibliotecas
#include <math.h>

int main() {            // declaração da função main
    // comandos
    return 0;
}
```

Fonte: `slides-aula-04`, slide 13. `#include` inclui uma biblioteca com funções
pré-definidas — slide 15. A `main` é o **ponto de partida**; o controle volta a
ela quando a função chamada termina ou encontra `return` — slide 18.

### Tipos e declaração

Quatro tipos principais: **`int`, `float`, `double` e `char`**. Nomes de
variável usam apenas **letras, dígitos e `_`**, e a linguagem **diferencia
maiúsculas de minúsculas** — `slides-aula-04`, slide 20.

### Operadores

| Grupo | Conteúdo | Onde |
| --- | --- | --- |
| Matemáticos | `+ - * / %` | slide 23 |
| Atribuição | `=` (constante, variável ou expressão) | slide 24 |
| Relacionais | retornam **1** (verdadeiro) ou **0** (falso) | slide 26 |
| Lógicos | `&&` (e), `\|\|` (ou), `!` (não) | slide 27 |

`&&` só é verdadeiro se **ambos** os operandos forem verdadeiros; `||` é
verdadeiro se **um ou ambos** forem; `!` é unário e inverte — slide 27.

### Entrada e saída

- `scanf()` lê e armazena dados de entrada — slide 30.
- `printf()` apresenta o resultado, em texto puro ou com o conteúdo de uma
  variável — slide 32.

## 7. VisuAlg / Portugol

### Formato básico

```
algoritmo "semnome"

// Seção de Declarações
var
   x: inteiro

inicio
   // Seção de Comandos
fimalgoritmo
```

- `algoritmo` + nome entre **aspas duplas**.
- `inicio` encerra as declarações e começa os comandos.
- `fimalgoritmo` encerra; o que vem depois é ignorado.
- Comentários: `//` até o fim da linha (não há comentário de várias linhas).

Fonte: `help-linguagem.md, §Formato Básico`.

### Regras da linguagem

- **Um comando por linha**; não há `;` separador nem blocos `begin/end`.
- Não há `goto`.
- Palavras-chave **sem acento**: `logico`, `entao`, `senao`.
- **Não diferencia** maiúsculas de minúsculas em palavras-chave e nomes.

Fonte: `help-linguagem.md, §Introdução`.

### Tipos

| Palavra-chave | Tipo |
| --- | --- |
| `inteiro` | Numérico sem casas decimais |
| `real` | Numérico com casas decimais |
| `caractere` | Cadeia de caracteres (*string*) |
| `logico` | Booleano: `VERDADEIRO` ou `FALSO` |

Fonte: `help-linguagem.md, §Tipos de Dados`.

### Declaração de variáveis e vetores

```
var a: inteiro
    Valor1, Valor2: real
    vet: vetor [1..10] de real
    matriz: vetor [0..4,8..10] de inteiro
    nome_do_aluno: caractere
    sinalizador: logico
```

- Nomes: começam por letra, seguem com letras, números ou `_`, até **30**
  caracteres.
- `vet` tem **10 elementos**, índices de `[1]` a `[10]`.
- `matriz` tem **15 elementos**: `[0,8]` … `[4,10]`.
- Limite de **500 variáveis** no total (cada elemento conta).
- Não precisa de `;`; basta pular linha.

Fonte: `help-linguagem.md, §Nomes de Variáveis`.

### Constantes e atribuição

- Numéricas usam **ponto** como separador decimal e **não** aceitam separador de
  milhares.
- Caracteres entre **aspas duplas**.
- Lógicas: `VERDADEIRO` / `FALSO`.
- Atribuição: `<-`.

```
a <- 3
Valor1 <- 1.5
Valor2 <- Valor1 + a
vet[1] <- vet[1] + (a * 3)
matriz[3,9] <- a/4 - 5
nome_do_aluno <- "José da Silva"
sinalizador <- FALSO
```

Fonte: `help-linguagem.md, §Constantes e Comando de Atribuição`.

### Operadores

| Operador | Efeito | Observação |
| --- | --- | --- |
| `+ -` | Unários | Maior precedência |
| `\` | Divisão inteira | `5 \ 2 = 2` |
| `+ - * /` | Aritméticos | `*` e `/` antes de `+` e `-` |
| `MOD` ou `%` | Resto | `8 MOD 3 = 2` |
| `^` | Potenciação | `5 ^ 2 = 25`, maior precedência binária |
| `+` | Concatenação | Só com dois `caractere` |
| `= < > <= >= <>` | Relacionais | `<>` é "diferente" |
| `nao` | Negação | Equivale a `NOT` |
| `ou` | Disjunção | Equivale a `OR` |
| `e` | Conjunção | Equivale a `AND` |
| `xou` | Ou exclusivo | Equivale a `XOR` |

Fonte: `help-linguagem2.md, §Operadores`.

Detalhes: comparações entre strings **não diferenciam** maiúsculas; a ordem
lógica é `FALSO < VERDADEIRO` — `help-linguagem2.md`.

### Saída

```
escreva (lista-de-expressões)
escreval (lista-de-expressões)   // pula linha
```

Formatação: `escreva(x:5)` usa 5 espaços alinhados à direita; `escreva(y:6:2)`
usa 6 espaços e 2 casas decimais — `help-linguagem2.md, §Comandos de Saída`.

O VisuAlg separa expressões numéricas e lógicas com um espaço à esquerda, mas
**não** as de caractere (para permitir concatenação) — mesma seção.

### Entrada

```
leia (lista-de-variáveis)
```

Mostra a janela com a mensagem "Entre com o valor de <nome-da-variável>".
`Esc` ou **Cancelar** interrompe o programa — `help-linguagem2.md, §Comando de
Entrada`.

### Condicional

```
se <expressão-lógica> entao
   <comandos>
fimse

se <expressão-lógica> entao
   <comandos-1>
senao
   <comandos-2>
fimse
```

Não há delimitadores de bloco; `senao` e `fimse` delimitam. Permite aninhamento
— `help-linguagem2.md, §Comando de Desvio Condicional`.

### Seleção múltipla

```
escolha <expressão>
caso <exp11>, <exp12>
   <comandos-1>
caso <exp21>
   <comandos-2>
outrocaso
   <comandos-extra>
fimescolha
```

Fonte: `help-linguagem2.md, §Comando de Seleção Múltipla`. O exemplo do material
classifica times cariocas, paulistas e "de outro estado".

### Repetição

```
para j de 1 ate 10 faca
   escreva (j:3)
fimpara
```

- Contador deve ser **inteiro**; início, limite e passo também.
- `passo` é opcional e pode ser **negativo**.
- As três expressões são avaliadas **uma única vez**, antes do laço.
- Se o início já for maior que o limite (sem passo negativo), o laço **não
  executa**.

Fonte: `help-linguagem3.md, §Para ... faça`.

```
enquanto j <= 10 faca
   escreva (j:3)
   j <- j + 1
fimenquanto
```

Testa **antes**: executa **zero ou mais** vezes — `§Enquanto ... faça`.

```
repita
   escreva (j:3)
   j <- j + 1
ate j > 10
```

Testa **depois**: executa **uma ou mais** vezes — `§Repita ... até`.

`interrompa` causa saída imediata do laço. Existe a forma alternativa
`repita ... fimrepita`, em que `interrompa` é **obrigatório** — `§Comando
Interrompa`.

### Subprogramas

- **Procedimento**: não retorna valor.
- **Função**: retorna valor com `retorne`; a chamada aparece como expressão.
- Declarados **entre as declarações de variáveis e o `inicio`** do programa.
- Parâmetros separados por `;`; `var` antes do parâmetro indica **referência**.
- Variáveis **globais** e **locais**.
- VisuAlg permite **recursão**, mas **não** permite aninhar subprogramas.

Fonte: `help-linguagem4.md`.

```
procedimento soma (x,y: inteiro; var result: inteiro)
inicio
   result <- x + y
fimprocedimento

funcao fatorial (v: inteiro): inteiro
inicio
   se v <= 2 entao
      retorne v
   senao
      retorne v * fatorial(v-1)
   fimse
fimfuncao
```

### Funções embutidas

| Grupo | Funções |
| --- | --- |
| Numéricas | `Abs`, `Exp`, `Int`, `Log` (base 10), `LogN` (base e), `Pi`, `Quad`, `RaizQ` |
| Trigonométricas | `Sen`, `Cos`, `Tan`, `CoTan`, `ArcSen`, `ArcCos`, `ArcTan`, `GraupRad`, `RadpGrau` |
| Aleatórias | `Rand`, `RandI` |
| Strings | `Asc`, `Carac`, `Caracpnum`, `Compr`, `Copia`, `Maiusc`, `Minusc`, `Numpcarac`, `Pos` |

Fonte: `help-funcoes.md`. Exemplos do material: `pos("Brasil", "O melhor do
Brasil")` = **13**; `asc("Brasil")` = **66** (código de "B"); `compr("Brasil")`
= **6**.

### Comandos de apoio

| Comando | Efeito |
| --- | --- |
| `aleatorio [on]` / `aleatorio a,b` / `aleatorio off` | Substitui a digitação por valores aleatórios |
| `arquivo "nome.txt"` | Lê dados de arquivo-texto |
| `timer on` / `timer 500` / `timer off` | Execução em câmera lenta |
| `pausa` | Interrupção incondicional |
| `debug <expressão>` | Breakpoint condicional |
| `eco on` / `eco off` | Imprime os dados de entrada |
| `cronometro on` / `off` | Mede tempo em milissegundos |
| `limpatela` | Limpa a tela do VisuAlg |

Fonte: `help-linguagem5.md`.
