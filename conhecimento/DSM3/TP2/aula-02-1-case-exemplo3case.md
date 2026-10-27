---
disciplina: DSM3/TP2
titulo: exemplo3case
fonte: DSM3/TP2/aula-02-1-case/exemplo3case.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
cla = input("Digite a classificação A, B ou C: ")

match cla.lower():
    case "A":
        print("A classificação está no nível 1")
    case "B":
        print("A classificação está no nível 2")
    case "C":
        print("A classificação está no nível 3")
    case _:
        print("Opção incorreta")
```
