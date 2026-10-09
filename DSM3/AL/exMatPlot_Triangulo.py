import matplotlib.pyplot as plt

P1 = (1, 2)
P2 = (4, 1)
P3 = (2, 5)

# Passando as coordenadas para montar o desenho nos pontos 'x' e 'y'
x = [P1[0], P2[0], P3[0], P1[0]]
y = [P1[1], P2[1], P3[1], P1[1]]

plt.plot(x, y, marker="o") # Montar o triangulo e colocando ponto na coordenada "o"

# Colocando as coordenadas nos pontos "o"
plt.text(P1[0], P1[1], f"({P1[0]}, {P1[1]})")
plt.text(P2[0], P2[1], f"({P2[0]}, {P2[1]})")
plt.text(P3[0], P3[1], f"({P3[0]}, {P3[1]})")


plt.axhline(0) # Destacar linha horizontal
plt.axvline(0) # Destacar linha vertical

plt.grid(True) # Colocar grid

plt.axis("equal") # Colocar proporcao igual para o desenho

# Colocando nome nos eixos
plt.xlabel("x")
plt.ylabel("y")
plt.title("Triângulo no plano cartesiano")

plt.show()