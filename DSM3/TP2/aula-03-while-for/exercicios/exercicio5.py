
lista = ["Maria", "João", "Paulo", "Magali"]

print("Insira o nome que quer localizar da lista a seguir: ")
print(f"Lista: ", lista)
localizar = input("Insira o nome: ")

for nome in lista:
    if nome == localizar:
        print(nome)
        break