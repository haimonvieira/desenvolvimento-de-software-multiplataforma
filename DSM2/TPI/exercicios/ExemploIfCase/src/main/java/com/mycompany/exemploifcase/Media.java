/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.exemploifcase;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Media {
    
    private String nomeAluno;
    private double nota1;
    private double nota2;
    private double media;

    public String getNomeAluno() {
        return nomeAluno;
    }

    public void setNomeAluno(String nomeAluno) {
        this.nomeAluno = nomeAluno;
    }

    public double getNota1() {
        return nota1;
    }

    public void setNota1(double nota1) {
        this.nota1 = nota1;
    }

    public double getNota2() {
        return nota2;
    }

    public void setNota2(double nota2) {
        this.nota2 = nota2;
    }

    public double getMedia() {
        return media;
    }

    public void setMedia(double media) {
        this.media = media;
    }
    
    public void inserirNotas(){
        
        setNomeAluno(JOptionPane.showInputDialog("Insira o nome do aluno"));
        setNota1(Double.parseDouble(JOptionPane.showInputDialog("Insira a nota 1")));
        setNota2(Double.parseDouble(JOptionPane.showInputDialog("Insira a nota 2")));
        
    }
    
    public double calcularMedia(){
        
        setMedia((getNota1() + getNota2()) / 2);
        return getMedia();
        
    }
    
    public void verificarSituacao(){
        
        if(getMedia() > 0 && getMedia() <= 5){
            
            JOptionPane.showMessageDialog(null, getNomeAluno() + " esta reprovado.");
            
        }else if(getMedia() > 5 && getMedia() <= 6){
            
            JOptionPane.showMessageDialog(null, getNomeAluno() + " esta de exame.");
            
        }else{
            
            JOptionPane.showMessageDialog(null, getNomeAluno() + " esta aprovado.");
            
        }
        
    }
    
}
