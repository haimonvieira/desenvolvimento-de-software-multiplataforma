/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.fatecregistro.calculoeleitores;

import javax.swing.JOptionPane;

/**
 *
 * @author haimo
 */
public class Main {

    public static void main(String[] args) {
        
        Eleitores eleitores = new Eleitores();
        
       int op;
        
        do{
            
            op = Integer.parseInt(JOptionPane.showInputDialog("""
                                        1 - Inserir quantidade de VOTOS
                                        2 - Calcular total eleitores
                                        3 - Calcular percentual de votos e mostrar percentual
                                        0 - SAIR
                                        """));
            
            switch(op){
                
                case 1 -> eleitores.inserirQuantidadeDeVotos();
                case 2 -> eleitores.calcularTotalEleitores();
                case 3 -> eleitores.calcularPercentualVotos();
                case 0 -> JOptionPane.showMessageDialog(null,
                        "Saindo...");
                default -> JOptionPane.showMessageDialog(null,
                        "Opcao invalida.");
            }
            
        }while(op != 0);
    }
}
