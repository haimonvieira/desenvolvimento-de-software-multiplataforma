from tkinter import *
from tkinter import ttk
import tkinter as tk
import pymongo
import sys


class CadastroCliente:

    def __init__(self):
        self.tela = Tk()
        self.tela.title("Exemplo MongoDB")
        self.tela.geometry("800x600")
        self.tela.configure(background="#000")

        # CRIAR BANCO DE DADOS MONGO
        # self.conexao = pymongo.MongoClient("mongodb://localhost:27017/")
        # # CRIA BASE DE DADOS
        # self.db = self.conexao["exemplo_clientes"]
        # # CRIA COLEÇÃO
        # self.collection = self.db["clientes"]
        self.criar_componentes()

    def criar_componentes(self):

        Label(
            self.tela,
            text="Cadastro de Clientes",
            font=("Arial", 30, "bold"),
            bg="#ffffff",
        ).place(x=200, y=50)

        Label(self.tela, text="Código:", bg="#ffffff").place(x=130, y=140)
        self.txt_codigo = Entry(self.tela, width=20)
        self.txt_codigo.place(x=190, y=140)

        Label(self.tela, text="Nome:", bg="#ffffff").place(x=130, y=170)
        self.txt_nome = Entry(self.tela, width=40)
        self.txt_nome.place(x=190, y=170)

        Label(self.tela, text="CPF:", bg="#ffffff").place(x=450, y=170)
        self.txt_cpf = Entry(self.tela, width=20)
        self.txt_cpf.place(x=480, y=170)

        Label(self.tela, text="Idade:", bg="#ffffff").place(x=130, y=200)
        self.txt_idade = Entry(self.tela, width=20)
        self.txt_idade.place(x=190, y=200)

        Label(self.tela, text="Rua:", bg="#ffffff").place(x=450, y=200)
        self.txt_end = Entry(self.tela, width=25)
        self.txt_end.place(x=480, y=200)

        Label(self.tela, text="Bairro:", bg="#ffffff").place(x=130, y=230)
        self.txt_bairro = Entry(self.tela, width=20)
        self.txt_bairro.place(x=190, y=230)

        Label(self.tela, text="Estado:", bg="#ffffff").place(x=330, y=230)
        self.comboestado = ttk.Combobox(
            self.tela,
            values=["São Paulo", "Rio de Janeiro", "Minas Gerais", "Espírito Santo"],
        )
        self.comboestado.place(x=370, y=230)

        Label(self.tela, text="Cidade:", bg="#ffffff").place(x=520, y=230)
        self.txt_cidade = Entry(self.tela, width=20)
        self.txt_cidade.place(x=570, y=230)

        self.lbl_resultado = Label(self.tela, text="", bg="#ffffff")
        self.lbl_resultado.place(x=490, y=410)

        # CRIANDO OS BOTÕES

        self.foto_salvar = PhotoImage(file="icones/salvar.png")
        self.foto_excluir = PhotoImage(file="icones/excluir.png")
        self.foto_alterar = PhotoImage(file="icones/alterar.png")
        self.foto_consultar = PhotoImage(file="icones/consultar.png")
        self.foto_sair = PhotoImage(file="icones/sair.png")

        self.btn_salvar = Button(
            self.tela,
            text="Salvar",
            image=self.foto_salvar,
            compound=TOP,
            command=self.salvar,
        )
        self.btn_salvar.place(x=130, y=280)

        self.btn_excluir = Button(
            self.tela,
            text="Excluir",
            image=self.foto_excluir,
            compound=TOP,
            command=self.excluir,
        )
        self.btn_excluir.place(x=220, y=280)

        self.btn_alterar = Button(
            self.tela,
            text="Alterar",
            image=self.foto_alterar,
            compound=TOP,
            command=self.atualizar,
        )
        self.btn_alterar.place(x=310, y=280)

        self.btn_consultar = Button(
            self.tela,
            text="Consultar",
            image=self.foto_consultar,
            compound=TOP,
            command=self.consultar,
        )
        self.btn_consultar.place(x=400, y=280)

        self.btn_sair = Button(
            self.tela,
            text="Sair",
            image=self.foto_sair,
            compound=RIGHT,
            command=self.sair,
        )
        self.btn_sair.place(x=490, y=280)

    def salvar(self):
        try:
            cliente = {
                "código": self.txt_codigo.get(),
                "nome": self.txt_nome.get(),
                "idade": int(self.txt_idade.get()),
                "endereço": self.txt_end.get(),
                "cpf": self.txt_cpf.get(),
                "bairro": self.txt_bairro.get(),
                "cidade": self.txt_cidade.get(),
                "estado": self.comboestado.get(),
            }

            self.collection.insert_one(cliente)
            self.limpar()
            self.lbl_resultado.config(text="Salvo com sucesso!")

        except:
            self.lbl_resultado.config(text="Erro ao salvar")

    def atualizar(self):
        codigo = self.txt_codigo.get()

        self.collection.update_one(
            {"código": codigo},
            {
                "$set": {
                    "nome": self.txt_nome.get(),
                    "idade": int(self.txt_idade.get()),
                    "endereço": self.txt_end.get(),
                    "cpf": self.txt_cpf.get(),
                    "bairro": self.txt_bairro.get(),
                    "cidade": self.txt_cidade.get(),
                    "estado": self.comboestado.get(),
                }
            },
        )

        self.limpar()
        self.lbl_resultado.config(text="Atualizado!")

    def excluir(self):
        codigo = self.txt_codigo.get()
        self.collection.delete_one({"código": codigo})
        self.limpar()
        self.lbl_resultado.config(text="Excluído!")

    def consultar(self):

        codigo = self.txt_codigo.get()
        resultado = self.collection.find_one({"código": codigo})

        if resultado:
            self.txt_nome.insert(END, resultado["nome"])
            self.txt_idade.insert(END, resultado["idade"])
            self.txt_end.insert(END, resultado["endereço"])
            self.txt_cpf.insert(END, resultado["cpf"])
            self.txt_bairro.insert(END, resultado["bairro"])
            self.txt_cidade.insert(END, resultado["cidade"])
            self.comboestado.set(resultado["estado"])
        else:
            self.lbl_resultado.config(text="Não encontrado")

    def limpar(self):
        self.txt_codigo.delete(0, END)
        self.txt_nome.delete(0, END)
        self.txt_idade.delete(0, END)
        self.txt_end.delete(0, END)
        self.txt_bairro.delete(0, END)
        self.txt_cidade.delete(0, END)
        self.txt_cpf.delete(0, END)
        self.comboestado.set("")

    def sair(self):
        sys.exit()

    def executar(self):
        self.tela.mainloop()
