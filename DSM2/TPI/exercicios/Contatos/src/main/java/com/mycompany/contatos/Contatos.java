/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.contatos;

import java.util.Scanner;

/**
 *
 * @author fatec-dsm2
 */
public class Contatos {
    
    //Atributos
    private String nome;
    private String telefone;
    private String endereco;
    private String cidade;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }
    
    public void cadastrarDados(){
        
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("Insira o seu nome: ");
        setNome(scanner.nextLine());
        
        System.out.println("Insira o seu telefone: ");
        setTelefone(scanner.nextLine());
        
        System.out.println("Insira o seu endereco: ");
        setEndereco(scanner.nextLine());
        
        System.out.println("Insira o sua cidade: ");
        setCidade(scanner.nextLine());
        
    }
    
    public void mostrarDados(){
        System.out.println("Nome: " + getNome() + "\n" +
                "Telefone: " + getTelefone() + "\n" +
                "Endereco: " + getEndereco() + "\n" +
                "Cidade: " + getCidade()
                );
    }
    
}
