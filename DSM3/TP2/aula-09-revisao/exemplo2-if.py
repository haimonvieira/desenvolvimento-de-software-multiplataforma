quantidade = int(input("Insira a quantidade: "))
valor = float(input("Insira o valor: "))

if quantidade > 10:
    valor_total = (valor * quantidade) - 10
    print(f"O valor a pagar com desconto de R$ 10 {valor_total}")
elif quantidade == 10:
    valor_total = (valor * quantidade)
    print(f"O valor a pagar não tem desconto {valor_total}")
else:
    valor_total = (valor * quantidade)
    print(f"O valor a pagar com desconto de R$ {valor_total}")