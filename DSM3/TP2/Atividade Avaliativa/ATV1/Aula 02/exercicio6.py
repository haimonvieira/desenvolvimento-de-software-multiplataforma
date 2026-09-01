import math

print("Informe os dois números")
num1 = int(input("Insira o primeiro numero: "))
num2 = int(input("Insira o segundo numero: "))

print("""
1 - Média ponderada
2 - Quadrado da soma dos 2 números
3 - Cubo do menor número 
Excolha uma opção: 
""")
opcao = int(input("> "))

if opcao == 1:
    media = (num1 * 2 + num2 * 3) / 5
    print("Média ponderada igual a " + str(media))
elif opcao == 2:
    soma = math.pow(num1, 2) + math.pow(num2, 2)
    print("Quadrado da soma dos 2 números é " + str(soma))
elif opcao == 3:
    if num1 < num2:
        print("Cubo do menor número é " + str(math.pow(num1, 3)))
    else:
        print("Cubo do menor número é " + str(math.pow(num2, 3)))
else:
    print("Opção inválida.")