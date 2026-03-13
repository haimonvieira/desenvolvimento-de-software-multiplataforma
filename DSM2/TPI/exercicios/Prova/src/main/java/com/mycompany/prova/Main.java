/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
package com.mycompany.prova;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Main {

    public static void main(String[] args) {

        Prova prova = new Prova();

        int op;

        do {

            op = Integer.parseInt(JOptionPane
                    .showInputDialog("""
                                     Escolha uma opcao:
                                     
                                     1 - Inserir dados
                                     2 - Listar resultado
                                     0 - SAIR
                                     """));

            switch (op) {

                case 1 ->
                    prova.nivelProva();
                case 2 ->
                    prova.listarResultado();
                case 0 ->
                    JOptionPane
                            .showMessageDialog(null, "Saindo...", "SAINDO", 1);
                default ->
                    JOptionPane
                            .showMessageDialog(null, "Opcao invalida", "OPCAO INVALIDA", 3);

            }

        } while (op != 0);

    }
}
