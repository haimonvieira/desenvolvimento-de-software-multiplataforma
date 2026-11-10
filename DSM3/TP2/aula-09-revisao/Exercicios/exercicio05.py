# Na sequência de 1 a 800 mostre a soma de todos os
# números utilizando a estrutura For

soma = 0
resultado = 0

for i in range(1, 801):
    resultado += i
    print(f"Soma de {i} + {soma} = {resultado}")
    soma += i
