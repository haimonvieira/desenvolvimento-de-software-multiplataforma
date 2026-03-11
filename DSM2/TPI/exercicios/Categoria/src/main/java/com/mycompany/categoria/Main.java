/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
package com.mycompany.categoria;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Main {

    public static void main(String[] args) {

        Categoria categoria = new Categoria();

        int op;
        
        do {

            op = Integer
                    .parseInt(JOptionPane
                            .showInputDialog("""
                                        Escolha uma opcao:
                                        
                                        1 - Cadastrar cliente
                                        2 - Verificar saldo
                                        0 - SAIR
                                        """));
            
            switch(op){
                
                case 1 -> categoria.cadastarCliente();
                case 2 -> categoria.verificarSaldo();
                case 0 -> JOptionPane
                        .showMessageDialog(null,
                                "Saindo...", "ATENCAO", 1);
                default -> JOptionPane
                        .showMessageDialog(null,
                                "Opcao invalida",
                                "ERRO", 2);
            }

        } while (op != 0);

    }
}
