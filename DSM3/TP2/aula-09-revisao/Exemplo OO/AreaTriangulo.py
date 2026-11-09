
from tkinter import *

class Triangulo:

    def __init__(self):
        self.tela = Tk()
        self.configurar_tela()
        self.criar_componentes()
    
    def configurar_tela(self):
        self.tela.title("Calculo Area Triângulo")
        self.tela.geometry("700x600")
        self.tela.config(bg="#ADD8E6")  
    
    def criar_componentes(self):
        
      self.lbl_base= Label(self.tela, text="Digite o valor da base: ", font="Arial 15 bold italic", bg= '#134abd',fg='#f0ffff')
      self.lbl_base.place(x=10, y=15)
      self.txt_base= Entry(self.tela, width=20, borderwidth=5, fg="blue")
      self.txt_base.place(x=265, y=15)

      self.lbl_altura= Label(self.tela, text="Digite o valor da altura: ", font="Arial 15 bold italic", bg= '#134abd',fg='#f0ffff')
      self.lbl_altura.place(x=10, y=45)
      self.txt_altura = Entry(self.tela, width=20, borderwidth=5, fg="blue")
      self.txt_altura.place(x=265, y=45)


      self.lbl_resul= Label(self.tela, text="Resultado: ", font="Arial 15 bold italic", bg= '#1ac',fg='#f0ffff')
      self.lbl_resul.place(x=10, y=115)
      self.txt_resul = Entry(self.tela, width=20, borderwidth=5, fg="blue")
      self.txt_resul.place(x=125, y=115)
      
      self.lbl_res = Label(self.tela, font="Arial 25 bold ", bg='#abfd0a')
      self.lbl_res.place(x=205, y=235)  
      
      #colocando botão 
      self.btn_botao = Button(self.tela,text="Calcular Área",font="Arial 25 bold ", bg='#D4A', command=self.calcular_area, width="30")
      self.btn_botao.place(x=25, y=325)


    def calcular_area(self):
  
      area = (float(self.txt_base.get()) * float(self.txt_altura.get()))/2
      #self.txt_resul.delete(0,END)
      self.txt_resul.insert(0,f"O valor da area é {area:.2f}")
      
      # MOSTRA RESULTADO LABEL
      self.lbl_res.config(text=f"Area do Triângulo: {area:.2f}")

      # MOSTRA RESULTADO CAIXA DE TEXTO
      self.txt_resul.delete(0, END)
      self.txt_resul.insert(0, f"{area:.2f}")


    def executar(self):
        self.tela.mainloop()