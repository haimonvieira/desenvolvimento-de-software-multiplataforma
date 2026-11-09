# Armazene os nomes

# Criando vetor 'pessoas'
pessoas = []

for i in range(1, 6):
    pessoa = input(f"Digite o nome da {i}a pessoa: ")
    pessoas.append(pessoa)

for pessoa in pessoas:
    print(pessoa)