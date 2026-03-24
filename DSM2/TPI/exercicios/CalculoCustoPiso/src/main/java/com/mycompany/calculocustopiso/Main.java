/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.calculocustopiso;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Main {

    public static void main(String[] args) {
        
        CustoPiso custoPiso = new CustoPiso();
        
        int op;
        
        do{
            
            op = Integer.parseInt(JOptionPane.showInputDialog("""
                                        1 - Inserir valores do comando
                                        2 - Calcular preco por area
                                        3 - Mostrar valores
                                        0 - SAIR
                                        """));
            
            switch(op){
                
                case 1 -> custoPiso.inserirValores();
                case 2 -> custoPiso.calcularPrecoArea();
                case 3 -> custoPiso.mostrarValores();
                case 0 -> JOptionPane.showMessageDialog(null,
                        "Saindo...");
                default -> JOptionPane.showMessageDialog(null,
                        "Opcao invalida.");
            }
            
        }while(op != 0);
        
    }
}
