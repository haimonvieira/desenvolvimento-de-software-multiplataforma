/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.fatecregistro.calculoeleitores;

import javax.swing.JOptionPane;

/**
 *
 * @author haimo
 */
public class Eleitores {

    private int numeroTotalEleitores;
    private int numeroVotosBrancos;
    private int numeroVotosNulos;
    private int numeroVotosValidos;
    private double percentualBrancos;
    private double percentualNulos;
    private double percentualValidos;

    public int getNumeroTotalEleitores() {
        return numeroTotalEleitores;
    }

    public void setNumeroTotalEleitores(int numeroTotalEleitores) {
        this.numeroTotalEleitores = numeroTotalEleitores;
    }

    public int getNumeroVotosBrancos() {
        return numeroVotosBrancos;
    }

    public void setNumeroVotosBrancos(int numeroVotosBrancos) {
        this.numeroVotosBrancos = numeroVotosBrancos;
    }

    public int getNumeroVotosNulos() {
        return numeroVotosNulos;
    }

    public void setNumeroVotosNulos(int numeroVotosNulos) {
        this.numeroVotosNulos = numeroVotosNulos;
    }

    public int getNumeroVotosValidos() {
        return numeroVotosValidos;
    }

    public void setNumeroVotosValidos(int numeroVotosValidos) {
        this.numeroVotosValidos = numeroVotosValidos;
    }

    public double getPercentualBrancos() {
        return percentualBrancos;
    }

    public void setPercentualBrancos(double percentualBrancos) {
        this.percentualBrancos = percentualBrancos;
    }

    public double getPercentualNulos() {
        return percentualNulos;
    }

    public void setPercentualNulos(double percentualNulos) {
        this.percentualNulos = percentualNulos;
    }

    public double getPercentualValidos() {
        return percentualValidos;
    }

    public void setPercentualValidos(double percentualValidos) {
        this.percentualValidos = percentualValidos;
    }

    public void inserirQuantidadeDeVotos() {

        setNumeroVotosBrancos(Integer.parseInt(JOptionPane
                .showInputDialog("Insira a quantidade de votos"
                        + " BRANCOS")));

        setNumeroVotosNulos(Integer.parseInt(JOptionPane
                .showInputDialog("Insira a quantidade de votos"
                        + " NULOS")));

        setNumeroVotosValidos(Integer.parseInt(JOptionPane
                .showInputDialog("Insira a quantidade de votos"
                        + " VALIDOS")));

    }

    public void calcularTotalEleitores() {

        setNumeroTotalEleitores(getNumeroVotosBrancos() 
                + getNumeroVotosNulos() + getNumeroVotosValidos());

    }

    public void calcularPercentualVotos() {
        
        setPercentualBrancos((getNumeroVotosBrancos() * 100)
                / getNumeroTotalEleitores());
        
        setPercentualNulos((getNumeroVotosNulos()* 100)
                / getNumeroTotalEleitores());
        
        setPercentualValidos((getNumeroVotosValidos()* 100)
                / getNumeroTotalEleitores());
        
        JOptionPane.showMessageDialog(null, 
                "Votos BRANCOS: " + getPercentualBrancos() +
                        "\nVotos NULOS: " + getPercentualNulos() +
                        "\nVotos VALIDOS: " + getPercentualValidos());
        
    }

}
