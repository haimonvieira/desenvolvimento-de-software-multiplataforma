---
disciplina: DSM3/TP2
titulo: exercicio3
fonte: DSM3/TP2/aula-02-if/exercicios/exercicio3.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
altura = float(input("Insira sua altura (em m): "))
sexo = input("Informe seu sexo (M/F): ")

if sexo.upper() == "M":
    peso_ideal = (72.7 * altura) - 58
elif sexo.upper() == "F":
    peso_ideal = (62.1 * altura) - 44.7
else:
    print("Sexo invalido")

print(f"Altura: {altura:.2f}\nSexo: {sexo}\nPeso ideal: {peso_ideal:.2f}")
```
