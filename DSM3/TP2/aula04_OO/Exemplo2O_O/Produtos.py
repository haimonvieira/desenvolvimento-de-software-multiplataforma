#define nome da classe
class Produto:
    #define o contrutor da classe incializando os atributos
    def __init__(self):
        #atributos private dois underline __ define o atributo como privado
        self.__nome = ""
        self.__valor = 0
        self.__quantidade = 0
    #Encapsulamento dos atributos
    #Pressione CTRL + Shift + p => Digite Generate Getter Setter
    
    @property
    def _nome(self):
        return self.__nome

    @_nome.setter
    def _nome(self, value):
        self.__nome = value

    @property
    def _valor(self):
        return self.__valor

    @_valor.setter
    def _valor(self, value):
        self.__valor = value

    @property
    def _quantidade(self):
        return self.__quantidade

    @_quantidade.setter
    def _quantidade(self, value):
        self.__quantidade = value

    #Método cadastrar produtos
    def cadastrarProduto(self):
        print("\n ===== Cadastro de Produtos =====")
        self.__nome = input("Digite o nome do Produto: ")
        self.__quantidade = int(input("Digite a quantidade: "))
        self.__valor = float(input("Digite o valor do Produto: "))
        print("Produto cadastrado com sucesso !!!!")

    #método mostra produto
    def mostrarProduto(self):
        print("\n == Dados do Produto ==")
        print("Nome do produto: ",self.__nome)
        print("Quantidade: ",self.__quantidade)
        print("Valor: ",self.__valor)

    #método com retorno calcular total
    def calcular_valor_total(self):
        return self.__valor * self.__quantidade