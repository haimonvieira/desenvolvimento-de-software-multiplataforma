---
disciplina: DSM2/TPI
titulo: Dobro
fonte: DSM2/TPI/exercicios/Dobro/src/main/java/com/mycompany/dobro/Dobro.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.dobro;

/**
 *
 * @author fatec-dsm2
 */
public class Dobro {
    
    private double numero;
    private double calculo;

    public double getNumero() {
        return numero;
    }

    public void setNumero(double numero) {
        this.numero = numero;
    }

    public double getCalculo() {
        return calculo;
    }

    public void setCalculo(double calculo) {
        this.calculo = calculo;
    }
    
    public void calcularDobro(){
        
        setCalculo(getNumero() * 2);
        
    }
    
}
```
