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
