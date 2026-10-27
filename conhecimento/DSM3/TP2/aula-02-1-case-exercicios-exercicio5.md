---
disciplina: DSM3/TP2
titulo: exercicio5
fonte: DSM3/TP2/aula-02-1-case/exercicios/exercicio5.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
categoria = input("Insira sua categoria(A, B ou C): ")
salario = float(input("Insira seu salário: R$ "))

match categoria.lower():
    case 'a':
        salario_final = salario + salario * .1
    case 'b':
        salario_final = salario + salario * .15
    case 'c': 
        salario_final = salario + salario * .25
    case _:
        print("Opção inválida")

print(f"""
Salário atual: R$ {salario:.2f}
Salário com aumento: R$ {salario_final:.2f}
""")
```
