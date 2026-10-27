---
disciplina: DSM3/TP2
titulo: exercicio8
fonte: DSM3/TP2/aula-03-while-for/exercicios/exercicio8.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
lista_numeros = []
for i in range(1, 11):
    num = int(input(f"Insira o {i}º número: "))
    lista_numeros.append(num)

for numero in lista_numeros:
    if numero % 2 == 0:
        print(f"O número {numero} é par")
    else:
        print(f"O número {numero} é ímpar")
```
