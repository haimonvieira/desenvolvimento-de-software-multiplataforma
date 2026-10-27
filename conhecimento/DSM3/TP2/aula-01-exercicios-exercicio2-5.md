---
disciplina: DSM3/TP2
titulo: exercicio2.5
fonte: DSM3/TP2/aula-01/exercicios/exercicio2.5.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
custo_fabricacao = float(input("Insira de custo de fabricação da Pick-up: "))

imposto_distribuidor = (custo_fabricacao * .38)
outros_impostos = (custo_fabricacao * .47)
custo_final = custo_fabricacao + imposto_distribuidor + outros_impostos
print(f"Imposto distribuidor: {imposto_distribuidor:.2f}\nOutros impostos: {outros_impostos:.2f}\nCusto final: {custo_final:.2f}")
```
