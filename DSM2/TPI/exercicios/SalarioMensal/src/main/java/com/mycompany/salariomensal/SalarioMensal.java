/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.salariomensal;

import java.util.Scanner;

/**
 *
 * @author fatec-dsm2
 */
public class SalarioMensal {

    public static void main(String[] args) {
       
        Scanner scanner = new Scanner(System.in);
        double salario;
        double percentualReajuste;
        
        System.out.println("Insira o seu salario");
        System.out.print("> ");
        salario = scanner.nextDouble();
        
        System.out.println("Insira o percentual de reajuste");
        System.out.print("> ");
        percentualReajuste = scanner.nextDouble();
        
        System.out.println("Salario atual: R$ " + salario);
        salario = salario + (salario * percentualReajuste) / 100;
        
        System.out.println("Salario reajustado: R$ " + salario);
        
    }
}
