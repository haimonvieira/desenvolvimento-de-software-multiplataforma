from Matematica import Matematica

class Principal:
    @staticmethod
    def main():
        matematica = Matematica()
        matematica.inserirNotas()
        matematica.calcularMedia()
        matematica.mostrarNomeMedia()


if __name__ == "__main__":
    Principal.main()