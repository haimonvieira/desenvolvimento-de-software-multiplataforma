/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.retangulo;

import java.util.Scanner;

/**
 *
 * @author fatec-dsm2
 */
public class Retangulo {

    public static void main(String[] args) {
        
        Scanner scanner = new Scanner(System.in);
        double area, perimetro;
        int ladoA, ladoB;
        
        System.out.println("Insira a medida do lado A");
        System.out.print("> ");
        ladoA = scanner.nextInt();
        
        System.out.println("Insira a medida do lado B");
        System.out.print("> ");
        ladoB = scanner.nextInt();
        
        area = ladoA * ladoB;
        perimetro = 2 * ladoA + 2 * ladoB;
        
        System.out.println("Area: " + area);
        System.out.println("Perimetro: " + perimetro);
        
    }
}
