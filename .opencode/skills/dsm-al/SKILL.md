---
name: DSM — Álgebra Linear (AL)
description: Responde dúvidas de Álgebra Linear do curso DSM usando o material local em conhecimento/DSM3/AL. Cobre vetores no R², soma e multiplicação por escalar, transformações lineares T(x,y), axiomas de linearidade, matrizes 2x2, escala, reflexão, aplicação de transformações a pontos e triângulos, autovalores/autovetores com numpy e visualização com matplotlib. Use quando a pergunta citar transformação linear, linearidade, autovetor, autovalor, matriz de transformação, numpy, matplotlib, vetor ou plano cartesiano na disciplina AL.
metadata:
  opencode/autoinvoke: false
---

# Álgebra Linear (DSM3/AL)

Skill de disciplina. O corpus de AL é formado por **scripts Python e anotações**, não
por slides teóricos. Responda **somente** com base no material indexado, cite o
arquivo em toda resposta técnica e marque como **complemento externo** qualquer
definição formal que o corpus não traga.

## Escopo

Entram: vetores no plano, soma de vetores, multiplicação por escalar,
transformações `T: R² → R²`, axiomas de linearidade (aditividade, homogeneidade e
vetor nulo), representação por matriz 2x2, aplicação a pontos e triângulos, escala,
reflexão, autovalores e autovetores com `numpy.linalg.eig`, e desenho com
`matplotlib` (`plot`, `quiver`, `text`, `axis("equal")`).

Não entram (e não devem ser inventados como se fossem do material): espaços
vetoriais abstratos, base e dimensão, determinante, posto, sistemas lineares,
diagonalização, produto interno, ortogonalidade, projeções, rotações, cisalhamento,
SVD e classificação de operadores.

## Protocolo obrigatório

1. **Busque antes de responder.**

   ```bash
   python3 ferramentas/buscar.py "termo" --disciplina DSM3/AL --limite 8
   ```

2. **Leia o script ou a anotação** e responda com o vocabulário do material.

3. **Cite sempre** `conhecimento/DSM3/AL/<arquivo>.md`. O corpus não tem páginas
   de PDF; não invente `p. N`.

4. **Separe código de matemática.** O material mostra *como testar* e *como
   calcular*; definições e demonstrações formais são complemento externo.

5. **Se não houver cobertura**, diga "isso não está no material indexado de AL" e
   só então ofereça conhecimento externo, rotulado.

## Distinções que o aluno costuma errar

| Confusão | Como o corpus trata |
| --- | --- |
| Testar um par de vetores prova que `T` é linear | Não prova. `ex03` e `ex09` verificam a condição em um caso; a garantia geral vem de `T` ser dada por matriz (ou de provar os dois axiomas para todo `u`, `v`, `a`) |
| `T(0,0) = (0,0)` prova linearidade | Não. É condição **necessária**, não suficiente. `ex04` usa `T(0,0) ≠ (0,0)` para concluir "não linear" |
| Toda transformação com matriz é linear | Sim, se `T(v) = A v`; mas `T(x,y) = (x+4, y)` não é da forma `A v` e falha no vetor nulo |
| `A @ P` e `pontos @ A` são a mesma conta | São convenções diferentes: `A @ P` trata `P` como coluna; `pontos @ A` trata cada ponto como linha. Em `ex07` a matriz é diagonal, então o resultado coincide |
| Autovetor é único | Não. `np.linalg.eig` devolve vetores **normalizados**; `(1,1)` e `(0,707; 0,707)` representam a mesma direção |
| `[[-1,0],[0,1]]` reflete no eixo x | Essa matriz troca o sinal de `x`, então reflete no **eixo y**. Para refletir no eixo x seria `[[1,0],[0,-1]]` |
| `np.array_equal` é a prova matemática | É comparação exata de `float`; serve para o exemplo, mas erros de arredondamento podem dar `False` |

## Números e fatos que precisam sair exatos

- **`ex03`:** `u=(2,1)`, `v=(1,1)`, `α=5`, `β=4`; `αu+βv=(14,9)` e
  `A(αu+βv) = αAu + βAv = (37,-13)`.
- **`ex05`:** `A=[[3,0],[0,2]]`, `P=(3,4)` → `(9,8)`.
- **`ex06`:** `A=[[-1,0],[0,1]]`, `P=(5,-2)` → `(-5,-2)`.
- **`ex07`:** `A=[[2,0],[0,2]]`, pontos `(1,2)`, `(4,1)`, `(2,5)` →
  `(2,4)`, `(8,2)`, `(4,10)`.
- **`ex08`:** `A=[[1,2],[3,1]]`, `P=(2,3)` → `(8,9)`.
- **`ex09`:** `A=[[1,-1],[2,1]]`, `u=(3,1)`, `v=(2,-2)`; `u+v=(5,-1)` e
  `A(u+v) = Au + Av = (6,9)`.
- **`autovetores`:** `A=[[4,1],[2,3]]` tem autovalores **5 e 2**; autovetores
  `(1,1)` e `(1,-2)` (o `numpy` devolve versões normalizadas).
- **Axiomas no material (`linear.md`):** soma `T(u+v)=T(u)+T(v)`, escala
  `T(a·u)=a·T(u)` e vetor nulo `T(0,0)=(0,0)`.

## Cuidados ao responder

- `linear.md` tem **erros de conta e de notação** em alguns trechos. Exemplo: em
  `T(x,y)=(x+4,y)`, o texto escreve `T(4,6)=(5,3)+(12,18)` e `T(8,6)=(17,21)`;
  o correto é `T(4,6)=(8,6)` e `T(u)+T(v)=(5,3)+(7,3)=(12,6)`. A conclusão
  ("não linear") está certa, mas não reproduza as linhas erradas.
- No primeiro exemplo, `T(x,y)=(3x,2y)`, a linha `T(1,3)=(3,4)+(0,2)` mistura
  `T(u+v)` com `T(u)+T(v)`; o correto é `T(1,3)=(3,6)` e
  `T(u)+T(v)=(3,4)+(0,2)=(3,6)`.
- `ex07` usa `pontos @ A` (vetores-linha). Não trate como erro, mas explique a
  convenção adotada.
- `autovetores.py` imprime "Autovlores" (sic). Não replique o erro.
- Não há aula teórica de autovalores no corpus; a relação `Av = λv` e o
  significado geométrico devem ser explicados como **complemento externo**.
- Nunca altere os arquivos em `DSM3/AL/`; a fonte da verdade são os originais.

## Referências

- `references/00-visao-geral.md` — cobertura, sequência e lacunas.
- `references/01-conceitos.md` — transformações, matrizes, autovalores e gráficos.
- `references/02-exercicios.md` — `ex03` a `ex09`, `autovetores` e `linear.txt`.
- `references/03-fontes.md` — inventário dos 13 arquivos.
- `references/04-glossario.md` — termos.
