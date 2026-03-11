/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.categoria;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Categoria {
    
    private String nome;
    private int numeroConta;
    private double saldoMedio;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getNumeroConta() {
        return numeroConta;
    }

    public void setNumeroConta(int numeroConta) {
        this.numeroConta = numeroConta;
    }

    public double getSaldoMedio() {
        return saldoMedio;
    }

    public void setSaldoMedio(double saldoMedio) {
        this.saldoMedio = saldoMedio;
    }
    
    public void cadastarCliente(){
        
        setNome(JOptionPane
                .showInputDialog("Insira o nome da categoria"));
        setNumeroConta(Integer
                .parseInt(JOptionPane
                        .showInputDialog("Insira o numero da conta")));
        setSaldoMedio(Double
                .parseDouble(JOptionPane
                        .showInputDialog("Insira seu saldo medio")));
        
    }
    
    public void verificarSaldo(){
        
        if(getSaldoMedio() < 1000){
            JOptionPane
                    .showMessageDialog(null,
                            "Cliente comum");
            
        }else if(getSaldoMedio() >= 1000 && getSaldoMedio() < 2500){
            
            JOptionPane
                    .showMessageDialog(null
                            , "Cliente Prata"); 
        }else{
            JOptionPane
                    .showMessageDialog(null
                    , "Cliente Ouro");
        }
            
        
    }
    
}
