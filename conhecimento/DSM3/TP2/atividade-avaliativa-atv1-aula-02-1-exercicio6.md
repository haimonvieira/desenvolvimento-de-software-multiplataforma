---
disciplina: DSM3/TP2
titulo: exercicio6
fonte: DSM3/TP2/Atividade Avaliativa/ATV1/Aula 02-1/exercicio6.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
peso = float(input("Insira seu peso: "))
planeta = int(input("""
Escolha um planeta: 
1 - Mercúrio
2 - Vênus
3 - Marte
4 - Júpiter
5 - Saturno

0 - SAIR
"""))

match planeta:
    case 1:
        peso = peso * .37
        print(f"Seu peso em Mercúrio é de {peso}")
    case 2:
        peso = peso * .88
        print(f"Seu peso em Vênus é de {peso}")
    case 3:
        peso = peso * .38
        print(f"Seu peso em Marte é de {peso}")
    case 4: 
        peso = peso * 2.64
        print(f"Seu peso em Júpiter é de {peso}")
    case 5: 
        peso = peso * 1.15
        print(f"Seu peso em Saturno é de {peso}")
    case _:
        print("Opção inválida")
```
