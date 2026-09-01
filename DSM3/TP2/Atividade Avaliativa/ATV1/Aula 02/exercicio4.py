numero = int(input("Insira um numero inteiro positivo: "))

if numero % 2 == 0:
    resultado = numero*numero
    print(f"{resultado} é par.")
else:
    resultado = numero*numero*numero
    print(f"{resultado} é ímpar.")


