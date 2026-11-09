from tkinter import *
tela = Tk()
tela.title("Calculo Média")
tela.configure(background='#134abd')
tela.geometry("700x600")

lbl_nome= Label(tela, text="Digite o nome: ", font="Arial 15 bold italic", bg= '#134abd',fg='#f0ffff')
lbl_nome.place(x=10, y=15)
txt_nome= Entry(tela, width=20, borderwidth=5, fg="blue")
txt_nome.place(x=265, y=15)
txt_nome.insert(0,"")

lbl_nota1= Label(tela, text="Digite a primeira nota: ", font="Arial 15 bold italic", bg= '#134abd',fg='#f0ffff')
lbl_nota1.place(x=10, y=45)
txt_nota1 = Entry(tela, width=20, borderwidth=5, fg="blue")
txt_nota1.place(x=265, y=45)
txt_nota1.insert(0,"")

lbl_nota2= Label(tela, text="Digite a segunda nota:  ", font="Arial 15 bold italic", bg= '#134abd',fg='#f0ffff')
lbl_nota2.place(x=10, y=85)
txt_nota2 = Entry(tela, width=20, borderwidth=5, fg="blue")
txt_nota2.place(x=278, y=85)
txt_nota2.insert(0,"")

lbl_nota3= Label(tela, text="Digite a terceira nota:  ", font="Arial 15 bold italic", bg= '#134abd',fg='#f0ffff')
lbl_nota3.place(x=10, y=125)
txt_nota3 = Entry(tela, width=20, borderwidth=5, fg="blue")
txt_nota3.place(x=278, y=125)
txt_nota3.insert(0,"")

lbl_nota4= Label(tela, text="Digite a quarta nota:  ", font="Arial 15 bold italic", bg= '#134abd',fg='#f0ffff')
lbl_nota4.place(x=10, y=165)
txt_nota4 = Entry(tela, width=20, borderwidth=5, fg="blue")
txt_nota4.place(x=278, y=165)
txt_nota4.insert(0,"")

lbl_nota5= Label(tela, text="Digite a quinta nota:  ", font="Arial 15 bold italic", bg= '#134abd',fg='#f0ffff')
lbl_nota5.place(x=10, y=195)
txt_nota5 = Entry(tela, width=20, borderwidth=5, fg="blue")
txt_nota5.place(x=278, y=195)
txt_nota5.insert(0,"")


lbl_resul= Label(tela, text="Resultado: ", font="Arial 15 bold italic", bg= '#1ac',fg='#f0ffff')
lbl_resul.place(x=10, y=225)
txt_resul = Entry(tela, width=20, borderwidth=5, fg="blue")
txt_resul.place(x=125, y=225)


#definindo a função calcular media
def calcularMedia():
   media = (float(txt_nota1.get()) + float(txt_nota2.get()) + float(txt_nota3.get()) + float(txt_nota4.get()) + float(txt_nota5.get()))/5
   txt_resul.delete(0,END)
   txt_resul.insert(0, str(round(media,2)))
 
   if media >= 5: 
       lbl_ola = Label(tela, text="Resultado Média: " + str(round(media,2)) + "\n " + txt_nome.get()+ " Aluno Aprovado",font="Arial 25 bold ", bg='#abfd0a')
       lbl_ola.place(x=205, y=235)  
   else:
       lbl_ola = Label(tela, text="Resultado Média: " + str(round(media,2)) + "\n " + txt_nome.get()+ " Aluno Reprovado",font="Arial 25 bold ", bg='#abfd0a')
       lbl_ola.place(x=205, y=235) 

#colocando botão 
btn_botao = Button(tela,text="Calcular Média",font="Arial 25 bold ", bg='#D4A', command=calcularMedia, width="30")
btn_botao.place(x=25, y=325)
#executa tela
tela.mainloop()