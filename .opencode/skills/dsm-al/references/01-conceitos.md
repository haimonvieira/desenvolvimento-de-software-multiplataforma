# Conceitos consolidados — AL

## 1. Vetor no plano

Um vetor é representado por um par ordenado `(x, y)`. No corpus:

- `u = (1, 2)`, `v = (0, 1)`;
- soma: `u + v = (1, 3)`;
- multiplicação por escalar: `2u = (2, 4)`.

Fonte: `linear.md`; `exMatPlot_vetor.md` desenha `u = (3,8)` e `v = (1,4)`.

## 2. Transformação linear

O corpus trabalha com funções `T: R² → R²` escritas como `T(x, y) = (...)`.
Os três testes que aparecem são:

| Teste | Fórmula | Onde |
| --- | --- | --- |
| Aditividade | `T(u + v) = T(u) + T(v)` | `ex09.py`, `linear.md` |
| Homogeneidade | `T(a·u) = a·T(u)` | `linear.md` |
| Vetor nulo | `T(0,0) = (0,0)` | `ex04.py`, `linear.md` |

Os dois primeiros são os axiomas; o terceiro é consequência deles e serve como
teste rápido de **não linearidade**: se `T(0,0) ≠ (0,0)`, a transformação não é
linear.

**Complemento externo:** satisfazer `T(0,0) = (0,0)` não garante linearidade;
é preciso valer para todos os vetores e escalares.

## 3. Matriz de transformação

Uma transformação da forma

```text
T(x, y) = (a·x + b·y, c·x + d·y)
```

pode ser escrita como `T(P) = A @ P`, com

```text
A = [[a, b],
     [c, d]]
```

Exemplo do corpus (`ex08`):

```text
A = [[1, 2],
     [3, 1]]
P = (2, 3)
A @ P = (1·2 + 2·3, 3·2 + 1·3) = (8, 9)
```

Fonte: `ex08.md`.

## 4. Escala

`T(x, y) = (3x, 2y)` é representada por `[[3,0],[0,2]]`: o `x` é multiplicado
por 3 e o `y` por 2.

Em `ex05`, `P = (3,4)` vira `(9,8)` (`ex05.md`).

Em `ex07`, `T(x,y) = (2x, 2y)` é aplicada a três pontos:

| Ponto | Imagem |
| --- | --- |
| `(1,2)` | `(2,4)` |
| `(4,1)` | `(8,2)` |
| `(2,5)` | `(4,10)` |

Fonte: `ex07.md`.

## 5. Reflexão

`A = [[-1,0],[0,1]]` troca o sinal da coordenada `x`:

```text
P = (5, -2) → P' = (-5, -2)
```

Isso é uma reflexão em relação ao **eixo y**. Fonte: `ex06.md`.

**Complemento externo:** `[[1,0],[0,-1]]` reflete no eixo x; `[[-1,0],[0,-1]]`
reflete na origem.

## 6. Transformação geral

`ex08` usa `A = [[1,2],[3,1]]` e `P = (2,3)` → `(8,9)`. Não há interpretação
geométrica no arquivo; ela seria complemento externo.

## 7. Autovalores e autovetores

O script `autovetores.py` usa:

```python
autovalores, autovetores = np.linalg.eig(A)
```

com

```text
A = [[4, 1],
     [2, 3]]
```

Resultados:

- autovalores: `5` e `2`;
- autovetores associados: `(1,1)` e `(1,-2)`, em qualquer múltiplo não nulo.
- O `numpy` devolve colunas normalizadas: aproximadamente
  `(0.7071, 0.7071)` e `(0.4472, -0.8944)`.

Conferência:

```text
A @ (1,1)   = (4+1, 2+3) = (5,5)   = 5·(1,1)
A @ (1,-2)  = (4-2, 2-6) = (2,-4)  = 2·(1,-2)
```

Fonte: `autovetores.md`.

**Complemento externo:** a definição é `Av = λv`, com `v ≠ 0`; autovetores são
soluções não nulas de `(A - λI)v = 0`.

## 8. Funções não lineares

`linear.md` lista como exemplos de funções não lineares:

- potência;
- raiz;
- seno;
- `e^x`;
- constante solta, como `x + 4`.

O contraexemplo desenvolvido é `T(x,y) = (x+4, y)`:

```text
T(0,0) = (4,0) ≠ (0,0)  → não linear
T(4,6) = (8,6)
T(u)+T(v) = (5,3)+(7,3) = (12,6) ≠ (8,6)
```

Fonte: `linear.md`.

## 9. Visualização com matplotlib

### Vetores (`exMatPlot_vetor.md`)

```python
plt.quiver(0, 0, 3, 8, angles="xy", scale_units="xy", scale=1)
plt.quiver(0, 0, 1, 4, angles="xy", scale_units="xy", scale=1)
```

`quiver` desenha uma seta da origem até `(x,y)`. `angles="xy"`,
`scale_units="xy"` e `scale=1` mantêm o vetor no tamanho real.

### Triângulo (`exMatPlot_Triangulo.md`)

```python
x = [P1[0], P2[0], P3[0], P1[0]]
y = [P1[1], P2[1], P3[1], P1[1]]
plt.plot(x, y, marker="o")
```

O último ponto repete o primeiro para fechar o triângulo. `plt.axis("equal")`
garante a mesma escala nos dois eixos; `axhline(0)` e `axvline(0)` desenham os
eixos; `plt.text` rotula os vértices.

## 10. Convenção linha versus coluna

- `ex05`, `ex06`, `ex08`, `ex09` usam `A @ P`: o ponto é um vetor-coluna.
- `ex07` usa `pontos @ A`: cada linha da matriz de pontos é um vetor-linha.

As duas convenções são válidas, mas não se misturam. Como a matriz de `ex07` é
diagonal, o resultado numérico é o mesmo.
