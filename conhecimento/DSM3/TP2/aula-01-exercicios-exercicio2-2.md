---
disciplina: DSM3/TP2
titulo: exercicio2.2
fonte: DSM3/TP2/aula-01/exercicios/exercicio2.2.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
parcela = float(input("Insira o valor da parcela: "))
taxa_juros = float(input("Insira a taxa de juros: "))
tempo = int(input("Insira quantidade de meses em atraso: "))
valor_atraso = parcela + (parcela * (taxa_juros / 100) * tempo)

print(f"Valor do produto com atraso: {valor_atraso}\n Juros: {taxa_juros}\n")

for i in range(tempo):
    print(f"Valor da parcela: {parcela}, juros: {taxa_juros}")
```
