print("Primeira pessoa")
nome1 = input("Insira seu nome: ")
peso1 = float(input("Insira seu peso: "))
print("Segunda pessoa")
nome2 = input("Insira seu nome: ")
peso2 = float(input("Insira seu peso: "))

if peso1 > peso2:
    print(f"{nome1} pesa {peso1:.2f}kg")
elif peso2 > peso1:
    print(f"{nome2} pesa {peso2:.2f}kg")
elif peso1 == peso2:
    print(f"{nome1} e {nome2} tem o mesmo peso.")
