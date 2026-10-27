---
disciplina: DSM3/TP2
titulo: exercicio7
fonte: DSM3/TP2/aula-03-while-for/exercicios/exercicio7.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
nomes = []
for i in range(1, 8):
    nome = input(f"Digite o {i}º nome: ")
    nomes.append(nome)

cont = 1
print("Nomes digitados: ")
for nome in nomes: 
    print(f"O {cont}º nome é {nome.upper()}")
    cont += 1
```
