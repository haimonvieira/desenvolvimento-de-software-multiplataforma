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