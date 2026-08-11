altura = float(input("Insira sua altura (em m): "))
sexo = input("Informe seu sexo (M/F): ")

if sexo.upper() == "M":
    peso_ideal = (72.7 * altura) - 58
elif sexo.upper() == "F":
    peso_ideal = (62.1 * altura) - 44.7
else:
    print("Sexo invalido")

print(f"Altura: {altura:.2f}\nSexo: {sexo}\nPeso ideal: {peso_ideal:.2f}")