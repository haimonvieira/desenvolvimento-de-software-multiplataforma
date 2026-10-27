---
disciplina: DSM3/TP2
titulo: exemplo3for
fonte: DSM3/TP2/aula-03-while-for/exemplo3for.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
localiza = input("Insira a fruta que quer buscar: ")
frutas = ["banana", "maça", "manga", "abacate", "pera", "kiwi"]

for fruta in frutas:
    if fruta == localiza:
        print(f"{fruta}, fruta encontrada")
        break
    else:
        print(f"{localiza}, não foi encontrada até o momento")
```
