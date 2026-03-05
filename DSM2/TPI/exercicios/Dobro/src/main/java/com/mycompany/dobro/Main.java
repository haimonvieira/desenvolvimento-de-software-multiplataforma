/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.dobro;

/**
 *
 * @author fatec-dsm2
 */
public class Main {

    public static void main(String[] args) {
        
        Dobro dobro = new Dobro();
        dobro.setNumero(2);
        dobro.calcularDobro();
        System.out.println(dobro.getCalculo());
        
        
    }
}
