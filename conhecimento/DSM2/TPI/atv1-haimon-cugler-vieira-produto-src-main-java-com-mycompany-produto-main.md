---
disciplina: DSM2/TPI
titulo: Main
fonte: DSM2/TPI/ATV1_HAIMON_CUGLER_VIEIRA/Produto/src/main/java/com/mycompany/produto/Main.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.produto;

/**
 *
 * @author fatec-dsm2
 */
public class Main {

    public static void main(String[] args) {
        
        Produto produto = new Produto();
        produto.cadastrarProduto(2);
        double total = produto.calcularTotal();
        System.out.println("Total: " + total);
        
        
    }
}
```
