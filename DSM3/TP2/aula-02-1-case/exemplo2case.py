op = int(input("Digite os numeros de 1 a 6: "))

match op:
    case 1|2|3:
        print("Digitou 1, 2 ou 3")
    case 4|5|6:
        print("Digitou 4, 5 ou 6")
    case _:
        print("Opção incorreta")