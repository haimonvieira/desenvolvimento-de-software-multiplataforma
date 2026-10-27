from Cliente import CadastroCliente

class Principal:

    @staticmethod
    def main():
        # Instanciar objeto
        cliente = CadastroCliente()
        cliente.executar()

if __name__ == "__main__":
    Principal.main()

