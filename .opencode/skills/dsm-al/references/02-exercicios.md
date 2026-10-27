# Exercícios e atividades — AL

## Panorama

| Arquivo | O que faz | Resultado |
| --- | --- | --- |
| `ex03.py` | Testa `A(αu+βv) = αAu+βAv` | Linear |
| `ex04.py` | Testa `T(0,0)` | Não linear |
| `ex05.py` | Aplica escala `(3x,2y)` a um ponto | `(9,8)` |
| `ex06.py` | Aplica reflexão a um ponto | `(-5,-2)` |
| `ex07.py` | Aplica escala `(2x,2y)` a três pontos | `(2,4)`, `(8,2)`, `(4,10)` |
| `ex08.py` | Aplica matriz geral a um ponto | `(8,9)` |
| `ex09.py` | Testa aditividade | Linear |
| `autovetores.py` | Calcula autovalores/autovetores | `5`, `2` |
| `linear.md` | Anotações de vários exemplos | Mistura acertos e erros |

## `ex03.py`

```python
A = [[2, 1], [1, -3]]
u = (2, 1); v = (1, 1); alfa = 5; beta = 4
lado_esquerdo = A @ (alfa*u + beta*v)
lado_direito = alfa*(A @ u) + beta*(A @ v)
```

Contas:

- `αu + βv = 5·(2,1) + 4·(1,1) = (10,5)+(4,4) = (14,9)`;
- `A @ (14,9) = (2·14+1·9, 1·14-3·9) = (37,-13)`;
- `A @ u = (5,-1)`; `A @ v = (3,-2)`;
- `5·(5,-1) + 4·(3,-2) = (25,-5)+(12,-8) = (37,-13)`.

Resultado: iguais. **Cuidado:** o teste confirma a condição para um par de
vetores, não prova linearidade para todos.

## `ex04.py`

```python
def T(v):
    return np.array([v[0] + 2, v[1]])

T((0,0)) = (2,0)
```

`(2,0) ≠ (0,0)` → imprime "Não linear". Correto: a constante `+2` quebra a
linearidade.

## `ex05.py`

```python
A = [[3, 0], [0, 2]]
P = (3, 4)
A @ P = (9, 8)
```

Escala: `x` triplicado, `y` dobrado.

## `ex06.py`

```python
A = [[-1, 0], [0, 1]]
P = (5, -2)
A @ P = (-5, -2)
```

Reflexão no eixo y. O comentário do código só diz "reflexão"; o eixo deve ser
explicado pelo professor/aluno.

## `ex07.py`

```python
A = [[2, 0], [0, 2]]
pontos = [[1,2], [4,1], [2,5]]
resultado = pontos @ A
```

Saída:

```text
[[ 2  4]
 [ 8  2]
 [ 4 10]]
```

Convenção: vetores-linha. Como `A` é diagonal, o resultado é o mesmo de
`A @ P` ponto a ponto.

## `ex08.py`

```python
A = [[1, 2], [3, 1]]
P = (2, 3)
A @ P = (1·2 + 2·3, 3·2 + 1·3) = (8, 9)
```

## `ex09.py`

```python
A = [[1, -1], [2, 1]]
u = (3, 1); v = (2, -2)
u + v = (5, -1)
A @ (u+v) = (1·5 - 1·(-1), 2·5 + 1·(-1)) = (6, 9)
A @ u = (2, 7)
A @ v = (4, 2)
(2,7) + (4,2) = (6,9)
```

Resultado: iguais. Mesma ressalva de `ex03`.

## `autovetores.py`

```python
A = [[4, 1], [2, 3]]
autovalores, autovetores = np.linalg.eig(A)
```

- autovalores: `5` e `2`;
- autovetores: colunas proporcionais a `(1,1)` e `(1,-2)`.

Conferência:

```text
A @ (1,1)  = (5,5)  = 5·(1,1)
A @ (1,-2) = (2,-4) = 2·(1,-2)
```

O código tem um bloco comentado que conferiria `Av = λv` para o índice `i`.

## `linear.md`

### Exemplo 1 — `T(x,y) = (3x, 2y)`

```text
u = (1,2); v = (0,1); u+v = (1,3)
T(u+v) = (3,6)
T(u) + T(v) = (3,4) + (0,2) = (3,6)
```

Linear. O texto tem a linha confusa `T(1,3)=(3,4)+(0,2)` e depois
`T(3,6)=(3,6)`; a conclusão está certa.

### Exemplo 2 — `T(x,y) = (x+y, x-y)`

```text
T(1,3) = (4,-2)
T(u) = (3,-1); T(v) = (1,-1); soma = (4,-2)
```

Linear.

### Exemplo 3 — `T(x,y) = (x+4, y)`

```text
T(0,0) = (4,0) ≠ (0,0)
T(4,6) = (8,6)
T(u)+T(v) = (5,3)+(7,3) = (12,6)
```

Não linear. O texto escreve `T(4,6)=(5,3)+(12,18)` e `T(8,6)=(17,21)`, que
estão **errados**; use as contas acima.

### Exemplo 4 — `T(x,y) = (2x-y, x+3y)`, `v=(4,-1)`

```text
T(4,-1) = (8+1, 4-3) = (9,1)
```

### Exemplo 5 — `T(x,y) = (5x-2y, 3x+y)`

```text
u=(2,2); v=(3,3); u+v=(5,5)
T(u+v) = (25-10, 15+5) = (15,20)
T(u) = (6,8); T(v) = (9,12); soma = (15,20)
a=2: T(4,4) = (12,16); 2·T(2,2) = 2·(6,8) = (12,16)
```

Linear.

## Como responder "me dá a resposta"

1. Rode o script mentalmente e mostre a conta.
2. Diga se o teste é **um caso** ou **prova geral**.
3. Se o arquivo tiver erro de conta, apresente a correção e explique que o
   material é rascunho.
4. Para definições que não estão no corpus, marque **complemento externo**.
