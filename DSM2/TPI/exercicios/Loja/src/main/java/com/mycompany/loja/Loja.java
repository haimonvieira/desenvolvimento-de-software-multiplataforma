/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.loja;

import java.util.Scanner;

/**
 *
 * @author fatec-dsm2
 */
public class Loja {
    
    private String razaoSocial;
    private String cpfCliente;
    private double valorCompra;
    private int quantidadeDeItensComprado;
    private double valorTotalCompra;

    public String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    public String getCpfCliente() {
        return cpfCliente;
    }

    public void setCpfCliente(String cpfCliente) {
        this.cpfCliente = cpfCliente;
    }

    public double getValorCompra() {
        return valorCompra;
    }

    public void setValorCompra(double valorCompra) {
        this.valorCompra = valorCompra;
    }

    public int getQuantidadeDeItensComprado() {
        return quantidadeDeItensComprado;
    }

    public void setQuantidadeDeItensComprado(int quantidadeDeItensComprado) {
        this.quantidadeDeItensComprado = quantidadeDeItensComprado;
    }

    public double getValorTotalCompra() {
        return valorTotalCompra;
    }

    public void setValorTotalCompra(double valorTotalCompra) {
        this.valorTotalCompra = valorTotalCompra;
    }
    
    public void inserirDadosLoja(){
        
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("Insira razao social");
        setRazaoSocial(scanner.nextLine());
        
        System.out.println("Insira cpf do cliente");
        setCpfCliente(scanner.nextLine());
        
        System.out.println("Insira o valor da compra");
        setValorCompra(scanner.nextDouble());
        
        scanner.nextLine();
        
        System.out.println("Insira quantidade de itens comprados");
        setQuantidadeDeItensComprado(scanner.nextInt());
        
        System.out.println("Insira razao social");
        setRazaoSocial(scanner.nextLine());
        
    }
    
    public String mostrarDadosLoja(){
        
        return "Razao social: " + getRazaoSocial() + 
                "\nCPF: " + getCpfCliente();
        
    }
    
    public double calcularCompraLoja(){
        
        return setValorTotalCompra(getValorCompra() * getQuantidadeDeItensComprado());
        
    }
    
}
