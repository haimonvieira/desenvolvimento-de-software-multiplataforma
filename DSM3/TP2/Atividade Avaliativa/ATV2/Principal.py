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
