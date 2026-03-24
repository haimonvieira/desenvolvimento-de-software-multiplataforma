/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.loja;

/**
 *
 * @author fatec-dsm2
 */
public class Main {

    public static void main(String[] args) {
        
        Loja loja = new Loja();
        
        loja.inserirDadosLoja();
        System.out.println("Total compra da loja: R$ " 
                + loja.calcularCompraLoja());
        System.out.println(loja.mostrarDadosLoja());
                
        
        
               
        
    }
}
