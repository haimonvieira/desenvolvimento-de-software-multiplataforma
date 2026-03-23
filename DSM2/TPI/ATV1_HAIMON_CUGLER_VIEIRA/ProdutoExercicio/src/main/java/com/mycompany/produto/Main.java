/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
package com.mycompany.produto;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Main {

    public static void main(String[] args) {

        Produto produto1 = new Produto();
        Produto produto2 = new Produto();
        Produto produto3 = new Produto();

        produto1.setNome(JOptionPane
                .showInputDialog("Insira o nome do produto 1"));
        produto1.setQuantidade(Integer.parseInt(JOptionPane
                .showInputDialog("Insira a quantidade do " + produto1.getNome())));
        produto1.setValor(Double.parseDouble(JOptionPane
                .showInputDialog("Insira o valor do " + produto1.getNome())));

        double valorProduto1 = produto1.getValor() * produto1.getQuantidade();

        produto2.setNome(JOptionPane
                .showInputDialog("Insira o nome do produto 2"));
        produto2.setQuantidade(Integer.parseInt(JOptionPane
                .showInputDialog("Insira a quantidade do " + produto2.getNome())));
        produto2.setValor(Double.parseDouble(JOptionPane
                .showInputDialog("Insira o valor do " + produto2.getNome())));

        double valorProduto2 = produto2.getValor() * produto2.getQuantidade();

        produto3.setNome(JOptionPane
                .showInputDialog("Insira o nome do produto 3"));
        produto3.setQuantidade(Integer.parseInt(JOptionPane
                .showInputDialog("Insira a quantidade do " + produto3.getNome())));
        produto3.setValor(Double.parseDouble(JOptionPane
                .showInputDialog("Insira o valor do " + produto3.getNome())));
        double valorProduto3 = produto3.getValor() * produto3.getQuantidade();

        double total = valorProduto1 + valorProduto2 + valorProduto3;
              
        System.out.println("Total: " + total);

    }
}
