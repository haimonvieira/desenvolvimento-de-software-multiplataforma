/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.calculocustopiso;

import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class CustoPiso {

    private double comprimentoComodo;
    private double larguraComodo;
    private double precoPorArea;
    private double custoTotalComodo;

    public double getComprimentoComodo() {
        return comprimentoComodo;
    }

    public void setComprimentoComodo(double comprimentoComodo) {
        this.comprimentoComodo = comprimentoComodo;
    }

    public double getLarguraComodo() {
        return larguraComodo;
    }

    public void setLarguraComodo(double larguraComodo) {
        this.larguraComodo = larguraComodo;
    }

    public double getPrecoPorArea() {
        return precoPorArea;
    }

    public void setPrecoPorArea(double precoPorArea) {
        this.precoPorArea = precoPorArea;
    }

    public double getCustoTotalComodo() {
        return custoTotalComodo;
    }

    public void setCustoTotalComodo(double custoTotalComodo) {
        this.custoTotalComodo = custoTotalComodo;
    }

    public void inserirValores() {

        setComprimentoComodo(Double.parseDouble(JOptionPane
                .showInputDialog("Insira o COMPRIMENTO "
                        + "do comodo")));

        setLarguraComodo(Double.parseDouble(JOptionPane
                .showInputDialog("Insira a LARGURA "
                        + "do comodo")));

        setPrecoPorArea(Double.parseDouble(JOptionPane
                .showInputDialog("Insira o preco por area")));

    }

    public void calcularPrecoArea() {

        setCustoTotalComodo(getComprimentoComodo() * getLarguraComodo()
                * getPrecoPorArea());

    }

    public void mostrarValores() {

        JOptionPane.showInputDialog(null,
                "Comprimento: " + getComprimentoComodo()
                + "\nLargura: " + getLarguraComodo()
                + "\nPreco por area: R$ " + getPrecoPorArea()
                + "\nTotal: R$ " + getCustoTotalComodo()
        );

    }

}
