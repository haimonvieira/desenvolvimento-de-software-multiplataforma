---
disciplina: DSM2/TPI
titulo: Main
fonte: DSM2/TPI/exercicios/Fornecedor/src/main/java/com/mycompany/fornecedor/Main.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.fornecedor;

/**
 *
 * @author fatec-dsm2
 */
public class Main {

    public static void main(String[] args) {
        
        Fornecedor fornecedor = new Fornecedor();
        fornecedor.cadastrarFornecedor("Coca-cola");
        System.out.println(fornecedor.listarFornecedor());
        
    }
}
```
