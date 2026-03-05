/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.passagem;

/**
 *
 * @author fatec-dsm2
 */
public class Main {

    public static void main(String[] args) {
        
        
        Passagem passagem = new Passagem();
        passagem.cadastrarDadosPassageiro();
        passagem.cadastrarDadosPassagem("12");
        System.out.println(passagem.mostrarDadosPassageiro());
        passagem.mostrarDadosPassagem();
             
        
    }
}
