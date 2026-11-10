# Calcule a área de um terreno , leia o comprimento e a
# largura , e calcule a área = comprimento * largura ,
# mostre o valor da área do terreno. Faça um calculo para
# o perímetro do terreno (perímetro= 2* ladoa + 2* ladob).
# Depois faça um menu de escolha utilizando case para
# escolher entre calcular a área ou o perímetro do
# terreno.



while True:

    opcao = int(input("Escolha uma opção: \n1 - Calcular Área \n2 - Calcular Perímetro\n0 - SAIR\nInsira a opção: "))

    match opcao:

        case 1:
            comprimento = float(input("Insira o comprimento em metros: "))
            largura = float(input("Insira a largura em metros: "))

            area = comprimento * largura
            print(f"Área {area:.2f}\n")
        case 2:
            lado_a = float(input("Insira em metros o lado A: "))
            lado_b = float(input("Insira em metros o lado B: "))
            perimetro = 2 * lado_a + 2 * lado_b
            print(f"Perímetro: {perimetro:.2f}\n")

        case _:
            print("Saindo...")
            exit
            break