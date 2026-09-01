class Passagem:
    def __init__(self):
        self.__nomePassageiro = ""
        self.__telefone = ""
        self.__rg = ""
        self.__localViagem = ""
        self.__data = ""
        self.__hoario = ""
        self.__numpoltrona = ""

    @property
    def _nomePassageiro(self):
        return self.__nomePassageiro

    @_nomePassageiro.setter
    def _nomePassageiro(self, value):
        self.__nomePassageiro = value

    @property
    def _telefone(self):
        return self.__telefone

    @_telefone.setter
    def _telefone(self, value):
        self.__telefone = value

    @property
    def _rg(self):
        return self.__rg

    @_rg.setter
    def _rg(self, value):
        self.__rg = value

    @property
    def _localViagem(self):
        return self.__localViagem

    @_localViagem.setter
    def _localViagem(self, value):
        self.__localViagem = value

    @property
    def _data(self):
        return self.__data

    @_data.setter
    def _data(self, value):
        self.__data = value

    @property
    def _hoario(self):
        return self.__hoario

    @_hoario.setter
    def _hoario(self, value):
        self.__hoario = value

    @property
    def _numpoltrona(self):
        return self.__numpoltrona

    @_numpoltrona.setter
    def _numpoltrona(self, value):
        self.__numpoltrona = value

    def cadastrarDadosPassageiro(self):
        print("\n==Cadastro de passageiro==")
        self.__nomePassageiro = input("Insira o nome: ")
        self.__telefone = input("Insira o telefone: ")
        self.__rg = input("Insira o RG: ")
        

    def cadastrarDadosPassagem(self):
        print("\n==Cadastro da passagem===")
        self.__localViagem = input("Insira o local: ")
        self.__data = input("Insira a data: ")
        self.__hoario = input("Insira o horario: ")
        self.__numpoltrona = input("Insira o numero da polterona: ")

    def mostrarDadosPassageiro(self):
        print("==Dados do Passageiro==")
        print(f"""
        Nome: {self.__nomePassageiro}
        Telefone: {self.__telefone}
        RG: {self.__rg}
        """)

    def mostrarDadosPassagem(self):
        print("==Dados da Passagem==")
        print(f"""
            Local: {self.__localViagem}
            Data: {self.__data}
            Horário: {self.__hoario}
            Poltrona: {self.__numpoltrona}
            """)
