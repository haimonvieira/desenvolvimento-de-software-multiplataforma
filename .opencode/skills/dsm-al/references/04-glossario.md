# Glossário — AL

## A–E

| Termo | Significado | Observação |
| --- | --- | --- |
| **Aditividade** | `T(u+v)=T(u)+T(v)` | Um dos axiomas de linearidade |
| **Autovalor (`λ`)** | Escalar tal que `Av = λv` para algum `v ≠ 0` | No corpus: `5` e `2` |
| **Autovetor** | Vetor não nulo que mantém a direção sob `A` | `numpy` normaliza |
| **Escala** | Transformação que multiplica cada coordenada por um fator | `[[3,0],[0,2]]` |
| **Espaço vetorial** | Estrutura algébrica com soma e escala | **Não definido no corpus** |

## F–L

| Termo | Significado | Observação |
| --- | --- | --- |
| **Homogeneidade** | `T(a·u)=a·T(u)` | Também chamada de multiplicação por escalar |
| **Imagem de um ponto** | Resultado `T(P)` | Em geral `A @ P` |
| **Linearidade** | Aditividade + homogeneidade | Vetor nulo é consequência |
| **Matriz de transformação** | Matriz `A` com `T(P)=A@P` | Só para transformações lineares |

## M–R

| Termo | Significado | Observação |
| --- | --- | --- |
| **Matriz diagonal** | Só tem entradas na diagonal | Escalas `[[a,0],[0,d]]` |
| **`np.linalg.eig`** | Função que calcula autovalores e autovetores | Devolve autovetores normalizados |
| **`plt.quiver`** | Desenha setas/vetores | Usado em `exMatPlot_vetor` |
| **`plt.plot`** | Desenha linha a partir de listas de `x` e `y` | Usado no triângulo |
| **Reflexão** | Espelhamento em relação a um eixo | `[[-1,0],[0,1]]` = eixo y |

## S–Z

| Termo | Significado | Observação |
| --- | --- | --- |
| **Transformação linear** | Função que preserva soma e escala | `T(0,0)=(0,0)` é necessário, não suficiente |
| **Vetor coluna** | Ponto escrito como coluna | Convenção de `A @ P` |
| **Vetor linha** | Ponto escrito como linha | Convenção de `pontos @ A` |
| **Vetor nulo** | `(0,0)` | Teste rápido de não linearidade |

## Fórmulas de referência (complemento externo)

| Conceito | Fórmula |
| --- | --- |
| Autovalor | `det(A - λI) = 0` |
| Autovetor | `(A - λI)v = 0`, `v ≠ 0` |
| Matriz 2x2 | `[[a,b],[c,d]]` aplicada a `(x,y)` → `(ax+by, cx+dy)` |

Essas fórmulas **não estão no corpus**; são complemento para explicar os
resultados dos scripts.
