/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
package com.mycompany.combustivel;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Main {

    public static void main(String[] args) {

        Combustivel combustivel = new Combustivel();

        int op;

        do {

            op = Integer.parseInt(JOptionPane
                    .showInputDialog("""
                                     Escolha uma opcao:
                                     
                                     1 - Alcool
                                     2 - Gasolina
                                     0 - SAIR
                                     """));

            switch (op) {

                case 1:
                    combustivel.setValorComb(Double
                            .parseDouble(JOptionPane
                                    .showInputDialog("Insira o valor do combustivel")));
                    combustivel
                            .calcularLitrosAlcool(Double
                                    .parseDouble(JOptionPane
                                            .showInputDialog("Insira o km rodado")));
                    break;
                case 2:
                    combustivel.setValorComb(Double
                            .parseDouble(JOptionPane
                                    .showInputDialog("Insira o valor do combustivel")));
                    combustivel.calcularLitrosGasolina(Double
                            .parseDouble(JOptionPane
                                    .showInputDialog("Insira o km rodado")));
                    break;
                case 0:
                    JOptionPane
                            .showMessageDialog(null,
                                    "Saindo...", "SAINDO", 1);
                    break;
                default:
                    JOptionPane
                            .showMessageDialog(null,
                                    "Opcao invalida", "OPCAO INVALIDA", 3);
                    break;

            }

        } while (op != 0);

    }
}
