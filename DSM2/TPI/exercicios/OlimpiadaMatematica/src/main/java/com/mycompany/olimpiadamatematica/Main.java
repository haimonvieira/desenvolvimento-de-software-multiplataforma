/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.olimpiadamatematica;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Main {

    public static void main(String[] args) {
        
        OlimpiadaMatematica olimpiadaMatematica = new OlimpiadaMatematica();
        
        
        int op;
        
        do{
            
            op = Integer.parseInt(JOptionPane
                    .showInputDialog("""
                                     Escolha uma opcao
                                     1 - Calcular media
                                     2 - Verificar media
                                     0 - SAIR
                                     """));
            
            switch(op){
                
                case 1 -> olimpiadaMatematica.calcularMedia();
                case 2 -> olimpiadaMatematica.verificarMedia();
                case 0 -> JOptionPane.showMessageDialog(null,
                        "Saindo...");
                default -> JOptionPane.showMessageDialog(null
                        , "Opcao invalida");
                
            }
                  
            
        }while(op != 0);
        
    }
}
