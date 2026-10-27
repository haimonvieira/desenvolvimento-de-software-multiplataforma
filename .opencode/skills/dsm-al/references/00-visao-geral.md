# Visão geral — Álgebra Linear (DSM3/AL)

## O que o material cobre

O corpus de AL é **prático**: 9 exercícios em Python, 2 scripts de visualização,
2 arquivos de anotações (um deles repetido em `notebook-sources/`) e 1 script de
autovetores. Não há slides de aula nem livro-texto.

Os temas que aparecem:

1. **Vetores no plano:** soma e multiplicação por escalar.
2. **Transformações `T: R² → R²`:** testar linearidade pelos axiomas.
3. **Matriz de transformação 2x2:** escala, reflexão e transformação geral.
4. **Aplicação a pontos e triângulos** e desenho no plano cartesiano.
5. **Autovalores e autovetores** com `numpy.linalg.eig`.

## Sequência didática que o corpus revela

| Ordem | Tema | Onde está |
| --- | --- | --- |
| 1 | Soma de vetores e transformação | `linear.md`, primeiro bloco |
| 2 | Axioma da soma e da escala | `linear.md`; `ex03.py`; `ex09.py` |
| 3 | Teste do vetor nulo | `ex04.py` |
| 4 | Matriz de escala | `ex05.py`; `ex07.py` |
| 5 | Matriz de reflexão | `ex06.py` |
| 6 | Matriz de transformação geral | `ex08.py` |
| 7 | Desenho de vetores | `exMatPlot_vetor.py` |
| 8 | Desenho de triângulo | `exMatPlot_Triangulo.py` |
| 9 | Autovalores e autovetores | `autovetores.py` |
| 10 | Funções não lineares e contraexemplos | `linear.md` |

## O que o corpus NÃO cobre

- Definição formal de espaço vetorial, subespaço, base e dimensão.
- Determinante, posto, inversa e sistemas lineares.
- Produto interno, norma, ortogonalidade e projeções.
- Rotações e cisalhamento (não há exemplo no corpus).
- Diagonalização, teorema espectral e SVD.
- Demonstração geral de que toda matriz define uma transformação linear.
- Interpretação geométrica formal de autovalores.

## Como estudar por este material

1. Refaça `ex03` e `ex09` à mão e confira no Python.
2. Use `ex04` para fixar a ideia de que `T(0,0) ≠ (0,0)` **elimina** a
   linearidade.
3. Desenhe o vetor e o triângulo antes e depois da transformação.
4. Em `autovetores.py`, calcule `Av` e `λv` e confirme a igualdade.
5. Trate `linear.md` como rascunho: confira cada conta.

## Limite de confiança

O material é código de estudante, não material oficial do professor. As
conclusões dos scripts estão corretas, mas `linear.md` contém trechos com contas
erradas (ver `02-exercicios.md`). Definições formais precisam ser buscadas fora
do corpus e marcadas como complemento.
