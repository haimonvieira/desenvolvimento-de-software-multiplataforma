---
disciplina: DSM3/TP2
titulo: TP2 Aula04 OO
fonte: DSM3/TP2/notebook-sources/TP2-Aula04_OO.txt
tipo: txt
paginas: 0
extraido_em: 2026-10-24
---

# ===== TP2: TP2\aula04_OO\Exemplo1O_O.py =====

#criando Classe em Python
class Pessoa:
    #construtor = iniciar os atributo com valores
    def __init__(self,nome,idade):
        #definição de atributos público
        self.nome = nome
        self.idade = idade

    #método calcular Idade
    def calcularIdade(self):
        ano = int(input("Digite o ano atual: "))
        return ano- self.idade
#Instanciar o objeto da classe Pessoa
p1 = Pessoa('Kevin',21)
#chamar o método calcular idade
print(p1.calcularIdade())

# ===== TP2: TP2\aula04_OO\Exemplo2O_O\Principal.py =====

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

# ===== TP2: TP2\aula04_OO\Exemplo2O_O\Produtos.py =====

#define nome da classe
class Produto:
    #define o contrutor da classe incializando os atributos
    def __init__(self):
        #atributos private dois underline __ define o atributo como privado
        self.__nome = ""
        self.__valor = 0
        self.__quantidade = 0
    #Encapsulamento dos atributos
    #Pressione CTRL + Shift + p => Digite Generate Getter Setter

    @property
    def _nome(self):
        return self.__nome

    @_nome.setter
    def _nome(self, value):
        self.__nome = value

    @property
    def _valor(self):
        return self.__valor

    @_valor.setter
    def _valor(self, value):
        self.__valor = value

    @property
    def _quantidade(self):
        return self.__quantidade

    @_quantidade.setter
    def _quantidade(self, value):
        self.__quantidade = value

    #Método cadastrar produtos
    def cadastrarProduto(self):
        print("\n ===== Cadastro de Produtos =====")
        self.__nome = input("Digite o nome do Produto: ")
        self.__quantidade = int(input("Digite a quantidade: "))
        self.__valor = float(input("Digite o valor do Produto: "))
        print("Produto cadastrado com sucesso !!!!")

    #método mostra produto
    def mostrarProduto(self):
        print("\n == Dados do Produto ==")
        print("Nome do produto: ",self.__nome)
        print("Quantidade: ",self.__quantidade)
        print("Valor: ",self.__valor)

    #método com retorno calcular total
    def calcular_valor_total(self):
        return self.__valor * self.__quantidade

# ===== TP2: TP2\aula04_OO\exercicios\Contato\Contato.py =====

class Contato:

    def __init__(self):
        self.__nome = ""
        self.__telefone = ""
        self.__endereco = ""
        self.__cidade = ""

    @property
    def _nome(self):
        return self.__nome

    @_nome.setter
    def _nome(self, value):
        self.__nome = value

    @property
    def _telefone(self):
        return self.__telefone

    @_telefone.setter
    def _telefone(self, value):
        self.__telefone = value

    @property
    def _endereco(self):
        return self.__endereco

    @_endereco.setter
    def _endereco(self, value):
        self.__endereco = value

    @property
    def _cidade(self):
        return self.__cidade

    @_cidade.setter
    def _cidade(self, value):
        self.__cidade = value

    def cadastrarDados(self):
        print("\nCadastro de contato")
        self._nome = input("Insira o nome: ")
        self._telefone = input("Insira o telefone: ")
        self._endereco = input("Insira o endereço: ")
        self._cidade = input("Insira a cidade: ")

    def mostrarDados(self):
        print("==DADOS DO CONTATO==")
        print(f"Nome: {self._nome}\nTelefone: {self._telefone}\nEndereço: {self._endereco}\nCidade: {self._cidade}")

# ===== TP2: TP2\aula04_OO\exercicios\Contato\Principal.py =====

from Contato import Contato


class Principal:

    @staticmethod
    def main():
        contato = Contato()
        contato.cadastrarDados()
        contato.mostrarDados()

if __name__ == "__main__":
    Principal.main()

# ===== TP2: TP2\aula04_OO\exercicios\Fornecedor\Fornecedor.py =====

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


# ===== TP2: TP2\aula04_OO\exercicios\Fornecedor\Principal.py =====

from Fornecedor import Fornecedor

class Pricipal:

    @staticmethod
    def main():
        fornecedor = Fornecedor()
        fornecedor.cadastrarFornecedor()
        fornecedor.listarFornecedor()

if __name__ == "__main__":
    Pricipal.main()

# ===== TP2: TP2\aula04_OO\exercicios\Loja\Loja.py =====

