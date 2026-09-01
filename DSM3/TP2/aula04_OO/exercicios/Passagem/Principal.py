from Passagem import Passagem

class Pricipal:

    @staticmethod
    def main():
        passageiro = Passagem()
        passageiro.cadastrarDadosPassageiro()
        passageiro.cadastrarDadosPassagem()
        passageiro.mostrarDadosPassageiro()
        passageiro.mostrarDadosPassagem()

if __name__ == "__main__":
    Pricipal.main()