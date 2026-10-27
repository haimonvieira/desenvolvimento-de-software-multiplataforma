---
disciplina: DSM3/TP2
titulo: exemplo6for vetor
fonte: DSM3/TP2/aula-03-while-for/exemplo6for-vetor.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
# le os valores e armazena em uma lista (vetor)
# comando append para adicionar os dados no vetor

lista = []

# Armazenar 5 numeros na lista
for i in range(1, 6):
    num = int(input(f"Insira o {i}º número: "))
    lista.append(num)
print("Números armazenados na lista: ")

# Mostrar os numeros armazenados na lista
for i in lista:
    print(i)
```
