---
disciplina: DSM3/TP2
titulo: exemplo2case
fonte: DSM3/TP2/aula-02-1-case/exemplo2case.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
op = int(input("Digite os numeros de 1 a 6: "))

match op:
    case 1|2|3:
        print("Digitou 1, 2 ou 3")
    case 4|5|6:
        print("Digitou 4, 5 ou 6")
    case _:
        print("Opção incorreta")
```
