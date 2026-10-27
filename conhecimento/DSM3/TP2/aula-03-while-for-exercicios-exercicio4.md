---
disciplina: DSM3/TP2
titulo: exercicio4
fonte: DSM3/TP2/aula-03-while-for/exercicios/exercicio4.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
tabuada = int(input("Insira qual tabuada quer: "))
print("Abaixo insira onde deve começar e onde deve terminar a tabuada")
tabuada_inicial = int(input("de: "))
tabuada_final = int(input("até: "))

while  tabuada_inicial <= tabuada_final:
    print(f"{tabuada} X {tabuada_inicial} = {tabuada * tabuada_inicial}")
    tabuada_inicial += 1
```
