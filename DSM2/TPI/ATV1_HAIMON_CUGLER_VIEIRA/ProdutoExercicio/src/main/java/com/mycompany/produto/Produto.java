/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.produto;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Produto {
    
    private String nome;
    private int quantidade;
    private double valor;
    private double total;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
    
    public void cadastrarProduto(int quantidade){
        
        setNome(JOptionPane.showInputDialog( "Insira o nome"));
        setQuantidade(quantidade);
        setValor(Double.parseDouble(JOptionPane.showInputDialog("Insira o valor")));
        
    }
    
    public double calcularTotal(){
        
        setTotal(getValor()* getQuantidade());
        return getTotal();
        
    }
    
    
}
