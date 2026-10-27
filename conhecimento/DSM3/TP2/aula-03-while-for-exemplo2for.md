---
disciplina: DSM3/TP2
titulo: exemplo2for
fonte: DSM3/TP2/aula-03-while-for/exemplo2for.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
# for para percorrer uma lista
nomes = ["Felipe", "Maria", "Luiza", "Paulo", "Josefina"]

for nome in nomes:
    # len conta a quantidade de caracteres
    if len(nome) != 4:
        continue
    print(f"Ese nome tem 4 letras {nome}")

    if nome == "Paulo":
        break
    print("Terminou a execução")
```
