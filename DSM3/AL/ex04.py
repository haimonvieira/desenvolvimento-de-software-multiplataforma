import numpy as np

# Transformacao linear modelada
def T(v):
    return np.array([
        v[0] + 2,
        v[1]
    ])

zero = np.array([0, 0])

result = T(zero)
print("T(0) = ", result)
print("É igual a (0,0): ", "Linear" if np.array_equal(result, zero) else "Não linear")