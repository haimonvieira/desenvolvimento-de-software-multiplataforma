tabuada = int(input("Insira qual tabuada quer: "))
print("Abaixo insira onde deve começar e onde deve terminar a tabuada")
tabuada_inicial = int(input("de: "))
tabuada_final = int(input("até: "))

while  tabuada_inicial <= tabuada_final:
    print(f"{tabuada} X {tabuada_inicial} = {tabuada * tabuada_inicial}")
    tabuada_inicial += 1