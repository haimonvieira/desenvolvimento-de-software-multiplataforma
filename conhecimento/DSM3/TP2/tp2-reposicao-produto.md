---
disciplina: DSM3/TP2
titulo: Produto
fonte: DSM3/TP2/TP2 - Reposicao/Produto.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
from tkinter import *
from tkinter import ttk
import sqlite3


class Produto:

    def __init__(self):
        self.tela = Tk()

        self.configurar_tela()
        self.criar_componentes()
        self.criar_banco()
        self.consultarProduto()

    # CONFIGURAÇÃO DA TELA
    def configurar_tela(self):
        self.tela.title("Controle de Produtos")
        self.tela.configure(background="#d3d3d3")

        largura = 760
        altura = 520

        largura_screen = self.tela.winfo_screenwidth()
        altura_screen = self.tela.winfo_screenheight()

        posx = largura_screen / 2 - largura / 2
        posy = altura_screen / 2 - altura / 2

        self.tela.geometry("%dx%d+%d+%d" % (largura, altura, posx, posy))

    # CRIAÇÃO DOS COMPONENTES
    def criar_componentes(self):

        self.lbl_titulo = Label(
            self.tela,
            text="Cadastro de Produtos",
            font=("Arial", 18, "bold"),
            bg="#d3d3d3",
        )
        self.lbl_titulo.place(x=255, y=20)

        self.lbl_codigo = Label(self.tela, text="Código:", bg="#d3d3d3")
        self.lbl_codigo.place(x=70, y=85)

        self.txt_codigo = Entry(self.tela, width=12)
        self.txt_codigo.place(x=150, y=85)

        self.lbl_nomeProduto = Label(self.tela, text="Nome Produto:", bg="#d3d3d3")
        self.lbl_nomeProduto.place(x=70, y=125)

        self.txt_nomeProduto = Entry(self.tela, width=30)
        self.txt_nomeProduto.place(x=170, y=125)

        self.lbl_quantidade = Label(self.tela, text="Quantidade:", bg="#d3d3d3")
        self.lbl_quantidade.place(x=410, y=85)

        self.txt_quantidade = Entry(self.tela, width=12)
        self.txt_quantidade.place(x=500, y=85)

        self.lbl_preco = Label(self.tela, text="Preço:", bg="#d3d3d3")
        self.lbl_preco.place(x=410, y=125)

        self.txt_preco = Entry(self.tela, width=12)
        self.txt_preco.place(x=500, y=125)

        # ÍCONES
        self.foto_salvar = PhotoImage(file="icons/salvar.png")
        self.foto_excluir = PhotoImage(file="icons/excluir.png")
        self.foto_editar = PhotoImage(file="icons/editar.png")
        self.foto_limpar = PhotoImage(file="icons/limpar.png")

        self.btn_cadastrar = Button(
            self.tela,
            text="Cadastrar",
            image=self.foto_salvar,
            compound=TOP,
            command=self.cadastrarProduto,
            width=80,
            height=75,
        )
        self.btn_cadastrar.place(x=165, y=210)

        self.btn_excluir = Button(
            self.tela,
            text="Excluir",
            image=self.foto_excluir,
            compound=TOP,
            command=self.excluirProduto,
            width=80,
            height=75,
        )
        self.btn_excluir.place(x=285, y=210)

        self.btn_alterar = Button(
            self.tela,
            text="Alterar",
            image=self.foto_editar,
            compound=TOP,
            command=self.alterarProduto,
            width=80,
            height=75,
        )
        self.btn_alterar.place(x=405, y=210)

        self.btn_limpar = Button(
            self.tela,
            text="Limpar",
            image=self.foto_limpar,
            compound=TOP,
            command=self.limparCampos,
            width=80,
            height=75,
        )
        self.btn_limpar.place(x=525, y=210)

        # TABELA
        self.tree = ttk.Treeview(
            self.tela,
            columns=("codigo", "nomeProduto", "quantidade", "preco", "total"),
            show="headings",
        )

        self.tree.heading("codigo", text="Código")
        self.tree.heading("nomeProduto", text="Nome Produto")
        self.tree.heading("quantidade", text="Quantidade")
        self.tree.heading("preco", text="Preço")
        self.tree.heading("total", text="Total")

        self.tree.column("codigo", width=70)
        self.tree.column("nomeProduto", width=210)
        self.tree.column("quantidade", width=90)
        self.tree.column("preco", width=90)
        self.tree.column("total", width=90)

        self.tree.place(x=70, y=320, width=620, height=170)

        self.tree.bind("<ButtonRelease-1>", self.selecionar_item)

    # CRIAR BANCO DE DADOS SQLITE
    def criar_banco(self):
        self.conn = sqlite3.connect("produtos.db")
        self.cursor = self.conn.cursor()

        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS produtos (
                codigo INTEGER PRIMARY KEY,
                nomeProduto TEXT,
                quantidade INTEGER,
                preco REAL,
                total REAL
            )
        """)

        self.conn.commit()

    # CADASTRAR PRODUTO
    def cadastrarProduto(self):
        quantidade = int(self.txt_quantidade.get())
        preco = float(self.txt_preco.get().replace(",", "."))
        total = quantidade * preco

        self.cursor.execute(
            """
            INSERT INTO produtos (
                codigo,
                nomeProduto,
                quantidade,
                preco,
                total
            )
            VALUES (?, ?, ?, ?, ?)
        """,
            (
                self.txt_codigo.get(),
                self.txt_nomeProduto.get(),
                quantidade,
                preco,
                total,
            ),
        )

        self.conn.commit()
        self.consultarProduto()

    # CONSULTAR PRODUTO
    def consultarProduto(self):
        for item in self.tree.get_children():
            self.tree.delete(item)

        self.cursor.execute("""
            SELECT codigo, nomeProduto, quantidade, preco, total
            FROM produtos
        """)

        for row in self.cursor.fetchall():
            self.tree.insert("", "end", values=row)

    # SELECIONAR ITEM DA TABELA
    def selecionar_item(self, event):
        item = self.tree.selection()[0]
        dados = self.tree.item(item, "values")

        self.txt_codigo.delete(0, END)
        self.txt_codigo.insert(0, dados[0])

        self.txt_nomeProduto.delete(0, END)
        self.txt_nomeProduto.insert(0, dados[1])

        self.txt_quantidade.delete(0, END)
        self.txt_quantidade.insert(0, dados[2])

        self.txt_preco.delete(0, END)
        self.txt_preco.insert(0, dados[3])

    # ALTERAR PRODUTO
    def alterarProduto(self):
        quantidade = int(self.txt_quantidade.get())
        preco = float(self.txt_preco.get().replace(",", "."))
        total = quantidade * preco

        self.cursor.execute(
            """
            UPDATE produtos SET
                nomeProduto=?,
                quantidade=?,
                preco=?,
                total=?
            WHERE codigo=?
        """,
            (
                self.txt_nomeProduto.get(),
                quantidade,
                preco,
                total,
                self.txt_codigo.get(),
            ),
        )

        self.conn.commit()
        self.consultarProduto()

    # EXCLUIR PRODUTO
    def excluirProduto(self):
        self.cursor.execute(
            "DELETE FROM produtos WHERE codigo=?", (self.txt_codigo.get(),)
        )

        self.conn.commit()
        self.consultarProduto()

    def limparCampos(self):
        self.txt_codigo.delete(0, END)
        self.txt_nomeProduto.delete(0, END)
        self.txt_quantidade.delete(0, END)
        self.txt_preco.delete(0, END)

    # EXECUTAR
    def executar(self):
        self.tela.mainloop()
```
