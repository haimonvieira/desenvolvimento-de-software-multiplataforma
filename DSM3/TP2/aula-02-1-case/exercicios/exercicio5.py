categoria = input("Insira sua categoria(A, B ou C): ")
salario = float(input("Insira seu salário: R$ "))

match categoria.lower():
    case 'a':
        salario_final = salario + salario * .1
    case 'b':
        salario_final = salario + salario * .15
    case 'c': 
        salario_final = salario + salario * .25
    case _:
        print("Opção inválida")

print(f"""
Salário atual: R$ {salario:.2f}
Salário com aumento: R$ {salario_final:.2f}
""")