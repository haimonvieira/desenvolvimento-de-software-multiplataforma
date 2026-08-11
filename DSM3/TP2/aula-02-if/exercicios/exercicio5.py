print("Primeira pessoa")
altura1 = float(input("Insira a sua altura: "))
print("Segunda pessoa")
altura2 = float(input("Insira a sua altura: "))
print("Terceira pessoa")
altura3 = float(input("Insira a sua altura: "))

# Altura maior
if altura1 > altura2 and altura1 > altura3:
    maior = altura1
    if altura2 > altura3:
        menor = altura3
    else:
        menor = altura2
elif altura2 > altura1 and altura2 > altura3:
    maior = altura2
    if altu
else:
    maior = altura3
