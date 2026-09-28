class Cliente:

    def __init__(self):
        self.__codigo = 0
        self.__nomeCliente = ""
        self.__cpf = ""
        self.__telefone = ""
        self.__endereco = ""

    @property
    def _codigo(self):
        return self.__codigo

    @_codigo.setter
    def _codigo(self, value):
        self.__codigo = value

    @property
    def _nomeCliente(self):
        return self.__nomeCliente

    @_nomeCliente.setter
    def _nomeCliente(self, value):
        self.__nomeCliente = value

    @property
    def _cpf(self):
        return self.__cpf

    @_cpf.setter
    def _cpf(self, value):
        self.__cpf = value

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

    def cadastrarCliente(self):
        print("===Cadastrar cliente===\n")
        self._codigo = int(input("Insira o código: "))
        self._nomeCliente = input("Insira o nome do cliente: ")
        self._cpf = input("Insira o CPF: ")
        self._telefone = input("Insira o telefone: ")
        self._endereco = input("Insira o endereço: ")

    def mostrarCliente(self):
        print("Código: ", self._codigo)
        print("Nome: " + self._nomeCliente)
        print("CPF: " + self._cpf)
        print("Telefone: " + self._telefone)
        print("Endereço: " + self._endereco)
        print()