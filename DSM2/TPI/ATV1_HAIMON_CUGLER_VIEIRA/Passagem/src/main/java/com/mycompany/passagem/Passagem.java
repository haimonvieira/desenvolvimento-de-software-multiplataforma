/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.passagem;

import java.util.Scanner;

/**
 *
 * @author fatec-dsm2
 */
public class Passagem {

    private String nomePassageiro;
    private String telefone;
    private String rg;
    private String localViagem;
    private String data;
    private String horario;
    private String numeroPoltrona;

    public String getNomePassageiro() {
        return nomePassageiro;
    }

    public void setNomePassageiro(String nomePassageiro) {
        this.nomePassageiro = nomePassageiro;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getLocalViagem() {
        return localViagem;
    }

    public void setLocalViagem(String localViagem) {
        this.localViagem = localViagem;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public String getNumeroPoltrona() {
        return numeroPoltrona;
    }

    public void setNumeroPoltrona(String numeroPoltrona) {
        this.numeroPoltrona = numeroPoltrona;
    }

    public void cadastrarDadosPassageiro() {

        Scanner scanner = new Scanner(System.in);

        System.out.println("Insira o nome");
        setNomePassageiro(scanner.nextLine());

        System.out.println("Insira o telefone");
        setTelefone(scanner.nextLine());

        System.out.println("Insira o RG");
        setRg(scanner.nextLine());

    }

    public void cadastrarDadosPassagem(String numeroPoltrona) {

        Scanner scanner = new Scanner(System.in);
        
        setNumeroPoltrona(numeroPoltrona);

        System.out.println("Insira o local da viagem");
        setLocalViagem(scanner.nextLine());
        
        System.out.println("Insira a data");
        setData(scanner.nextLine());

        System.out.println("Insira o horario");
        setHorario(scanner.nextLine());

    }
    
    public String mostrarDadosPassageiro(){
        
        return "Nome: " + getNomePassageiro() +
                "\nTelefone: " + getTelefone() +
                "\nRG: " + getRg();
        
    }
    
    public void mostrarDadosPassagem(){
        System.out.println("Local da viagem: " + getLocalViagem() + 
                "\nData: " + getData() + 
                "\nHorario: " + getHorario() + 
                "\nPoltrona: " + getNumeroPoltrona());
    }

}
