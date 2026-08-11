numero1 = int(input("Insira o primeiro numero: "))
numero2 = int(input("Insira o segundo numero: "))

if numero1 > numero2:
    print(numero1/numero2)
elif numero2 > numero1:
    print(numero2/numero1)
elif numero1 == numero2:
    print("Os numeros sao iguais")
