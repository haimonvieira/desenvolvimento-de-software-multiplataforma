import numpy as np

A = np.array([
    [1, 2],
    [3, 1]
])

P = np.array([2, 3])

resultado = A @ P # multiplicacao matricial
print("Ponto apos transformação: P' = ", resultado)