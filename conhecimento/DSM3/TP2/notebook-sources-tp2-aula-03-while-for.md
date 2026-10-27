---
disciplina: DSM3/TP2
titulo: TP2 Aula 03 while for
fonte: DSM3/TP2/notebook-sources/TP2-Aula-03-while-for.txt
tipo: txt
paginas: 0
extraido_em: 2026-10-24
---

# ===== TP2: TP2\aula-03-while-for\exemplo1while.py =====

# Exemplo while crescente

cont = 0
while cont <= 500:
    print(cont)
    cont += 1

# Exemplo while decrescente
cont = 500
while cont >= 0:
    print(cont)
    cont -= 1

# ===== TP2: TP2\aula-03-while-for\exemplo2for.py =====

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

# ===== TP2: TP2\aula-03-while-for\exemplo3for.py =====

localiza = input("Insira a fruta que quer buscar: ")
frutas = ["banana", "maça", "manga", "abacate", "pera", "kiwi"]

for fruta in frutas:
    if fruta == localiza:
        print(f"{fruta}, fruta encontrada")
        break
    else:
        print(f"{localiza}, não foi encontrada até o momento")

# ===== TP2: TP2\aula-03-while-for\exemplo4forRange.py =====

# range faz a repetição for ate um valor determinado
# primeiro valor incicial, valor do meio é o valor final da repetição -1
# ultimo valor é a quantidadd de passos

for numero in range(1, 40, 2):
    print(numero)

# ===== TP2: TP2\aula-03-while-for\exemplo5forRange.py =====

# Soma todos os valores de 0 a 100
total = 0
for i in range(1, 101):
    total += i
print(f"A soma de 1 a 100 é {total}")

# ===== TP2: TP2\aula-03-while-for\exemplo6for-vetor.py =====

# le os valores e armazena em uma lista (vetor)
# comando append para adicionar os dados no vetor

lista = []

# Armazenar 5 numeros na lista
for i in range(1, 6):
    num = int(input(f"Insira o {i}º número: "))
    lista.append(num)
print("Números armazenados na lista: ")

# Mostrar os numeros armazenados na lista
for i in lista:
    print(i)

# ===== TP2: TP2\aula-03-while-for\exemplo7for-par.py =====


numeros = []

for i in range(1, 11):
    numeros.append(i)

for numero in numeros:
    if numero % 2 == 0:
        print(numero)

# ===== TP2: TP2\aula-03-while-for\exemplo8for-split.py =====

# A função split le varios valores
# só devemos digitar os valores com espaço

numero = input("Insira os números deixando espaço entre eles: ")

vetor = [
    int(num)
    for num in numero.split()
]

print("Valores armazenados: ", vetor)

# ===== TP2: TP2\aula-03-while-for\exercicios\exercicio1.py =====

# Ordem crescente de 1 a 100
for numero in range(1, 101):
    print(numero)


# ===== TP2: TP2\aula-03-while-for\exercicios\exercicio10.py =====


soma = 0
for numero in range(1, 800):
    soma += numero
print(soma)


# ===== TP2: TP2\aula-03-while-for\exercicios\exercicio11.py =====


# ===== TP2: TP2\aula-03-while-for\exercicios\exercicio2.py =====

numero = int(input("Insira até que numero é para imprimir: "))

cont = 1


while cont <= numero:
    print(cont)
    cont += 1

# ===== TP2: TP2\aula-03-while-for\exercicios\exercicio3.py =====

tabuada = int(input("Insira qual tabuada quer ver : "))

cont = 1
while cont <= 10:
    print(f"{tabuada} X {cont} = {tabuada*cont}")
    cont += 1

# ===== TP2: TP2\aula-03-while-for\exercicios\exercicio4.py =====

tabuada = int(input("Insira qual tabuada quer: "))
print("Abaixo insira onde deve começar e onde deve terminar a tabuada")
tabuada_inicial = int(input("de: "))
tabuada_final = int(input("até: "))

while  tabuada_inicial <= tabuada_final:
    print(f"{tabuada} X {tabuada_inicial} = {tabuada * tabuada_inicial}")
    tabuada_inicial += 1

# ===== TP2: TP2\aula-03-while-for\exercicios\exercicio5.py =====


lista = ["Maria", "João", "Paulo", "Magali"]

print("Insira o nome que quer localizar da lista a seguir: ")
print(f"Lista: ", lista)
localizar = input("Insira o nome: ")

for nome in lista:
    if nome == localizar:
        print(nome)
        break

# ===== TP2: TP2\aula-03-while-for\exercicios\exercicio6.py =====


for numero in range(3, 201, 3):
    print(numero)

# ===== TP2: TP2\aula-03-while-for\exercicios\exercicio7.py =====


nomes = []
for i in range(1, 8):
    nome = input(f"Digite o {i}º nome: ")
    nomes.append(nome)

cont = 1
print("Nomes digitados: ")
for nome in nomes:
    print(f"O {cont}º nome é {nome.upper()}")
    cont += 1


# ===== TP2: TP2\aula-03-while-for\exercicios\exercicio8.py =====


lista_numeros = []
for i in range(1, 11):
    num = int(input(f"Insira o {i}º número: "))
    lista_numeros.append(num)

for numero in lista_numeros:
    if numero % 2 == 0:
        print(f"O número {numero} é par")
    else:
        print(f"O número {numero} é ímpar")


# ===== TP2: TP2\aula-03-while-for\exercicios\exercicio9.py =====


for numero in range(500, 1, -2):
    print(numero)
