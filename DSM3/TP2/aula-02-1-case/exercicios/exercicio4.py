valor_compra = float(input("Insira o valor total da compra: R$ "))

op = int(input("""
1 - À vista (em espécie) -- 15% desconto
2 - Cartão de débito -- 10% desconto
3 - Cartão de crédito -- 5% desconto

0 - SAIR
"""))
match op:
    case 1:
        valor_final = valor_compra - (valor_compra *.15)
    case 2:
        valor_final = valor_compra - (valor_compra *.10)
    case 3:
        valor_final = valor_compra - (valor_compra *.05)
    case _:
        print("Opção inválida")
print(f"""
Valor da compra: R$ {valor_compra}
Valor com desconto: R$ {valor_final}
""")