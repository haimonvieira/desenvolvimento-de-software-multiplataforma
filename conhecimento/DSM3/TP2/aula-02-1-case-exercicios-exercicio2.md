---
disciplina: DSM3/TP2
titulo: exercicio2
fonte: DSM3/TP2/aula-02-1-case/exercicios/exercicio2.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
indice_poluicao = int(input("Insira o indice de poluicao: "))

match indice_poluicao:
    case 0|1|2:
        print("Aceitável")
    case 3|4|5:
        print("Suspender atividades do grupo 1")
    case 6|7:
        print("Suspender atividades do grupo 2")
    case _:
        print("Suspender atividades de todos os grupos")
```
