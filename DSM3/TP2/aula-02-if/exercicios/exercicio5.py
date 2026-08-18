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
        media = altura2
    else:
        menor = altura2
        media = altura3
elif altura2 > altura1 and altura2 > altura3:
    maior = altura2
    if altura3 > altura1:
        menor = altura1
        media = altura3
    else: 
        menor = altura3
        media = altura1
elif altura3 > altura1 and altura3 > altura2:
    maior = altura3
    if altura1 > altura2:
        media = altura1
        menor = altura2
    else:
        media = altura2
        menor = altura1

print(f"Maior: {maior}\nMedia: {media}\nMenor: {menor}")
