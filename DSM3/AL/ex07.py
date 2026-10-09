# P1(1, 2)   P2(4, 1)    P(2, 5)
# T(x, y) = (2x, 2y) 
# T(x, y) = (2x + 0y, 0x + 2y)
# P1(1, 2) -> (2, 4)
# P2(4, 1) -> (8, 2)
# P3(2, 5) -> (4, 10)
import numpy as np

A = np.array([
    [2, 0],
    [0, 2]
])

pontos = np.array([
    [1, 2],
    [4, 1],
    [2, 5]
])

resultado = pontos @ A
print("Novos pontos: ", resultado)