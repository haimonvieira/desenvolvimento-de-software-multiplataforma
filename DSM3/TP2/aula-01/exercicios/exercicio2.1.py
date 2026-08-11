salario_mensal = 1500.00
bonus = 150.00
quantidade_itens = int(input("Insira a quantidade de itens vendidos: "))
salario_final = bonus * quantidade_itens + salario_mensal
print(f"Itens vendidos: {quantidade_itens}\n Salario final: {salario_final:.2f}")