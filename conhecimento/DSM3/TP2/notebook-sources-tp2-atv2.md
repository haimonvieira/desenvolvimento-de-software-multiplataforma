---
disciplina: DSM3/TP2
titulo: TP2 ATV2
fonte: DSM3/TP2/notebook-sources/TP2-ATV2.txt
tipo: txt
paginas: 0
extraido_em: 2026-10-24
---

# ===== TP2: TP2\Atividade Avaliativa\ATV2\Cliente.py =====

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

# ===== TP2: TP2\Atividade Avaliativa\ATV2\Principal.py =====

from Cliente import Cliente
from Produto import Produto


clientes = []
produtos = []

class Principal:

    @staticmethod
    def main():

        while True:

            print("====SISTEMA DE VENDAS====\n")
            print("""
                1 - Cadastrar cliente
                2 - Cadastrar produto
                3 - Registrar venda
                4 - Listar clientes
                5 - Listar produtos
                0 - SAIR
            """)
            op = int(input("Escolha a opção: "))

            match op:

                case 1:
                    cliente = Cliente()
                    cliente.cadastrarCliente()
                    clientes.append(cliente)

                case 2:
                    produto = Produto()
                    produto.cadastrarProduto()
                    produtos.append(produto)

                case 3:
                    codigo = int(input("Insira o codigo do produto: "))

                    for produto in produtos:
                        if produto._codigo == codigo:
                            qtd = int(input("Insira quantidade: "))
                            produto._quantidade = qtd
                            produto.calcularVenda()

                case 4:
                    print("===Clientes===\n")
                    for cliente in clientes:
                        cliente.mostrarCliente()

                case 5:
                    print("===Produtos===")
                    for produto in produtos:
                        produto.mostrarProduto()

                case 0:
                    print("Saindo...")
                    break

                case _:
                    print("Opção inválida.")

if __name__ == "__main__":
    Principal.main()


# ===== TP2: TP2\Atividade Avaliativa\ATV2\Produto.py =====

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
