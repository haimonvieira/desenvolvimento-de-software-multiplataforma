/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.temperatura;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Temperatura {
    
    private double celsius;
    private double fahrenheit;

    public double getCelsius() {
        return celsius;
    }

    public void setCelsius(double celsius) {
        this.celsius = celsius;
    }

    public double getFahrenheit() {
        return fahrenheit;
    }

    public void setFahrenheit(double fahrenheit) {
        this.fahrenheit = fahrenheit;
    }
    
    public void calcularTempCelsius(double fahrenheit){
        
        setCelsius((fahrenheit - 32) * (5 / 9.0) );
        JOptionPane.showMessageDialog(null, 
                fahrenheit + " para celsius eh: " + getCelsius());
        
        
    }
    
    public void calcularTempFahrenheit(double celsius){
        
        setFahrenheit(celsius * 1.8 + 32);
        JOptionPane.showMessageDialog(null, 
                celsius + " para fahrenheit eh: " + getFahrenheit());
        
    }
    
}
