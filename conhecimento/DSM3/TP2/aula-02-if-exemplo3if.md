---
disciplina: DSM3/TP2
titulo: exemplo3if
fonte: DSM3/TP2/aula-02-if/exemplo3if.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
negativado = int(input("Possui nome negativado? (1- SIM / 0 - NÃO): "))

if negativado == 2 or negativado == 3 or negativado == 4:
    print("Digite apenas 1 ou 0")

if negativado == 1:
    print("Não pode realizar empréstimo.")
else:
    carteira_assinada = int(input("Possui carteira assinada? (1- SIM / 0 - NÃO): "))

    if carteira_assinada == 0:
        print("Não pode realizar empréstimo.")
    else :
        print("Pode realizar empréstimo.")
```
