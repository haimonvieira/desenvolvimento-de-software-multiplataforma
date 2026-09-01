from Loja import Loja

class Pricipal:

    @staticmethod
    def main():
        loja = Loja()
        loja.inserirDadosLoja()
        loja.calcularCompraLoja()
        loja.mostrarDadosLoja()

if __name__ == "__main__":
    Pricipal.main()