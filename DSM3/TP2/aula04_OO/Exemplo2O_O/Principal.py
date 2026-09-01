#define o arquivo Produtos importando a classe Produtos
from Produtos import Produto

class Principal:
    #static method define que a classe Principal terá um método estatico chamado main
    @staticmethod
    def main():
        #instanciar o objeto prod da classe Produto
        prod = Produto()
        prod.cadastrarProduto()
        prod.mostrarProduto()
        print("O valor total a pagar é R$ ",prod.calcular_valor_total())

#Inicializamos o método main da classe Principal
if __name__ == "__main__":
    Principal.main()