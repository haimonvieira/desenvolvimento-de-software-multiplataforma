
lista_numeros = []
for i in range(1, 11):
    num = int(input(f"Insira o {i}º número: "))
    lista_numeros.append(num)

for numero in lista_numeros:
    if numero % 2 == 0:
        print(f"O número {numero} é par")
    else:
        print(f"O número {numero} é ímpar")
