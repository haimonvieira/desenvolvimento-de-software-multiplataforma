# Visão geral — ALP (DSM1/ALP)

## O que o material cobre

O corpus tem **28 arquivos**: 4 slides de aula (PPTX), 1 plano de ensino (PDF,
3 p.), 1 lista de exercícios (PDF, 2 p.) e **23 arquivos do pacote VisuAlg
3.0.7** (Help em HTML, listas de dados e textos de instalação).

| Bloco | Arquivos | Papel |
| --- | --- | --- |
| Planejamento | `plano-de-ensino-*` | Ementa, avaliação e as 20 aulas |
| Conceito | `slides-aula-01` a `slides-aula-03` | Lógica, algoritmos e linguagens |
| Linguagem C | `slides-aula-04` | Tipos, variáveis, operadores, `scanf`/`printf` |
| Exercícios | `listas-de-exercicios-lista-01-*` | 10 exercícios, sem gabarito |
| Ferramenta | `programas-visualg3-0-7-*` (23) | Help do VisuAlg, comandos e funções |

## Sequência didática que o corpus revela

| Ordem | Tema | Onde está |
| --- | --- | --- |
| 1 | Lógica, raciocínio e etapas de resolução | aula-01, slides 4–20 |
| 2 | Definição de algoritmo e propriedades | aula-02, slides 9–13 |
| 3 | Entrada, processamento e saída | aula-02, slides 15–19 |
| 4 | Descrição narrativa, fluxograma e Portugol | aula-02, slides 20–36 |
| 5 | Algoritmo, programa, linguagem e ambiente | aula-03, slides 4–14 |
| 6 | Compilação, linkedição e linguagem C | aula-04, slides 4–18 |
| 7 | Tipos, variáveis, operadores, entrada e saída em C | aula-04, slides 19–33 |
| 8 | Sintaxe do Portugol no VisuAlg | `help-linguagem` a `help-linguagem5` |
| 9 | Funções embutidas | `help-funcoes` |
| 10 | Prática | Lista 01 e práticas dos slides |

## Progressão de dificuldade

1. **Raciocínio** (aula 01): o que é lógica e como se resolve um problema.
2. **Formalização** (aula 02): transformar a solução em algoritmo e escolher a
   representação.
3. **Tradução** (aulas 03–04): passar o algoritmo para uma linguagem.
4. **Ferramenta** (Help do VisuAlg): a sintaxe exata do Portugol.
5. **Prática** (Lista 01): exercícios de estrutura sequencial.

## O que o corpus NÃO cobre

O plano de ensino lista 20 aulas, mas só as quatro primeiras viraram slides.
Ficaram de fora, sem conteúdo:

- estrutura condicional (aula 6) — só a sintaxe no Help;
- estruturas de repetição (aula 7) — só a sintaxe no Help;
- estilo de codificação (aula 8);
- memória e endereçamento (aula 12);
- vetores (aula 13) e matrizes (aula 14) — só a declaração no Help;
- teste de mesa e testes unitários (aula 15);
- Git e GitHub (aula 16);
- sistemas de numeração e conversão de bases (dentro da aula 4);
- análise léxica, sintática e semântica (dentro da aula 2);
- ponteiros, structs e alocação dinâmica;
- leitura e escrita de arquivos em C;
- gabarito de qualquer exercício.

## Como estudar por este material

1. Saiba explicar a diferença entre **algoritmo** e **programa** com as duas
   definições do corpus.
2. Decore as **quatro propriedades** do algoritmo e as **três representações**.
3. Entenda as cinco etapas: problema, solução, algoritmo, programa, resultado.
4. Em C, domine `#include`, `main`, os quatro tipos, `scanf` e `printf`.
5. Em VisuAlg, domine `algoritmo`/`inicio`/`fimalgoritmo`, `<-`, `se`, `para`,
   `enquanto`, `repita` e `escreval`.
6. Treine a diferença entre `para` com e sem `passo -1`.
7. Resolva a Lista 01 antes de olhar as derivadas.

## Limite de confiança

Os slides são bons em conceito e fracos em sintaxe; o Help do VisuAlg é ótimo em
sintaxe e não é material da Fatec (é a documentação do programa). Nenhum
exercício tem gabarito oficial. Para produção, valide a sintaxe no próprio
VisuAlg e rotule qualquer complemento como externo.
