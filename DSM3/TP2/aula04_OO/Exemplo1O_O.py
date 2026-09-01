#criando Classe em Python
class Pessoa:
    #construtor = iniciar os atributo com valores
    def __init__(self,nome,idade):
        #definição de atributos público
        self.nome = nome
        self.idade = idade

    #método calcular Idade
    def calcularIdade(self):
        ano = int(input("Digite o ano atual: "))
        return ano- self.idade
#Instanciar o objeto da classe Pessoa
p1 = Pessoa('Kevin',21)
#chamar o método calcular idade
print(p1.calcularIdade())