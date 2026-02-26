/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.projetooo;

/**
 *
 * @author fatec-dsm2
 */
public class Usuario {
    
    //Declaração do atributos
    private String nome;
    private String telefone;
    private int idade;
    private String email;
    
    //Encapsulamento
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

    public int getIdade() {
        return idade;
    }

    public void setIdade(int idade) {
        this.idade = idade;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    
    //Métodos
    public void obterInformacoes(){
        
        System.out.println(
                "Nome: " + getNome() + "\n" + 
                "Telefone: " + getTelefone() + "\n" +
                "Idade: " + getIdade() + "\n" +
                "Email: " + getEmail()
                );
        
    }
    
}
