parcela = float(input("Insira o valor da parcela: "))
taxa_juros = float(input("Insira a taxa de juros: "))
tempo = int(input("Insira quantidade de meses em atraso: "))
valor_atraso = parcela + (parcela * (taxa_juros / 100) * tempo)

print(f"Valor do produto com atraso: {valor_atraso}\n Juros: {taxa_juros}\n")

for i in range(tempo):
    print(f"Valor da parcela: {parcela}, juros: {taxa_juros}")
