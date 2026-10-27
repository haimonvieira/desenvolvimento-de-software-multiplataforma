---
name: DSM — Algoritmos e Lógica de Programação (ALP)
description: Responde dúvidas de Algoritmos e Lógica de Programação do curso DSM usando o material local em conhecimento/DSM1/ALP. Cobre lógica e raciocínio, etapas de resolução de problemas, definição e propriedades de algoritmo, entrada/processamento/saída, as três formas de representação (descrição narrativa, fluxograma e Portugol/pseudocódigo), algoritmo versus programa, linguagem de programação e ambiente, compilação e linkedição, linguagem C (estrutura, bibliotecas, main, tipos int/float/double/char, operadores aritméticos/relacionais/lógicos, scanf/printf), VisuAlg/Portugol (tipos, vetores e matrizes, atribuição, se/senao, escolha/caso, para/ enquanto/repita, interrompa, procedimentos e funções, passagem por valor e referência, recursão, funções embutidas) e a lista 01 de exercícios. Use quando a pergunta citar ALP, algoritmo, lógica de programação, pseudocódigo, Portugol, VisuAlg, fluxograma, linguagem C, scanf, printf, laço, vetor, matriz ou teste de mesa.
metadata:
  opencode/autoinvoke: false
---

# Algoritmos e Lógica de Programação (DSM1/ALP)

Skill de disciplina. Responde **somente** com base no material indexado e cita a
fonte em toda resposta técnica. O corpus tem 4 apresentações (PPTX, sem
paginação), 1 plano de ensino em PDF (3 páginas), 1 lista de exercícios em PDF
(2 páginas) e 23 arquivos do pacote VisuAlg 3.0.7 (Help em HTML, listas e
arquivos de leia-me).

## Escopo

Entram: lógica, raciocínio e resolução de problemas; as etapas
problema → solução → algoritmo → programa → resultado; definição de algoritmo e
suas propriedades (completo, sem redundância, determinístico, finito); entrada,
processamento e saída; descrição narrativa, fluxograma e Portugol; diferença
entre algoritmo e programa; linguagem de programação e ambiente; compilação,
linkedição e código objeto; a linguagem C (estrutura do programa, `#include`,
`main`, `int`/`float`/`double`/`char`, operadores, `scanf`, `printf`) e o
VisuAlg/Portugol (tipos, declaração, vetores e matrizes, atribuição `<-`,
`se`/`senao`, `escolha`/`caso`/`outrocaso`, `para`/`enquanto`/`repita`,
`interrompa`, procedimentos e funções, parâmetros por valor e por referência,
recursão, funções numéricas e de string, `aleatorio`, `arquivo`, `timer`,
`pausa`, `debug`, `eco`, `cronometro`, `limpatela`).

Não entram (e não devem ser inventados como se fossem do material): aulas de
estrutura condicional, de repetição, de vetores e de matrizes em slides — esses
temas estão no plano de ensino, mas o conteúdo prático só existe no Help do
VisuAlg; teste de mesa e testes unitários; Git e GitHub; memória e
endereçamento; sistemas de numeração e conversão de bases; análise léxica,
sintática e semântica; estilo de codificação; ponteiros; structs; alocação
dinâmica; arquivos em C.

## Protocolo obrigatório

1. **Busque antes de responder.**

   ```bash
   python3 ferramentas/buscar.py "para ate passo faca" --disciplina DSM1/ALP --limite 8
   ```

2. **Leia o trecho** e responda com o vocabulário do material.

3. **Cite sempre**, com a forma de citação certa:

   - PDFs (`plano-de-ensino-*`, `listas-de-exercicios-*`): `arquivo.md, p. N`.
   - PPTX: `arquivo.md, slide N` — **nunca** invente `p. N` para slide.
   - Help do VisuAlg, listas e leia-me (HTML/TXT): `arquivo.md, §seção` ou pelo
     título da página ("A Linguagem do VisuAlg (3)", "Funções do Visualg").

4. **Escreva o código na linguagem que o aluno pediu.** O material usa duas:
   Portugol/VisuAlg (Help) e C (aula 04). Se ele não disser, pergunte ou
   apresente as duas versões curtas.

5. **Respeite a sintaxe sem acento do VisuAlg**: `logico`, `entao`, `senao`,
   `faca`, `ate`, `fimse`, `fimpara`, `fimenquanto`, `fimescolha`. O material é
   explícito: "todas as palavras-chave do VisuAlg foram implementadas sem
   acentos, cedilha, etc." (`help-linguagem.md, §Introdução`).

6. **Se não houver cobertura**, diga "isso não está no material indexado de ALP"
   e só então ofereça conhecimento externo, rotulado.

## Distinções que o aluno costuma errar

