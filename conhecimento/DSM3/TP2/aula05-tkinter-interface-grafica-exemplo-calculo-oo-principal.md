---
disciplina: DSM3/TP2
titulo: Principal
fonte: DSM3/TP2/aula05-tkinter-interface-grafica/exemplo_calculo_OO/Principal.py
tipo: py
paginas: 0
extraido_em: 2026-10-24
---

```python
from Calculo import Calculadora

class Principal:

    @staticmethod
    def main():
        calc = Calculadora()
        calc.executar()

if __name__ == '__main__':
    Principal.main()
```
