---
disciplina: DSM2/TPI
titulo: Circunferencia
fonte: DSM2/TPI/exercicios/Circunferencia/src/main/java/com/mycompany/circunferencia/Circunferencia.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.circunferencia;

import java.util.Scanner;

/**
 *
 * @author fatec-dsm2
 */
public class Circunferencia {

    public static void main(String[] args) {
        
        Scanner scanner = new Scanner(System.in);
        double raio;
        
        System.out.println("Insira o raio");
        System.out.print("> ");
        raio = scanner.nextDouble();
        
        double area = Math.PI * (raio * raio);
        
        System.out.println("Area: " + area);
        
    }
}
```
