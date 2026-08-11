custo_fabricacao = float(input("Insira de custo de fabricação da Pick-up: "))

imposto_distribuidor = (custo_fabricacao * .38)
outros_impostos = (custo_fabricacao * .47)
custo_final = custo_fabricacao + imposto_distribuidor + outros_impostos
print(f"Imposto distribuidor: {imposto_distribuidor:.2f}\nOutros impostos: {outros_impostos:.2f}\nCusto final: {custo_final:.2f}")