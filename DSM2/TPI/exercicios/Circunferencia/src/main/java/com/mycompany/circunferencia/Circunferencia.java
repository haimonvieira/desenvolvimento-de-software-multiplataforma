/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.circunferencia;

import java.util.Scanner;

/**
 *
 * @author fatec-dsm2
 */
public class Circunferencia {

    public static void main(String[] args) {
        
        Scanner scanner = new Scanner(System.in);
        double raio;
        
        System.out.println("Insira o raio");
        System.out.print("> ");
        raio = scanner.nextDouble();
        
        double area = Math.PI * (raio * raio);
        
        System.out.println("Area: " + area);
        
    }
}
