---
disciplina: DSM3/TP2
titulo: Exemplo1O O
fonte: DSM3/TP2/aula04_OO/Exemplo1O_O.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
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
```
