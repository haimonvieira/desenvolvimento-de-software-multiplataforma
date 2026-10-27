---
disciplina: DSM3/AL
titulo: autovetores
fonte: DSM3/AL/autovetores.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
import numpy as np

A = np.array([
    [4, 1],
    [2, 3]
])

autovalores, autovetores = np.linalg.eig(A)
print("Autovlores: ")
print(autovalores)

print("Autovetores: ")
print(autovetores)

# i = 0
# lam = autovalores[i]
# V = autovetores[:, i]

# print("Av = ", A @ V)
# print("lambda * v = ", lam * V)
```
