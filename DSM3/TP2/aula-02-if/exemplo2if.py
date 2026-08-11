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