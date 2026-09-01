from Fornecedor import Fornecedor

class Pricipal:

    @staticmethod
    def main():
        fornecedor = Fornecedor()
        fornecedor.cadastrarFornecedor()
        fornecedor.listarFornecedor()

if __name__ == "__main__":
    Pricipal.main()