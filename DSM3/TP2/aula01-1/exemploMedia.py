aluno = input("Insira seu nome: ")
nota1 = float(input("Insira primeira nota: "))
nota2 = float(input("Insira a segunda nota: "))

media = (nota1 + nota2) / 2
print(f"o aluno {aluno} obteve a média de {media:.2f}")
print("O aluno " + aluno + " teve a media " + str(media))