class Contato:

    def __init__(self):
        self.__nome = ""
        self.__telefone = ""
        self.__endereco = ""
        self.__cidade = ""

    @property
    def _nome(self):
        return self.__nome

    @_nome.setter
    def _nome(self, value):
        self.__nome = value

    @property
    def _telefone(self):
        return self.__telefone

    @_telefone.setter
    def _telefone(self, value):
        self.__telefone = value

    @property
    def _endereco(self):
        return self.__endereco

    @_endereco.setter
    def _endereco(self, value):
        self.__endereco = value

    @property
    def _cidade(self):
        return self.__cidade

    @_cidade.setter
    def _cidade(self, value):
        self.__cidade = value

    def cadastrarDados(self):
        print("\nCadastro de contato")
        self._nome = input("Insira o nome: ")
        self._telefone = input("Insira o telefone: ")
        self._endereco = input("Insira o endereço: ")
        self._cidade = input("Insira a cidade: ")

    def mostrarDados(self):
        print("==DADOS DO CONTATO==")
        print(f"Nome: {self._nome}\nTelefone: {self._telefone}\nEndereço: {self._endereco}\nCidade: {self._cidade}")