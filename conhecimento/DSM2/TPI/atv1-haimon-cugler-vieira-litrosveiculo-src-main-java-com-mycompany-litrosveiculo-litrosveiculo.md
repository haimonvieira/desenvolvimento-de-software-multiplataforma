---
disciplina: DSM2/TPI
titulo: LitrosVeiculo
fonte: DSM2/TPI/ATV1_HAIMON_CUGLER_VIEIRA/LitrosVeiculo/src/main/java/com/mycompany/litrosveiculo/LitrosVeiculo.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.litrosveiculo;

import java.util.Scanner;

/**
 *
 * @author fatec-dsm2
 */
public class LitrosVeiculo {

    public static void main(String[] args) {
        
        Scanner scanner = new Scanner(System.in);
        double litros;
        
        System.out.println("Quantidade de litros");
        System.out.print("> ");
        litros = scanner.nextDouble();
        
        double valorASerPago = litros * 6.49;
        
        System.out.println("Valor a ser pago: R$ " + valorASerPago);
        
    }
}
```
