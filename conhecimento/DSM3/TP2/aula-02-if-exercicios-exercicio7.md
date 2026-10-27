---
disciplina: DSM3/TP2
titulo: exercicio7
fonte: DSM3/TP2/aula-02-if/exercicios/exercicio7.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
rg = input("Insira seu RG: ")
ano_nascimento = int(input("Insira o ano do seu nascimento: "))
ano_ingresso_empresa = int(input("Insira o ano de ingresso na empresa: "))
ano_atual = int(input("Insira o ano atual: "))

idade = ano_atual - ano_nascimento
tempo_de_trabalho = ano_atual - ano_ingresso_empresa

print(f"""
Idade: {idade}
Tempo de trabalho: {tempo_de_trabalho}
RG: {rg}
""")

if idade >= 65 or tempo_de_trabalho >= 30:
    print("Requerer aposentadoria")
else:
    print("Não requerer aposentadoria")
```
