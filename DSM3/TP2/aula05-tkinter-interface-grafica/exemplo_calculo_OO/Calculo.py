from tkinter import *

class Calculadora:

    def __init__(self):
        self.tela = Tk()
        self.configurar_tela()
        self.criar_layout()
        self.__n1 = 0
        self.__n2 = 0
        self.__soma = 0

    @property
    def _n1(self):
        return self.__n1

    @_n1.setter
    def _n1(self, value):
        self.__n1 = value

    @property
    def _n2(self):
        return self.__n2

    @_n2.setter
    def _n2(self, value):
        self.__n2 = value

    @property
    def _soma(self):
        return self.__soma

    @_soma.setter
    def _soma(self, value):
        self.__soma = value

    def configurar_tela(self):
        tela = Tk()
        tela.title("Calculo Soma")
        tela.configure(background="purple")
        tela.geometry("400x300")
        tela.resizable(True, True)

    def criar_layout(self):
        #titulo
        self.lblTitulo = Label(self.tela, text="Calculo Soma", font="MS Sans Serif 12 bold")
        self.lblTitulo.pack()

        #numero 1
        self.lblNum1 = Label(self.tela, text="Número 1", font="MS Sans Serif 12 bold")
        self.lblNum1.place(x=10, y=45)
        #numero1 ciaxa texto
        self.txtNum1 = Entry(self.tela, font="MS Sans Serif 12", width=15)
        self.txtNum1.place(x=165, y=45)

        #numero 2
        self.lblNum2 = Label(self.tela, text="Número 2", font="MS Sans Serif 12 bold")
        self.lblNum2.place(x=10, y=75)
        #numero2 ciaxa texto
        self.txtNum2 = Entry(self.tela, font="MS Sans Serif 12", width=15)
        self.txtNum2.place(x=165, y=75)

        # resultado
        self.lblResultado = Label(self.tela, text="Resultado", font="MS Sans Serif 12 bold")
        self.lblResultado.place(x=10, y=105)
        #caixa texto
        self.txtResultado = Entry(self.tela, font="MS Sans Serif 12", width=15)
        self.txtResultado.place(x=165, y=105)

        #botao calcular
        self.btn = Button(self.tela, text="Calcular", font="MS Sans Serif 12 bold", command=self.calcular)
        self.btn.place(x=80, y=135)

    def calcular(self):
        self._n1 = float(self.txtNum1.get())
        self._n2 = float(self.txtNum2.get())
        self._soma = self._n1 + self._n2

        #Mostrar valor caixa de texto
        self.txtResultado.delete(0, END) # limpa caixa de texto
        self.txtResultado.insert(0, self._soma)

    def executar(self):
        self.tela.mainloop()