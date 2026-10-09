import matplotlib.pyplot as plt

# vetor u = (3, 8)
plt.quiver(
    0, 0,
    3, 8, # vetor u
    angles="xy", # Definindo as coordenadas 'x' e 'y'
    scale_units="xy",
    scale=1
)

# vetor v = (1, 4)
plt.quiver(
    0, 0,
    1, 4, # vetor u
    angles="xy", # Definindo as coordenadas 'x' e 'y'
    scale_units="xy",
    scale=1
)

plt.axhline(0) # Destacar linha horizontal
plt.axvline(0) # Destacar linha vertical

plt.grid(True) # Colocar grid

plt.axis("equal") # Colocar proporcao igual para o desenho

plt.xlim(-2, 10)
plt.ylim(-2, 10)

# Colocando nome nos eixos
plt.xlabel("x")
plt.ylabel("y")
plt.title("Vetores no plano")

plt.show()
