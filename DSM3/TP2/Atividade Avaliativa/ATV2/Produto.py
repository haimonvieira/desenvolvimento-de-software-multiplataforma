class Produto:
    def __init__(self):
        self.__codigo = 0
        self.__nomeProduto = ""
        self.__quantidade = 0
        self.__preco = 0.00
        self.__total = 0.00

    @property
    def _codigo(self):
        return self.__codigo

    @_codigo.setter
    def _codigo(self, value):
        self.__codigo = value

    @property
    def _nomeProduto(self):
        return self.__nomeProduto

    @_nomeProduto.setter
    def _nomeProduto(self, value):
        self.__nomeProduto = value

    @property
    def _quantidade(self):
        return self.__quantidade

    @_quantidade.setter
    def _quantidade(self, value):
        self.__quantidade = value

    @property
    def _preco(self):
        return self.__preco

    @_preco.setter
    def _preco(self, value):
        self.__preco = value

    @property
    def _total(self):
        return self.__total

    @_total.setter
    def _total(self, value):
        self.__total = value

    def cadastrarProduto (self):
        print("===Cadastro de produto===\n")
        self._codigo = int(input("Insira o código: "))
        self._nomeProduto = input("Insira o nome do produto: ")
        self._preco = float(input("Insira o preço: "))

    def mostrarProduto(self):
        print("Código: ", self._codigo)
        print("Nome do produto: ", self._nomeProduto)
        print("Preço: R$ ", self._preco)
        print()

    def calcularVenda(self):
        self._total = self._preco * self._quantidade
        print("Total da venda: R$ ", self._total)