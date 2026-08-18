cla = input("Digite a classificação A, B ou C: ")

match cla.lower():
    case "A":
        print("A classificação está no nível 1")
    case "B":
        print("A classificação está no nível 2")
    case "C":
        print("A classificação está no nível 3")
    case _:
        print("Opção incorreta")