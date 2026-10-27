---
disciplina: DSM3/TP2
titulo: Principal
fonte: DSM3/TP2/aula04_OO/exercicios/Loja/Principal.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
from Loja import Loja

class Pricipal:

    @staticmethod
    def main():
        loja = Loja()
        loja.inserirDadosLoja()
        loja.calcularCompraLoja()
        loja.mostrarDadosLoja()

if __name__ == "__main__":
    Pricipal.main()
```
