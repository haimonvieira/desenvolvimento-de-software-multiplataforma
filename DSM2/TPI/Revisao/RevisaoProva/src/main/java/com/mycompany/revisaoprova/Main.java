/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.revisaoprova;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Main {

    public static void main(String[] args) {
       
        Cliente cliente = new Cliente();
        //cliente.cadastrarCliente();
        //cliente.mostrarDados();
        
        int op;
        
        do{
            
            op = Integer.parseInt(JOptionPane
                    .showInputDialog("""
                                     Digite uma opcao:
                                     
                                     1 - Cadastrar cliente
                                     2 - Mostrar dados
                                     0 - SAIR
                                     """));
            
            
            switch (op) {
                case 1:
                    cliente.cadastrarClienteJOptionPane();
                    break;
                case 2:
                    cliente.mostrarDadosJOptionPane();
                    break;
                case 0:
                    JOptionPane.showMessageDialog(null, "Saindo...");
                    break;
                default:
                    JOptionPane.showMessageDialog(null, "Opcao invalida.");
            }
            
        }while(op != 0);
        
    }
}
