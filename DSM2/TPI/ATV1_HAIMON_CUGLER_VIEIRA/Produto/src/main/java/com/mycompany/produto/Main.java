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
