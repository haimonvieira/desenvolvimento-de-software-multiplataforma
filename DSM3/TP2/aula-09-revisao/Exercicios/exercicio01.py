# Um comerciante comprou um produto e quer vendê-
# lo com um lucro de 45% se o valor da compra for menor
# que R$ 20,00; caso contrário, o lucro será de 30%.
# Elabore um algoritmo que leia o valor da compra e
# mostre o valor de venda para o produto.

valor_compra = float(input("Insira o valor da compra: "))
valor_venda = 0

if valor_compra < 20:
    valor_venda += valor_compra + (valor_compra * 0.45)
    print(f"Valor de compra: R$ {valor_compra:.2f} \nValor de venda: R$ {valor_venda:.2f} (+45%)")
else:
    valor_venda += valor_compra + (valor_compra * .30)
    print(f"Valor de compra: R$ {valor_compra:.2f} \nValor de venda: R$ {valor_venda:.2f} (+30%)")
