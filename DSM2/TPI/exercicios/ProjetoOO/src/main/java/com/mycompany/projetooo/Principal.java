/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.projetooo;

import java.util.Scanner;

/**
 *
 * @author fatec-dsm2
 */
public class Principal {

    public static void main(String[] args) {
        
        //Instanciar objeto
        Usuario usuario = new Usuario();
        
        //Atribuindo os valores ao objeto
        //usuario.setNome("Haimon");
       //usuario.setIdade(24);
        //usuario.setEmail("haimoncugler@gmail.com");
        //usuario.setTelefone("13997206431");
        
        //usuario.obterInformacoes();
        
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("Insira seu nome");
        System.out.print("> ");
        usuario.setNome(scanner.nextLine());
        
        System.out.println("Insira sua idade");
        System.out.print("> ");
        usuario.setIdade(scanner.nextInt());
        
        scanner.nextLine();
        System.out.println("Insira seu email");
        System.out.print("> ");
        usuario.setEmail(scanner.nextLine());
        
        System.out.println("Insira seu telefone");
        System.out.print("> ");
        usuario.setTelefone(scanner.nextLine());
        
        usuario.obterInformacoes();
        
    }
}
