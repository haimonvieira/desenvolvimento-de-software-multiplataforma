---
disciplina: DSM3/TP2
titulo: exercicio5
fonte: DSM3/TP2/aula-03-while-for/exercicios/exercicio5.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
lista = ["Maria", "João", "Paulo", "Magali"]

print("Insira o nome que quer localizar da lista a seguir: ")
print(f"Lista: ", lista)
localizar = input("Insira o nome: ")

for nome in lista:
    if nome == localizar:
        print(nome)
        break
```
