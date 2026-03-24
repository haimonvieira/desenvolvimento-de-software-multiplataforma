/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.dobro;

/**
 *
 * @author fatec-dsm2
 */
public class Quadrado {
    
    private double valor;
    private double resultado;

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public double getResultado() {
        return resultado;
    }

    public void setResultado(double resultado) {
        this.resultado = resultado;
    }

    public void calcularQuadrado(){
        setResultado(Math.pow(valor, 2));
    }
    
    public void mostrarQuadrado(){
        System.out.println("Quadrado e " + getResultado());
    }
}
   
