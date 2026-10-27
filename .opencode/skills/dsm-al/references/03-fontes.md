# Fontes do corpus — AL

Inventário dos 13 arquivos em `conhecimento/DSM3/AL/`. O corpus é derivado dos
originais em `DSM3/AL/`, que **não são alterados**.

## Tabela completa

| Arquivo no corpus | Original | Tipo | Conteúdo | Confiabilidade |
| --- | --- | --- | --- | --- |
| `autovetores.md` | `DSM3/AL/autovetores.py` | PY | `np.linalg.eig` em matriz 2x2 | Alta (código executável) |
| `ex03.md` | `DSM3/AL/ex03.py` | PY | Teste de linearidade com dois vetores | Alta |
| `ex04.md` | `DSM3/AL/ex04.py` | PY | Teste do vetor nulo | Alta |
| `ex05.md` | `DSM3/AL/ex05.py` | PY | Escala `(3x,2y)` | Alta |
| `ex06.md` | `DSM3/AL/ex06.py` | PY | Reflexão | Alta |
| `ex07.md` | `DSM3/AL/ex07.py` | PY | Escala em três pontos | Alta |
| `ex08.md` | `DSM3/AL/ex08.py` | PY | Matriz geral | Alta |
| `ex09.md` | `DSM3/AL/ex09.py` | PY | Teste de aditividade | Alta |
| `exmatplot-vetor.md` | `DSM3/AL/exMatPlot_vetor.py` | PY | Desenho de vetores | Alta |
| `exmatplot-triangulo.md` | `DSM3/AL/exMatPlot_Triangulo.py` | PY | Desenho de triângulo | Alta |
| `linear.md` | `DSM3/AL/linear.txt` | TXT | Anotações de exemplos | **Média** (contas inconsistentes) |
| `notebook-sources-al-exercicios-python.md` | `DSM3/AL/notebook-sources/AL-exercicios-python.txt` | TXT | Cópia dos scripts | Média (duplicata) |
| `notebook-sources-al-linear.md` | `DSM3/AL/notebook-sources/AL-linear.txt` | TXT | Cópia de `linear.txt` | Média (duplicata) |

## O que cada fonte responde melhor

- **Como testar linearidade:** `ex03`, `ex04`, `ex09`, `linear.md`.
- **Como montar e aplicar matrizes:** `ex05` a `ex08`.
- **Como desenhar:** `exmatplot-vetor`, `exmatplot-triangulo`.
- **Autovalores/autovetores:** `autovetores`.
- **Contraexemplos e axiomas:** `linear.md`.

## Lacunas do acervo

- Não há aula teórica; nenhum PDF, slide ou livro.
- Não há definição formal de espaço vetorial, base, dimensão ou determinante.
- Não há rotação, cisalhamento, projeção ou mudança de base.
- Não há exercícios de autovalores além do script.
- Não há gabarito oficial; os scripts são a própria verificação.

## Cuidados de citação

- Cite `conhecimento/DSM3/AL/<arquivo>.md`; não há páginas.
- `linear.md` e as duas cópias em `notebook-sources/` são duplicatas; prefira
  `linear.md` e avise quando usar a cópia.
- `autovetores.py` é trabalho do próprio usuário em `DSM3/AL/`; o corpus é
  somente leitura.
- Não trate código de estudante como material oficial do professor.
