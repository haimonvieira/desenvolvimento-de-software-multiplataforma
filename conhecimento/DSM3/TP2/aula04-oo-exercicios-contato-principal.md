---
disciplina: DSM3/TP2
titulo: Principal
fonte: DSM3/TP2/aula04_OO/exercicios/Contato/Principal.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
from Contato import Contato


class Principal:

    @staticmethod
    def main():
        contato = Contato()
        contato.cadastrarDados()
        contato.mostrarDados()

if __name__ == "__main__":
    Principal.main()
```
