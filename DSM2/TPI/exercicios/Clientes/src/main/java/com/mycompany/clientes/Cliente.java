/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.clientes;

import java.util.Scanner;

/**
 *
 * @author fatec-dsm2
 */
public class Cliente {
    
    private String nome;
    private String endereco;
    private String rg;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }
    
    public void cadastrarCliente(){
        
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("Insira o nome: ");
        setNome(scanner.nextLine());
        
        System.out.println("Insira o endereco: ");
        setEndereco(scanner.nextLine());
        
        System.out.println("Insira o RG: ");
        setRg(scanner.nextLine());
        
        
    }
    
    public void listarCliente(){
        System.out.println("Nome: " + getNome() + "\n" +
                "Endereco: " + getEndereco() + "\n" +
                "RG: " + getRg()
                );
    }
    
}
