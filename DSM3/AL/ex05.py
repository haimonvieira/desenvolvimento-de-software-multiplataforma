import numpy as np

# T(3x, 2y) P = (3, 4)
# T(3x, 2y) -> T(3x +0y, 0x + 2y)
A = np.array([
    [3, 0],
    [0, 2]
])

P = np.array([3, 4])

novoPonto = A @ P
print(f"novoPonto: {novoPonto}")