class Loja:

    def __init__(self):
        self.__razaoSocial = ""
        self.__cpfCliente = ""
        self.__valorCompra = 0.00
        self.__qtdItensComprado = 0
        self.__valorTotalCompra = 0.00

    @property
    def _razaoSocial(self):
        return self.__razaoSocial

    @_razaoSocial.setter
    def _razaoSocial(self, value):
        self.__razaoSocial = value

    @property
    def _cpfCliente(self):
        return self.__cpfCliente

    @_cpfCliente.setter
    def _cpfCliente(self, value):
        self.__cpfCliente = value

    @property
    def _valorCompra(self):
        return self.__valorCompra

    @_valorCompra.setter
    def _valorCompra(self, value):
        self.__valorCompra = value

    @property
    def _qtdItensComprado(self):
        return self.__qtdItensComprado

    @_qtdItensComprado.setter
    def _qtdItensComprado(self, value):
        self.__qtdItensComprado = value

    @property
    def _valorTotalCompra(self):
        return self.__valorTotalCompra

    @_valorTotalCompra.setter
    def _valorTotalCompra(self, value):
        self.__valorTotalCompra = value

    def inserirDadosLoja(self):
        print("\n==Cadastro da Loja==")
        self.__razaoSocial = input("Insira a razao social: ")
        self.__cpfCliente = input("Insira o CPF do cliente: ")
        self.__valorCompra = float(input("Insira o valor da compra: R$ "))
        self.__qtdItensComprado = int(input("Insira a quantidade de itens: "))

    def mostrarDadosLoja(self):
        print("==Dados da Loja==")
        print(f"""
        Razão Social: {self.__razaoSocial}
        CPF: {self.__cpfCliente}
        Valor compra: {self.__valorCompra}
        Qtd. Itens: {self.__qtdItensComprado}
        Valor total da compra: {self._valorTotalCompra}
        """)

    def calcularCompraLoja(self):
        self.__valorTotalCompra = self._qtdItensComprado * self.__valorCompra
        return self.__valorTotalCompra


# ===== TP2: TP2\aula04_OO\exercicios\Loja\Principal.py =====

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

# ===== TP2: TP2\aula04_OO\exercicios\Matematica\Matematica.py =====

class Matematica:

    def __init__(self):
        self.__nota1 = 0.0
        self.__nota2 = 0.0
        self.__media = 0.0
        self.__nomeAluno = ""

    @property
    def _nota1(self):
        return self.__nota1

    @_nota1.setter
    def _nota1(self, value):
        self.__nota1 = value

    @property
    def _nota2(self):
        return self.__nota2

    @_nota2.setter
    def _nota2(self, value):
        self.__nota2 = value

    @property
    def _media(self):
        return self.__media

    @_media.setter
    def _media(self, value):
        self.__media = value

    @property
    def _nomeAluno(self):
        return self.__nomeAluno

    @_nomeAluno.setter
    def _nomeAluno(self, value):
        self.__nomeAluno = value

    def inserirNotas(self):
        print("==INSERIR NOTAS==")
        self._nomeAluno = input("Insira o nome do aluno: ")
        self._nota1 = float(input("Insira a nota 1: "))
        self._nota2 = float(input("Insira a nota 2: "))

    def calcularMedia(self):
        self._media = (self._nota1 + self._nota2) / 2
        return self._media

    def mostrarNomeMedia(self):
        print(f"Nome: {self._nomeAluno}\nMédia: {self._media}")

# ===== TP2: TP2\aula04_OO\exercicios\Matematica\Principal.py =====

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

# ===== TP2: TP2\aula04_OO\exercicios\Passagem\Passagem.py =====

class Passagem:
    def __init__(self):
        self.__nomePassageiro = ""
        self.__telefone = ""
        self.__rg = ""
        self.__localViagem = ""
        self.__data = ""
        self.__hoario = ""
        self.__numpoltrona = ""

    @property
    def _nomePassageiro(self):
        return self.__nomePassageiro

    @_nomePassageiro.setter
    def _nomePassageiro(self, value):
        self.__nomePassageiro = value

    @property
    def _telefone(self):
        return self.__telefone

    @_telefone.setter
    def _telefone(self, value):
        self.__telefone = value

    @property
    def _rg(self):
        return self.__rg

    @_rg.setter
    def _rg(self, value):
        self.__rg = value

    @property
    def _localViagem(self):
        return self.__localViagem

    @_localViagem.setter
    def _localViagem(self, value):
        self.__localViagem = value

    @property
    def _data(self):
        return self.__data

    @_data.setter
    def _data(self, value):
        self.__data = value

    @property
    def _hoario(self):
        return self.__hoario

    @_hoario.setter
    def _hoario(self, value):
        self.__hoario = value

    @property
    def _numpoltrona(self):
        return self.__numpoltrona

    @_numpoltrona.setter
    def _numpoltrona(self, value):
        self.__numpoltrona = value

    def cadastrarDadosPassageiro(self):
        print("\n==Cadastro de passageiro==")
        self.__nomePassageiro = input("Insira o nome: ")
        self.__telefone = input("Insira o telefone: ")
        self.__rg = input("Insira o RG: ")


    def cadastrarDadosPassagem(self):
        print("\n==Cadastro da passagem===")
        self.__localViagem = input("Insira o local: ")
        self.__data = input("Insira a data: ")
        self.__hoario = input("Insira o horario: ")
        self.__numpoltrona = input("Insira o numero da polterona: ")

    def mostrarDadosPassageiro(self):
        print("==Dados do Passageiro==")
        print(f"""
        Nome: {self.__nomePassageiro}
        Telefone: {self.__telefone}
        RG: {self.__rg}
        """)

    def mostrarDadosPassagem(self):
        print("==Dados da Passagem==")
        print(f"""
            Local: {self.__localViagem}
            Data: {self.__data}
            Horário: {self.__hoario}
            Poltrona: {self.__numpoltrona}
            """)


# ===== TP2: TP2\aula04_OO\exercicios\Passagem\Principal.py =====

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
