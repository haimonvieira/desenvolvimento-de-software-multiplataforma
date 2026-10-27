---
disciplina: DSM3/TP2
titulo: Principal
fonte: DSM3/TP2/aula04_OO/exercicios/Fornecedor/Principal.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
from Fornecedor import Fornecedor

class Pricipal:

    @staticmethod
    def main():
        fornecedor = Fornecedor()
        fornecedor.cadastrarFornecedor()
        fornecedor.listarFornecedor()

if __name__ == "__main__":
    Pricipal.main()
```
