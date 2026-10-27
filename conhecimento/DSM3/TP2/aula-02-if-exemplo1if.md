---
disciplina: DSM3/TP2
titulo: exemplo1if
fonte: DSM3/TP2/aula-02-if/exemplo1if.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
# Comando para limpar a tela
import os
os.system("cls")

entrada = input("Voce quer entrar ou sair? ")
# comando de decisao if
if entrada == "entrar":
    print("Voce entrou no sistema!")
elif entrada == "sair":
    print("Saiu do sistema.")
else:
    print("Opção inválida")
```
