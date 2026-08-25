localiza = input("Insira a fruta que quer buscar: ")
frutas = ["banana", "maça", "manga", "abacate", "pera", "kiwi"]

for fruta in frutas:
    if fruta == localiza:
        print(f"{fruta}, fruta encontrada")
        break
    else:
        print(f"{localiza}, não foi encontrada até o momento")