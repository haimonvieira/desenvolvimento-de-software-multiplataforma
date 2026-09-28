from tkinter import *

tela = Tk()

tela.title("Fatec Registro")
tela.configure(background="firebrick")
# Definindo tamanho da tela
tela.geometry("700x500")
#para nao redimensionar a tela
tela.resizable(False, False)
# Definie tamanhos maximos e minimos da tela
tela.maxsize(width=800, height=700)
tela.minsize(width=500, height=300)

#Mostrar texto
lbl_nome = Label(tela, text="Nome", bg="firebrick", fg="white", font="sans-serif 12 bold").place(x = 10, y = 20)
txt_nome = Entry(tela, width=30, borderwidth=1, font="sans-serif 11")
txt_nome.place(x=70, y=20)

lbl_end= Label(tela, text="Endereço", bg="firebrick", fg="white", font="sans-serif 12 bold").place(x = 10, y = 50)
txt_end = Entry(tela, width=30, borderwidth=1, font="sans-serif 11")
txt_end.place(x=100, y=50)

#funcao mostrarMsg
def mostrarMsg():
    lbl_msg = Label(tela, text="Bem vindo " + txt_nome.get())
    lbl_msg.place(x=80, y=110)

#botao
btn_botao = Button(tela, text="Mostrar", font="sans-serif 12 bold", command=mostrarMsg)
btn_botao.place(x=170, y=130)

# Comando para executar a tela
tela.mainloop()