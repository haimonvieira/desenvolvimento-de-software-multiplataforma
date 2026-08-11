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