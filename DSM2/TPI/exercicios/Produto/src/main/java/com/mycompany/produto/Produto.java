/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.produto;

import java.util.Scanner;

/**
 *
 * @author fatec-dsm2
 */
public class Produto {

    public static void main(String[] args) {
        
        Scanner scanner = new Scanner(System.in);
        String descricao;
        int quantidadeComprada;
        double precoUnitario;
        
        System.out.println("Descricao");
        System.out.print("> ");
        descricao = scanner.nextLine();
        System.out.println("");
        
        System.out.println("Quantidade comprada");
        System.out.print("> ");
        quantidadeComprada = scanner.nextInt();
        System.out.println("");
        
        System.out.println("Valor");
        System.out.print("> ");
        precoUnitario = scanner.nextDouble();
        System.out.println("");
        
        double total;
        
        total = quantidadeComprada * precoUnitario;
        
        System.out.println("Produto: " + descricao);
        System.out.println("Total a pagar: R$ " + total);
              
        
        
    }
}
