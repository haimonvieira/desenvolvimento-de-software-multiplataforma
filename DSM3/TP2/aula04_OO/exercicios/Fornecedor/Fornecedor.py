class Fornecedor:
    def __init__(self):
        self.__nomeFornecedor = ""
        self.__nomeProduto = ""
        self.__descricao = ""

    @property
    def _nomeFornecedor(self):
        return self.__nomeFornecedor

    @_nomeFornecedor.setter
    def _nomeFornecedor(self, value):
        self.__nomeFornecedor = value

    @property
    def _nomeProduto(self):
        return self.__nomeProduto

    @_nomeProduto.setter
    def _nomeProduto(self, value):
        self.__nomeProduto = value

    @property
    def _descricao(self):
        return self.__descricao

    @_descricao.setter
    def _descricao(self, value):
        self.__descricao = value

    def cadastrarFornecedor(self):
        print("\nCadastro de fornecedor")
        self._nomeFornecedor = input("Insira o nome do fornecedor: ")
        self.__nomeProduto = input("Insira o nome do produto: ")
        self._descricao = input("Insira a descrição: ")

    def listarFornecedor(self):
        print("==Dados do Fornecedor==")
        print(f"""
        Fornecedor: {self._nomeFornecedor}
        Produto: {self._nomeProduto}
        Descrição: {self._descricao}
        """)
