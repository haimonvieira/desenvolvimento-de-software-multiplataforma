/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.revisaoprova;

import java.util.Scanner;
import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Cliente {
    
    private String nomeCliente;
    private int idade;
    private double peso;

    public String getNomeCliente() {
        return nomeCliente;
    }

    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

    public int getIdade() {
        return idade;
    }

    public void setIdade(int idade) {
        this.idade = idade;
    }

    public double getPeso() {
        return peso;
    }

    public void setPeso(double peso) {
        this.peso = peso;
    }
    
    
    public void cadastrarCliente(){
        
        Scanner scanner = new Scanner(System.in);
        System.out.println("Insira o nome do cliente: ");
        setNomeCliente(scanner.next());
        
        System.out.println("Insira a idade do cliente: ");
        setIdade(scanner.nextInt());
        
        System.out.println("Insira a altura do cliente: ");
        setPeso(scanner.nextDouble());
        
    }
    
    public void mostrarDados(){
        
        System.out.println("Cliente: " + getNomeCliente() +
                "\nIdade: " + getIdade() + "\nPeso: " + getPeso());
        
    }
    
    public void cadastrarClienteJOptionPane(){
        
        setNomeCliente(JOptionPane
                .showInputDialog("Insira o nome: "));
        setIdade(Integer
                .parseInt(JOptionPane
                        .showInputDialog("Insira a idade")));
        setPeso(Double
                .parseDouble(JOptionPane
                        .showInputDialog("Insira o peso")));
        
    }
    
    public void mostrarDadosJOptionPane(){
        
        JOptionPane.showMessageDialog(null, 
                "Cliente: " + getNomeCliente() +
                "\nIdade: " + getIdade() + "\nPeso: " + getPeso());
        
    }
    
}
