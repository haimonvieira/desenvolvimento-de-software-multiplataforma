/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
package com.mycompany.temperatura;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Main {

    public static void main(String[] args) {

        Temperatura temperatura = new Temperatura();

        int op;
        double temp;

        do {

            op = Integer.parseInt(JOptionPane
                    .showInputDialog("""
                                     Escolha uma opcao:
                                     
                                     1 - Converter Fahrenheit-Celcius
                                     2 - Converter Celcius-Fahrenheit
                                     0 - SAIR
                                     """));

            switch (op) {

                case 1:
                    temp = Double.parseDouble(JOptionPane
                            .showInputDialog("Insira a temperatura em Fahrenheit"));
                    temperatura.calcularTempCelsius(temp);
                    break;
                case 2:
                    temp = Double.parseDouble(JOptionPane
                            .showInputDialog("Insira a temperatura em Celsius"));
                    temperatura.calcularTempFahrenheit(temp);
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