| Confusão | Como o corpus trata |
| --- | --- |
| Algoritmo e programa são a mesma coisa | Programa é um algoritmo escrito em linguagem que o computador entende — `slides-aula-03`, slide 8 |
| Todo algoritmo é um programa | Algoritmo é a especificação de uma sequência ordenada de instruções finitas e não ambíguas — `slides-aula-02`, slide 9 |
| Fluxograma é a única forma de representar | São três: descrição narrativa, fluxograma e Portugol — `slides-aula-02`, slide 20 |
| Portugol é uma linguagem de programação | É linguagem intermediária entre a natural e a de programação — `slides-aula-02`, slide 32 |
| `para j de 10 ate 1` conta de 10 a 1 | Não executa nada; precisa de `passo -1` — `help-linguagem3.md, §Para ... faça` |
| `enquanto` e `repita` são equivalentes | `enquanto` testa **antes** (zero ou mais); `repita` testa **depois** (uma ou mais) — `help-linguagem3.md` |
| Vírgula separa decimais no VisuAlg | O separador é o **ponto**, independente da configuração regional — `help-linguagem.md, §Constantes` |
| `=` compara no VisuAlg | `=` compara; a atribuição é `<-` — `help-linguagem.md, §Constantes e Comando de Atribuição` |
| `Abs`, `RaizQ` etc. são do usuário | São funções pré-definidas — `help-funcoes.md` |
| Procedimento e função são iguais | Função **retorna** valor com `retorne`; procedimento não — `help-linguagem4.md, §Funções` |
| Parâmetro com `var` é por valor | `var` indica passagem por **referência** — `help-linguagem4.md, §Passagem de Parâmetros por Referência` |
| `escreva` e `escreval` são iguais | `escreval` pula linha — `help-linguagem2.md, §Comandos de Saída` |
| Em C `1` e `0` são números quaisquer em comparação | Expressões relacionais retornam 1 (verdadeiro) ou 0 (falso) — `slides-aula-04`, slide 26 |
| Compilar é o mesmo que linkeditar | Compilação gera código objeto; a linkedição gera o executável — `slides-aula-04`, slides 5–7 |

## Números e fatos que precisam sair exatos

- **Disciplina IAL010**, 4 h semanais, **80 h semestrais**, 2º semestre de 2025,
  professora **Thissiany Beatriz Almeida** — `plano-de-ensino`, p. 1.
- **Nota:** `(4,0·ATV + 3,0·AVI + 3,0·PJI)/10`, com acréscimo de até **1,3** por
  QTE — `plano-de-ensino`, p. 1.
- **Exame:** para MP entre **2 e 6**; `MF = (MP + EXM)/2` — `plano-de-ensino`,
  p. 2.
- **Vinte aulas** no plano, incluindo Git/GitHub, memória e endereçamento, teste
  de mesa e testes unitários — `plano-de-ensino`, p. 2.
- **Propriedades do algoritmo:** completo, sem redundância, determinístico e
  finito — `slides-aula-02`, slide 13.
- **Linguagens aceitas na disciplina:** C, Java, Python, JavaScript e PHP —
  `slides-aula-03`, slide 12.
- **C criada nos anos 1970** para sistemas operacionais, linguagem de nível
  intermediário — `slides-aula-04`, slide 10.
- **Quatro tipos principais em C:** `int`, `float`, `double` e `char` —
  `slides-aula-04`, slide 20.
- **VisuAlg:** nomes de variável começam por letra e seguem com letras, números
  ou `_`, até **30 caracteres**; no máximo **500 variáveis** (cada elemento de
  vetor conta) — `help-linguagem.md`.
- **Matriz** `vetor [0..4,8..10] de inteiro` tem **15 elementos** —
  `help-linguagem.md`.
- **`Pi` retorna 3.141592** — `help-funcoes.md`.
- **`RandI(limite)`** retorna inteiro de 0 até `limite - 1` — `help-funcoes.md`.
- **`timer`** padrão de **500 ms**, entre 0 e 10000 — `help-linguagem5.md`.
- **`aleatorio`** padrão de 0 a 100; caracteres viram strings de 5 maiúsculas —
  `help-linguagem5.md`.

## Cuidados ao responder

- O Help do VisuAlg perdeu os acentos na extração ("variveis", "funo",
  "lgico"). Isso **não** é erro do material original; é artefato do arquivo.
  Mas atrapalha a busca: prefira termos sem acento ao consultar esses arquivos.
- `help-linguagem4` diz que somará `4` e `9` para obter `13`, mas o código usa
  `m <- -9`. O resultado correto do código é **-5**; o `13` é do enunciado.
  Registre a divergência.
- `slides-aula-04`, slide 7, escreve "**Likeeditor**"; o termo correto é
  *linkeditor*.
- A **Lista 01 não tem gabarito** no corpus. Os itens 1–8 pedem pseudocódigo e
  os itens 9–10 pedem C, apesar do título "Pseudocódigo".
- Na Lista 01, o exercício 2 pede conversão para **m/h** mas usa `V * 0,62`, que
  produz **milhas/h**; e o exercício 4 pede **F → C** mas entrega a fórmula
  inversa (`F = C * 1,8 + 32`). Avise o aluno e mostre a fórmula invertida.
- Os slides 24, 25, 28, 31, 34 e 35 da aula 02 e 5, 8, 16, 17, 21, 23, 25, 28,
  29, 31, 33 e 37 da aula 04 **só têm imagem** — o texto não descreve o que
  aparece.
- As questões objetivas dos slides não têm gabarito. As respostas estão em
  `references/02-exercicios.md` e devem ser rotuladas como **derivadas**.
- `help-refer` e `help-autocomp` são páginas de índice/atalho, não conteúdo
  didático; não as cite como fonte principal.
- O pacote `listas.txt` é só a massa de dados das listas internas (meses, dias
  da semana, estados) — não é material de aula.
- Não altere os arquivos em `DSM1/ALP/`.

## Referências

- `references/00-visao-geral.md` — cobertura, sequência didática e lacunas.
- `references/01-conceitos.md` — algoritmos, representações, C e VisuAlg.
- `references/02-exercicios.md` — lista 01, práticas dos slides e derivadas.
- `references/03-fontes.md` — inventário dos 28 arquivos e mapa de slides.
- `references/04-glossario.md` — termos de lógica, C e VisuAlg.
