/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.venda;

import java.util.Scanner;

/**
 *
 * @author fatec-dsm2
 */
public class Venda {

    public static void main(String[] args) {
        
        Scanner scanner = new Scanner(System.in);
        String nome;
        int quantidadeVendida;
        
        System.out.println("Nome produto");
        System.out.print("> ");
        nome = scanner.nextLine();
        
        System.out.println("Quantidade vendida");
        System.out.print("> ");
        quantidadeVendida = scanner.nextInt();
        
        System.out.println("Nome produto");
        System.out.print("> ");
        nome = scanner.nextLine();
        
        
        
    }
}
