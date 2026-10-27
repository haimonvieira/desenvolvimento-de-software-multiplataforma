---
disciplina: DSM3/TP2
titulo: exemplo8for split
fonte: DSM3/TP2/aula-03-while-for/exemplo8for-split.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
# A função split le varios valores
# só devemos digitar os valores com espaço

numero = input("Insira os números deixando espaço entre eles: ")

vetor = [
    int(num)
    for num in numero.split()
]

print("Valores armazenados: ", vetor)
```
