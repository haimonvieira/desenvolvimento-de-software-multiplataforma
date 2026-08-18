op = int(input("""
1 - Sacar
2 - Extrato
0 - Sair
"""))

match op:
    case 1:
        print("Voce escolheu sacar")
    case 2:
        print("Voce escolheu ver o extrato")
    case 0:
        exit
    case _:
        print("Opção invalida")