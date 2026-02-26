/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.exemplomedia;

import java.util.Scanner;

/**
 *
 * @author fatec-dsm2
 */
public class ExemploMedia {

    public static void main(String[] args) {
        
        double nota1, nota2, nota3, nota4, nota5, nota6, media1, media2, soma;
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("Insira a nota 1");
        System.out.print("> ");
        nota1 = scanner.nextDouble();
        
        System.out.println("Insira a nota 2");
        System.out.print("> ");
        nota2 = scanner.nextDouble();
        
        System.out.println("Insira a nota 3");
        System.out.print("> ");
        nota3 = scanner.nextDouble();
        
        media1 = (nota1 + nota2 + nota3) / 3;
        
        /*=========================================*/
        
        System.out.println("Insira a nota 4");
        System.out.print("> ");
        nota4 = scanner.nextDouble();
        
        System.out.println("Insira a nota 5");
        System.out.print("> ");
        nota5 = scanner.nextDouble();
        
        System.out.println("Insira a nota 6");
        System.out.print("> ");
        nota6 = scanner.nextDouble();
      
        media2 = (nota4 + nota5 + nota6) / 3;
        
        soma = media1 + media2;
        System.out.println("Media 1: " + media1);
        System.out.println("Media 2: " + media2);
        System.out.println("Soma das medias: " + soma);
                
        
    }
    
}
