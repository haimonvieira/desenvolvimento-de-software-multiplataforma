---
disciplina: DSM3/TP2
titulo: Principal
fonte: DSM3/TP2/aula04_OO/exercicios/Matematica/Principal.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
from Matematica import Matematica

class Principal:
    @staticmethod
    def main():
        matematica = Matematica()
        matematica.inserirNotas()
        matematica.calcularMedia()
        matematica.mostrarNomeMedia()


if __name__ == "__main__":
    Principal.main()
```
