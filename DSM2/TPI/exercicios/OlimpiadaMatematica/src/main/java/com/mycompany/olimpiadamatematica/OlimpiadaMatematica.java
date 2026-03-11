/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.olimpiadamatematica;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class OlimpiadaMatematica {
    
    private String nome;
    private String endereco;
    private double media;
    private double notaMenor;
    private double notaMaior;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public double getMedia() {
        return media;
    }

    public void setMedia(double media) {
        this.media = media;
    }

    public double getNotaMenor() {
        return notaMenor;
    }

    public void setNotaMenor(double notaMenor) {
        this.notaMenor = notaMenor;
    }

    public double getNotaMaior() {
        return notaMaior;
    }

    public void setNotaMaior(double notaMaior) {
        this.notaMaior = notaMaior;
    }
    
    public void calcularMedia(){
        
        setNome(JOptionPane.showInputDialog("Insira seu nome"));
        setEndereco(JOptionPane.showInputDialog("Insira seu endereco"));
        setNotaMaior(Double
                .parseDouble(JOptionPane
                        .showInputDialog("Insira a nota maior")));
        setNotaMenor(Double
                .parseDouble(JOptionPane
                        .showInputDialog("Insira a nota menor")));
        setMedia( (getNotaMaior() + getNotaMenor()) / 2);
        
    }
    
    public void verificarMedia(){
        
        if(getMedia() > 9){
            
            JOptionPane
                    .showMessageDialog(null,
                            "Aluno inscrito.\nNome: " + getNome() 
                                    + "\nEndereco: " + getEndereco() + 
                                    "\nMedia: " + getMedia());
            
        }else{
            
            JOptionPane
                    .showMessageDialog(null, 
                            "Media insuficiente: " + getMedia());
            
        }
        
        
    }
    
}
