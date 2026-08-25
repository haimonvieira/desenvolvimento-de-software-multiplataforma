# A função split le varios valores
# só devemos digitar os valores com espaço

numero = input("Insira os números deixando espaço entre eles: ")

vetor = [
    int(num)
    for num in numero.split()
]

print("Valores armazenados: ", vetor)