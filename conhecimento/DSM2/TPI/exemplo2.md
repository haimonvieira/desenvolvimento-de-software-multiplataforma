---
disciplina: DSM2/TPI
titulo: exemplo2
fonte: DSM2/TPI/exemplo2.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
import java.util.Scanner;
public static void main(){

    Scanner scanner = new Scanner(System.in);
    double numero1, numero2, soma, subtracao, multiplicacao, divisao;

    System.out.println("Digite o primeiro número: ");
    System.out.print("> ");
    numero1 = scanner.nextDouble();

    System.out.println("Digite o segundo número: ");
    System.out.print("> ");
    numero2 = scanner.nextDouble();

    soma = numero1 + numero2;
    subtracao = Math.abs(numero1 - numero2);
    multiplicacao = numero1 * numero2;
    divisao = numero1 / numero2;

    System.out.println("Soma: " + soma + "\nDivisão: " + divisao + "\nSubtração: " + subtracao + 
    "\nMultiplicação: " + multiplicacao);

}
```
