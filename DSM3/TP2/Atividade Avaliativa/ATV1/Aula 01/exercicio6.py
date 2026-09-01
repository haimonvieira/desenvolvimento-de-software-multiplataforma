salario_mensal = float(input("Insira o seu salário mensal: R$ "))
pct_aumento = float(input("Insira a porcentagem de aumento: "))
novo_salario = (salario_mensal * pct_aumento)/100 + salario_mensal
print(f"Seu novo salário mensal com {pct_aumento}% de aumento fica igual a R$ {novo_salario:.2f}"
      + f"\nAntes era R$ {salario_mensal:.2f}. Diferença de {novo_salario - salario_mensal}")