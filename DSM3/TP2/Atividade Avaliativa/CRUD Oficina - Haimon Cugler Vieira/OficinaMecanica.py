from tkinter import *
from tkinter import ttk
import sqlite3
import sys


class OficinaMecanica:

    def __init__(self):
        self.tela = Tk()
        self.tela.title("Oficina Mecânica")
        self.tela.geometry("900x650")
        self.tela.configure(background="#d9d9d9")

        self.criar_banco()
        self.criar_componentes()
        self.consultar_dados()

    # CRIAR BANCO DE DADOS SQLITE
    def criar_banco(self):
        self.conn = sqlite3.connect("oficina.db")
        self.cursor = self.conn.cursor()

        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS servicos (
                codigo INTEGER PRIMARY KEY,
                cliente TEXT,
                carro TEXT,
                placa TEXT,
                servico TEXT,
                valor REAL
            )
        """)

        self.conn.commit()

    def criar_componentes(self):
        Label(
            self.tela,
            text="Cadastro de Serviços - Oficina Mecânica",
            font=("Arial", 24, "bold"),
            bg="#d9d9d9",
        ).place(x=170, y=30)

        Label(self.tela, text="Código:", bg="#d9d9d9").place(x=80, y=110)
        self.txt_codigo = Entry(self.tela, width=20)
        self.txt_codigo.place(x=140, y=110)

        Label(self.tela, text="Cliente:", bg="#d9d9d9").place(x=330, y=110)
        self.txt_cliente = Entry(self.tela, width=35)
        self.txt_cliente.place(x=390, y=110)

        Label(self.tela, text="Carro:", bg="#d9d9d9").place(x=80, y=150)
        self.txt_carro = Entry(self.tela, width=30)
        self.txt_carro.place(x=140, y=150)

        Label(self.tela, text="Placa:", bg="#d9d9d9").place(x=430, y=150)
        self.txt_placa = Entry(self.tela, width=20)
        self.txt_placa.place(x=480, y=150)

        Label(self.tela, text="Serviço:", bg="#d9d9d9").place(x=80, y=190)
        self.txt_servico = Entry(self.tela, width=50)
        self.txt_servico.place(x=140, y=190)

        Label(self.tela, text="Valor:", bg="#d9d9d9").place(x=560, y=190)
        self.txt_valor = Entry(self.tela, width=15)
        self.txt_valor.place(x=610, y=190)

        self.lbl_resultado = Label(
            self.tela,
            text="",
            font=("Arial", 11, "bold"),
            bg="#d9d9d9",
        )
        self.lbl_resultado.place(x=700, y=290)

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
        self.btn_salvar.place(x=120, y=240)

        self.btn_excluir = Button(
            self.tela,
            text="Excluir",
            image=self.foto_excluir,
            compound=TOP,
            command=self.excluir,
        )
        self.btn_excluir.place(x=220, y=240)

        self.btn_alterar = Button(
            self.tela,
            text="Alterar",
            image=self.foto_alterar,
            compound=TOP,
            command=self.atualizar,
        )
        self.btn_alterar.place(x=320, y=240)

        self.btn_consultar = Button(
            self.tela,
            text="Consultar",
            image=self.foto_consultar,
            compound=TOP,
            command=self.consultar,
        )
        self.btn_consultar.place(x=420, y=240)

        self.btn_sair = Button(
            self.tela,
            text="Sair",
            image=self.foto_sair,
            compound=RIGHT,
            command=self.sair,
        )
        self.btn_sair.place(x=540, y=255)

        # TABELA PARA MOSTRAR OS DADOS
        self.tree = ttk.Treeview(
            self.tela,
            columns=("codigo", "cliente", "carro", "placa", "servico", "valor"),
            show="headings",
        )

        self.tree.heading("codigo", text="Código")
        self.tree.heading("cliente", text="Cliente")
        self.tree.heading("carro", text="Carro")
        self.tree.heading("placa", text="Placa")
        self.tree.heading("servico", text="Serviço")
        self.tree.heading("valor", text="Valor")

        self.tree.column("codigo", width=60)
        self.tree.column("cliente", width=150)
        self.tree.column("carro", width=130)
        self.tree.column("placa", width=90)
        self.tree.column("servico", width=180)
        self.tree.column("valor", width=90)

        self.tree.place(x=55, y=350, width=790, height=240)
        self.tree.bind("<ButtonRelease-1>", self.selecionar_item)

    # SALVAR DADOS SQLITE
    def salvar(self):
        try:
            self.cursor.execute(
                """
                INSERT INTO servicos
                (codigo, cliente, carro, placa, servico, valor)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    self.txt_codigo.get(),
                    self.txt_cliente.get(),
                    self.txt_carro.get(),
                    self.txt_placa.get(),
                    self.txt_servico.get(),
                    float(self.txt_valor.get()),
                ),
            )

            self.conn.commit()
            self.limpar()
            self.consultar_dados()
            self.lbl_resultado.config(text="Salvo com sucesso!")

        except:
            self.lbl_resultado.config(text="Erro ao salvar")

    # CONSULTAR DADOS PELO CÓDIGO
    def consultar(self):
        codigo = self.txt_codigo.get()

        self.cursor.execute(
            "SELECT codigo, cliente, carro, placa, servico, valor FROM servicos WHERE codigo=?",
            (codigo,),
        )

        resultado = self.cursor.fetchone()

        if resultado:
            self.txt_cliente.delete(0, END)
            self.txt_carro.delete(0, END)
            self.txt_placa.delete(0, END)
            self.txt_servico.delete(0, END)
            self.txt_valor.delete(0, END)

            self.txt_cliente.insert(END, resultado[1])
            self.txt_carro.insert(END, resultado[2])
            self.txt_placa.insert(END, resultado[3])
            self.txt_servico.insert(END, resultado[4])
            self.txt_valor.insert(END, resultado[5])

        else:
            self.lbl_resultado.config(text="Não encontrado")

    # LISTAR DADOS NA TABELA
    def consultar_dados(self):
        for item in self.tree.get_children():
            self.tree.delete(item)

        self.cursor.execute(
            "SELECT codigo, cliente, carro, placa, servico, valor FROM servicos"
        )

        for row in self.cursor.fetchall():
            self.tree.insert("", END, values=row)

    # SELECIONAR ITEM DA TABELA
    def selecionar_item(self, event):
        selecionado = self.tree.selection()

        if selecionado:
            item = selecionado[0]
            dados = self.tree.item(item, "values")

            self.limpar()

            self.txt_codigo.insert(0, dados[0])
            self.txt_cliente.insert(0, dados[1])
            self.txt_carro.insert(0, dados[2])
            self.txt_placa.insert(0, dados[3])
            self.txt_servico.insert(0, dados[4])
            self.txt_valor.insert(0, dados[5])

    # ATUALIZAR DADOS SQLITE
    def atualizar(self):
        try:
            self.cursor.execute(
                """
                UPDATE servicos SET
                    cliente=?,
                    carro=?,
                    placa=?,
                    servico=?,
                    valor=?
                WHERE codigo=?
                """,
                (
                    self.txt_cliente.get(),
                    self.txt_carro.get(),
                    self.txt_placa.get(),
                    self.txt_servico.get(),
                    float(self.txt_valor.get()),
                    self.txt_codigo.get(),
                ),
            )

            self.conn.commit()
            self.limpar()
            self.consultar_dados()
            self.lbl_resultado.config(text="Atualizado!")

        except:
            self.lbl_resultado.config(text="Erro ao atualizar")

    # EXCLUIR DADOS SQLITE
    def excluir(self):
        try:
            self.cursor.execute(
                "DELETE FROM servicos WHERE codigo=?",
                (self.txt_codigo.get(),),
            )

            self.conn.commit()
            self.limpar()
            self.consultar_dados()
            self.lbl_resultado.config(text="Excluído!")

        except:
            self.lbl_resultado.config(text="Erro ao excluir")

    def limpar(self):
        self.txt_codigo.delete(0, END)
        self.txt_cliente.delete(0, END)
        self.txt_carro.delete(0, END)
        self.txt_placa.delete(0, END)
        self.txt_servico.delete(0, END)
        self.txt_valor.delete(0, END)

    def sair(self):
        self.conn.close()
        self.tela.destroy()
        sys.exit()

    def executar(self):
        self.tela.mainloop()
