---
disciplina: DSM3/TP2
titulo: TP2 Aula 01
fonte: DSM3/TP2/notebook-sources/TP2-Aula-01.txt
tipo: txt
paginas: 0
extraido_em: 2026-10-24
---

# ===== TP2: TP2\aula-01\exemplo1.py =====

valor1 = input("Digite o primeiro valor: ")
valor2 = input("Digite o segundo valor: ")

print(valor1 + "\n" + valor2)

# ===== TP2: TP2\aula-01\exemplo2.py =====

num1 = int(input("Digite o primeiro valor: "))
num2 = int(input("Digite o segundo valor: "))
soma = num1 + num2
print(soma)
print("O resultado da soma é " + str(soma))
# comentario
print(f"O resultado da soma é {soma}")

# ===== TP2: TP2\aula-01\exemplo3.py =====

# Calculo de area do triangulo
base = float(input("Digite o valor da base: "))
altura = float(input("Digite o valor da altura: "))
area = (base * altura) / 2

# Formatacao de numeros ':.{qtdCasas}.{tipo}
print(f"O valor da área é {area:.2f}")

# ===== TP2: TP2\aula-01\exemplo4.py =====

numero = float(input("Digite um numero: "))
potencia = numero ** 2
print(f"O valor de {numero}² é igual a {potencia}")
potencia = pow(numero, 2)
print(potencia)

# ===== TP2: TP2\aula-01\exercicios\exercicio1.py =====

altura = float(input("Insira a sua altura em metros: "))
centimetros = altura * 100
print(f"Sua altura em centímetros é {int(centimetros)}cm")


# ===== TP2: TP2\aula-01\exercicios\exercicio2.1.py =====

salario_mensal = 1500.00
bonus = 150.00
quantidade_itens = int(input("Insira a quantidade de itens vendidos: "))
salario_final = bonus * quantidade_itens + salario_mensal
print(f"Itens vendidos: {quantidade_itens}\n Salario final: {salario_final:.2f}")

# ===== TP2: TP2\aula-01\exercicios\exercicio2.2.py =====

parcela = float(input("Insira o valor da parcela: "))
taxa_juros = float(input("Insira a taxa de juros: "))
tempo = int(input("Insira quantidade de meses em atraso: "))
valor_atraso = parcela + (parcela * (taxa_juros / 100) * tempo)

print(f"Valor do produto com atraso: {valor_atraso}\n Juros: {taxa_juros}\n")

for i in range(tempo):
    print(f"Valor da parcela: {parcela}, juros: {taxa_juros}")


# ===== TP2: TP2\aula-01\exercicios\exercicio2.3.py =====

celsius = float(input("Insira a temperatura em Celsius: "))
fahrenheit = celsius * 1.8 + 32
print(f"{celsius}C é igual a {fahrenheit}F")

# ===== TP2: TP2\aula-01\exercicios\exercicio2.4.py =====

ano_nascimento = int(input("Insira seu ano de nascimento: "))
nome = input("Insira seu nome: ")
ano_atual = int(input("Insira o ano atual: "))
print(f"Olá, {nome.upper()} você tem {ano_atual - ano_nascimento} anos.")

# ===== TP2: TP2\aula-01\exercicios\exercicio2.5.py =====

custo_fabricacao = float(input("Insira de custo de fabricação da Pick-up: "))

imposto_distribuidor = (custo_fabricacao * .38)
outros_impostos = (custo_fabricacao * .47)
custo_final = custo_fabricacao + imposto_distribuidor + outros_impostos
print(f"Imposto distribuidor: {imposto_distribuidor:.2f}\nOutros impostos: {outros_impostos:.2f}\nCusto final: {custo_final:.2f}")

# ===== TP2: TP2\aula-01\exercicios\exercicio3.py =====

from math import pi
raio = float(input(f"Insira o valor do raio: "))
area = pi * (raio*raio)
print(f"A área com raio de {raio} é igual a {area}")

# ===== TP2: TP2\aula-01\exercicios\exercicio4.py =====

base = int(input("Insira o valor da base: "))
altura = int(input("Insira o valor da altura: "))
area = (base*altura)/2
print(f"Área do triangulo é {area}")

# ===== TP2: TP2\aula-01\exercicios\exercicio5.py =====

numero1 = int(input("Insira o primeiro numero: "))
numero2 = int(input("Insira o segundo numero: "))
adicao = numero1 + numero2
subtracao = numero1 - numero2
multplicacao = numero1 * numero2
divisao = numero1 / numero2
print(f"Adição: {adicao}\n Subtração: {subtracao}\n Divisão: {divisao}\n Multiplicação: {multplicacao}")

# ===== TP2: TP2\aula-01\exercicios\exercicio6.py =====

salario_mensal = float(input("Insira o seu salário mensal: R$ "))
pct_aumento = float(input("Insira a porcentagem de aumento: "))
novo_salario = (salario_mensal * pct_aumento)/100 + salario_mensal
print(f"Seu novo salário mensal com {pct_aumento}% de aumento fica igual a R$ {novo_salario:.2f}"
      + f"\nAntes era R$ {salario_mensal:.2f}. Diferença de {novo_salario - salario_mensal}")

# ===== TP2: TP2\aula-01\exercicios\exercicio7.py =====

nome = input("Insira seu nome: ")
idade = int(input("Insira sua idade em anos: "))
dias = idade*365
print(f"{nome} voce esta viva a {dias} dias")

# ===== TP2: TP2\aula-01\exercicios\exercicio8.py =====

numero1 = int(input("Insira o primeiro numero: "))
numero2 = int(input("Insira o segundo numero: "))
numero3 = int(input("Insira o terceiro numero: "))
soma = numero1 + numero2 + numero3
potencia = pow(soma, 2)
print(f"Soma: {soma}\n Potencia: {potencia}")


# ===== TP2: TP2\aula-01\exercicios\exericio2.py =====

distancia = int(input("Insira a distancia em metros: "))
tempo = int(input("Insira o tempo em segundos: "))
velocidade_media = distancia/tempo
print(f"Sua velocidade média foi de {velocidade_media}m/s")

# ===== TP2: TP2\aula-01\exercicios\exericio9.py =====

voto_nulo = int(input("Votos nulos: "))
voto_branco = int(input("Voto branco: "))
voto_valido = int(input("Voto valido: "))
total_eleitores = voto_branco + voto_nulo + voto_valido
percentual_branco = (voto_branco * 100) / total_eleitores
print(f"Voto nulo: {voto_nulo}\n Voto branco: {voto_branco}\n Voto válido: {voto_valido} \n"
      + f"Porcentagem votos brancos: {percentual_branco}\n Total de eleitores: {total_eleitores}")
