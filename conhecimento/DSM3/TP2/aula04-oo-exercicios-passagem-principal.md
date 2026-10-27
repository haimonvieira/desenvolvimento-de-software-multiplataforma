---
disciplina: DSM3/TP2
titulo: Principal
fonte: DSM3/TP2/aula04_OO/exercicios/Passagem/Principal.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
from Passagem import Passagem

class Pricipal:

    @staticmethod
    def main():
        passageiro = Passagem()
        passageiro.cadastrarDadosPassageiro()
        passageiro.cadastrarDadosPassagem()
        passageiro.mostrarDadosPassageiro()
        passageiro.mostrarDadosPassagem()

if __name__ == "__main__":
    Pricipal.main()
```
