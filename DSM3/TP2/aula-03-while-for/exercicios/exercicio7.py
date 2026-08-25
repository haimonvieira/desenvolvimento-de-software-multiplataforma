
nomes = []
for i in range(1, 8):
    nome = input(f"Digite o {i}º nome: ")
    nomes.append(nome)

cont = 1
print("Nomes digitados: ")
for nome in nomes: 
    print(f"O {cont}º nome é {nome.upper()}")
    cont += 1

