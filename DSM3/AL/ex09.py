import numpy as np

# Matriz
A = np.array([
    [1, -1],
    [2, 1]
])

u = np.array([3, 1])
v = np.array([2, -2])

# Lado esquerdo: T(u + v)
lado_esquerdo = A @ (u + v)
# T(u) + T(v)
lado_direito = (A @ u) + (A @ v)

print("T(u+v) = T(u) + T(v)")
print(f"{lado_esquerdo} = {lado_direito}\nÉ linear? ", "Linear" if np.array_equal(lado_direito, lado_esquerdo) else "Não linear")