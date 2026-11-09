# 'float' conversao para real
lado_a = float(input("Digite o valor do lado A do retangulo: "))
lado_b = float(input("Digite o valor do lado B do retangulo: "))

while True:
    opcao = int(
        input("Opções: 1 - Calculo da Area \n 2 - Calculo de Perimetro \n 3 - Sair")
    )
    match opcao:
        case 1:
            area = lado_a * lado_b
            print(f"A área é de {area:.2f}")
        case 2:
            perimetro = 2 * lado_a + 2 * lado_b
            print(f"O perimetro é {perimetro:.2f}")
        case 3:
            exit
            break
        case _:
            print("Opção incorreta")
