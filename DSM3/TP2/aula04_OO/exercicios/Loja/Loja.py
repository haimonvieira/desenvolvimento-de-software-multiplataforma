class Loja:

    def __init__(self):
        self.__razaoSocial = ""
        self.__cpfCliente = ""
        self.__valorCompra = 0.00
        self.__qtdItensComprado = 0
        self.__valorTotalCompra = 0.00

    @property
    def _razaoSocial(self):
        return self.__razaoSocial

    @_razaoSocial.setter
    def _razaoSocial(self, value):
        self.__razaoSocial = value

    @property
    def _cpfCliente(self):
        return self.__cpfCliente

    @_cpfCliente.setter
    def _cpfCliente(self, value):
        self.__cpfCliente = value

    @property
    def _valorCompra(self):
        return self.__valorCompra

    @_valorCompra.setter
    def _valorCompra(self, value):
        self.__valorCompra = value

    @property
    def _qtdItensComprado(self):
        return self.__qtdItensComprado

    @_qtdItensComprado.setter
    def _qtdItensComprado(self, value):
        self.__qtdItensComprado = value

    @property
    def _valorTotalCompra(self):
        return self.__valorTotalCompra

    @_valorTotalCompra.setter
    def _valorTotalCompra(self, value):
        self.__valorTotalCompra = value

    def inserirDadosLoja(self):
        print("\n==Cadastro da Loja==")
        self.__razaoSocial = input("Insira a razao social: ")
        self.__cpfCliente = input("Insira o CPF do cliente: ")
        self.__valorCompra = float(input("Insira o valor da compra: R$ "))
        self.__qtdItensComprado = int(input("Insira a quantidade de itens: "))

    def mostrarDadosLoja(self):
        print("==Dados da Loja==")
        print(f"""
        Razão Social: {self.__razaoSocial}
        CPF: {self.__cpfCliente}
        Valor compra: {self.__valorCompra}
        Qtd. Itens: {self.__qtdItensComprado}
        Valor total da compra: {self._valorTotalCompra}
        """)

    def calcularCompraLoja(self):
        self.__valorTotalCompra = self._qtdItensComprado * self.__valorCompra
        return self.__valorTotalCompra
