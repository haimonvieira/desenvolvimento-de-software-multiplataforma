---
disciplina: DSM3/TP2
titulo: Principal
fonte: DSM3/TP2/TP2 - Reposicao/Principal.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
from Produto import Produto


class Principal:

    @staticmethod
    def main():
        # instanciação da classe com objeto Produto
        produto = Produto()
        produto.executar()


# Execução do programa
if __name__ == "__main__":
    Principal.main()
```
