import numpy as np

A = np.array([
    [-1, 0],
    [0, 1]
])

P = np.array([5, -2])

novoPonto = A @ P
print(f"novoPonto após a reflexão: {novoPonto}")