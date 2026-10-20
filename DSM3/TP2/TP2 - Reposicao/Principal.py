from Produto import Produto


class Principal:

    @staticmethod
    def main():
        # instanciação da classe com objeto Produto
        produto = Produto()
        produto.executar()


# Execução do programa
if __name__ == "__main__":
    Principal.main()
