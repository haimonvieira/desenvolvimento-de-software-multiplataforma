import numpy as np

A = np.array([
    [2, 1],
    [1, -3]
])

u = np.array([2, 1])
v = np.array([1, 1])

alfa = 5
beta = 4

lado_esquerdo = A @(alfa * u + beta * v)
lado_direito = alfa * (A @ u) + beta * (A @ v)

print("É linear? ", np.array_equal(lado_esquerdo, lado_direito))