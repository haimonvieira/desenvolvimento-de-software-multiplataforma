# for para percorrer uma lista
nomes = ["Felipe", "Maria", "Luiza", "Paulo", "Josefina"]

for nome in nomes:
    # len conta a quantidade de caracteres
    if len(nome) != 4:
        continue
    print(f"Ese nome tem 4 letras {nome}")

    if nome == "Paulo":
        break
    print("Terminou a execução")