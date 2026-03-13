/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.calculadora;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Calculadora {
    
    private double n1;
    private double n2;
    private double r;

    public double getN1() {
        return n1;
    }

    public void setN1(double n1) {
        this.n1 = n1;
    }

    public double getN2() {
        return n2;
    }

    public void setN2(double n2) {
        this.n2 = n2;
    }

    public double getR() {
        return r;
    }

    public void setR(double r) {
        this.r = r;
    }
    
    public void somar(){
        
        JOptionPane.showMessageDialog(null, "Resultado da soma: " + (n1 + n2));
        
    }
    
    public void subtrair(double a, double b){
        
        JOptionPane.showMessageDialog(null,
                "Resultado da subtracao: " + Math.abs(a - b));
        
    }
    
    public double multiplicar(){
        
        return n1 * n2;
        
    }
    
    public double dividir(double a, double b){
        
        return a / b;
        
    }
    
}
