---
disciplina: DSM3/TP2
titulo: TP2 Aula 02 if
fonte: DSM3/TP2/notebook-sources/TP2-Aula-02-if.txt
tipo: txt
paginas: 0
extraido_em: 2026-10-24
---

# ===== TP2: TP2\aula-02-if\exemplo1if.py =====

# Comando para limpar a tela
import os
os.system("cls")

entrada = input("Voce quer entrar ou sair? ")
# comando de decisao if
if entrada == "entrar":
    print("Voce entrou no sistema!")
elif entrada == "sair":
    print("Saiu do sistema.")
else:
    print("Opção inválida")

# ===== TP2: TP2\aula-02-if\exemplo2if.py =====

import subprocess
subprocess.run("cls")

nota1 = float(input("Insira a primeira nota: "))
nota2 = float(input("Insira a segunda nota: "))
media = (nota1 + nota2) / 2

if media > 7.0:
    print(f"Aluno aprovado. Média: {media}")
elif media > 4.0 and media < 6.9:
    print(f"Aluno de exame. Média foi de {media}")
else:
    print(f"Aluno nao tem como salva")

# ===== TP2: TP2\aula-02-if\exemplo3if.py =====

negativado = int(input("Possui nome negativado? (1- SIM / 0 - NÃO): "))

if negativado == 2 or negativado == 3 or negativado == 4:
    print("Digite apenas 1 ou 0")

if negativado == 1:
    print("Não pode realizar empréstimo.")
else:
    carteira_assinada = int(input("Possui carteira assinada? (1- SIM / 0 - NÃO): "))

    if carteira_assinada == 0:
        print("Não pode realizar empréstimo.")
    else :
        print("Pode realizar empréstimo.")

# ===== TP2: TP2\aula-02-if\exercicios\exercicio1.py =====

numero1 = int(input("Insira o primeiro numero: "))
numero2 = int(input("Insira o segundo numero: "))

if numero1 > numero2:
    print(numero1/numero2)
elif numero2 > numero1:
    print(numero2/numero1)
elif numero1 == numero2:
    print("Os numeros sao iguais")


# ===== TP2: TP2\aula-02-if\exercicios\exercicio2.py =====

print("Primeira pessoa")
nome1 = input("Insira seu nome: ")
peso1 = float(input("Insira seu peso: "))
print("Segunda pessoa")
nome2 = input("Insira seu nome: ")
peso2 = float(input("Insira seu peso: "))

if peso1 > peso2:
    print(f"{nome1} pesa {peso1:.2f}kg")
elif peso2 > peso1:
    print(f"{nome2} pesa {peso2:.2f}kg")
elif peso1 == peso2:
    print(f"{nome1} e {nome2} tem o mesmo peso.")


# ===== TP2: TP2\aula-02-if\exercicios\exercicio3.py =====

altura = float(input("Insira sua altura (em m): "))
sexo = input("Informe seu sexo (M/F): ")

if sexo.upper() == "M":
    peso_ideal = (72.7 * altura) - 58
elif sexo.upper() == "F":
    peso_ideal = (62.1 * altura) - 44.7
else:
    print("Sexo invalido")

print(f"Altura: {altura:.2f}\nSexo: {sexo}\nPeso ideal: {peso_ideal:.2f}")

# ===== TP2: TP2\aula-02-if\exercicios\exercicio4.py =====

numero = int(input("Insira um numero inteiro positivo: "))

if numero % 2 == 0:
    resultado = numero*numero
    print(f"{resultado} é par.")
else:
    resultado = numero*numero*numero
    print(f"{resultado} é ímpar.")


# ===== TP2: TP2\aula-02-if\exercicios\exercicio5.py =====

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


# ===== TP2: TP2\aula-02-if\exercicios\exercicio6.py =====

import math

print("Informe os dois números")
num1 = int(input("Insira o primeiro numero: "))
num2 = int(input("Insira o segundo numero: "))

print("""
1 - Média ponderada
2 - Quadrado da soma dos 2 números
3 - Cubo do menor número
Excolha uma opção:
""")
opcao = int(input("> "))

if opcao == 1:
    media = (num1 * 2 + num2 * 3) / 5
    print("Média ponderada igual a " + str(media))
elif opcao == 2:
    soma = math.pow(num1, 2) + math.pow(num2, 2)
    print("Quadrado da soma dos 2 números é " + str(soma))
elif opcao == 3:
    if num1 < num2:
        print("Cubo do menor número é " + str(math.pow(num1, 3)))
    else:
        print("Cubo do menor número é " + str(math.pow(num2, 3)))
else:
    print("Opção inválida.")

# ===== TP2: TP2\aula-02-if\exercicios\exercicio7.py =====

rg = input("Insira seu RG: ")
ano_nascimento = int(input("Insira o ano do seu nascimento: "))
ano_ingresso_empresa = int(input("Insira o ano de ingresso na empresa: "))
ano_atual = int(input("Insira o ano atual: "))

idade = ano_atual - ano_nascimento
tempo_de_trabalho = ano_atual - ano_ingresso_empresa

print(f"""
Idade: {idade}
Tempo de trabalho: {tempo_de_trabalho}
RG: {rg}
""")

if idade >= 65 or tempo_de_trabalho >= 30:
    print("Requerer aposentadoria")
else:
    print("Não requerer aposentadoria")
