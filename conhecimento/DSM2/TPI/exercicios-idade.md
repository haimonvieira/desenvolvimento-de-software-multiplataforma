---
disciplina: DSM2/TPI
titulo: idade
fonte: DSM2/TPI/exercicios/idade.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
import java.util.Scanner;

public static void main(){

    int idade, dias;
    Scanner scanner = new Scanner(System.in);

    System.out.println("Insira sua idade");
    System.out.printf("> ");
    idade = scanner.nextInt();

    dias = idade * 365;

    System.out.printf("Você já viveu %d dias!", dias);


}
```
