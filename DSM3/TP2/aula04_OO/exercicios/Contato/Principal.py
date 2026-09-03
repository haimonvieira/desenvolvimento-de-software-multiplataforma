from Contato import Contato


class Principal:

    @staticmethod
    def main():
        contato = Contato()
        contato.cadastrarDados()
        contato.mostrarDados()

if __name__ == "__main__":
    Principal.main()