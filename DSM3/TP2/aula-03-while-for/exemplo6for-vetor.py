# le os valores e armazena em uma lista (vetor)
# comando append para adicionar os dados no vetor

lista = []

# Armazenar 5 numeros na lista
for i in range(1, 6):
    num = int(input(f"Insira o {i}º número: "))
    lista.append(num)
print("Números armazenados na lista: ")

# Mostrar os numeros armazenados na lista
for i in lista:
    print(i)