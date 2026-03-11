/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
package com.mycompany.exemploifcase;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Main {

    public static void main(String[] args) {

        Media media = new Media();

        int op;

        do {

            op = Integer.parseInt(JOptionPane
                    .showInputDialog(
                            """
                 Escolha uma opção
                                 
                 1 - Inserir notas
                 2 - Calcular media
                 3 - Verificar situacao
                 0 - SAIR
                 """));

            switch (op) {

                case 1:
                    media.inserirNotas();
                    break;
                case 2:
                    JOptionPane.showMessageDialog(null,
                            "A media e " + media.calcularMedia());
                    break;
                case 3:
                    media.verificarSituacao();
                    break;
                case 0:
                    JOptionPane.showMessageDialog(null, "Saindo...",
                            "SAIR", 2);
                    break;
                default:
                    JOptionPane.showMessageDialog(null,
                            "Insira uma opcao valida", "ATENCAO",
                            0);
                    break;

            }

        } while (op != 0);

    }
}
