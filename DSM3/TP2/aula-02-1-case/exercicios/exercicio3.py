op = int(input("""
CÁLCULO DE GRANDEZAS ELETRICAS

1 - Tensão
2 - Resistência
3 - Corrente
0 - SAIR
"""))

match op:
    case 1:
        resistencia = float(input("Insira o valor da resistencia: "))
        corrente = float(input("Insira o valor da corrente: "))
        tensao = resistencia * corrente
        print(f"Tensão: {tensao} V")
    case 2:
        tensao = float(input("Insira o valor da tensao: "))
        corrente = float(input("Insira o valor da corrente: "))
        resistencia = tensao / corrente
        print(f"Resistencia: {resistencia} Ohm")

    case 3:
        tensao = float(input("Insira o valor da tensao: "))
        resistencia = float(input("Insira o valor da resistencia: "))
        corrente = tensao / resistencia
        print(f"Corrente: {corrente} A")

    case _:
        print("Opcao invalida")
