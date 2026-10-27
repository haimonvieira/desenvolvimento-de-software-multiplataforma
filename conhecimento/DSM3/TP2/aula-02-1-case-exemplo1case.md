---
disciplina: DSM3/TP2
titulo: exemplo1case
fonte: DSM3/TP2/aula-02-1-case/exemplo1case.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
op = int(input("""
1 - Sacar
2 - Extrato
0 - Sair
"""))

match op:
    case 1:
        print("Voce escolheu sacar")
    case 2:
        print("Voce escolheu ver o extrato")
    case 0:
        exit
    case _:
        print("Opção invalida")
```
