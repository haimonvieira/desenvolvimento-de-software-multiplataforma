---
disciplina: DSM3/TP2
titulo: exercicio1
fonte: DSM3/TP2/aula-02-1-case/exercicios/exercicio1.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
is_vogal = input("Insira uma vogal ou consoante: ")

match is_vogal.lower():
    case "a"|"e"|"i"|"o"|"u":
        print("Vogal")
    case _:
        print("Consoante")
```
