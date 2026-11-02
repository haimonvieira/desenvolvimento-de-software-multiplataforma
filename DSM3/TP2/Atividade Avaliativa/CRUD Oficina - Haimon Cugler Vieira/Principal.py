from OficinaMecanica import OficinaMecanica


class Principal:

    @staticmethod
    def main():
        # Instanciar objeto
        oficina = OficinaMecanica()
        oficina.executar()


if __name__ == "__main__":
    Principal.main()
