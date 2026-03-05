/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mycompany.fornecedor;

import java.util.Scanner;

/**
 *
 * @author fatec-dsm2
 */
public class Fornecedor {

    private String nomeFornecedor;
    private String nomeProduto;
    private String descricaoProduto;

    public String getNomeFornecedor() {
        return nomeFornecedor;
    }

    public void setNomeFornecedor(String nomeFornecedor) {
        this.nomeFornecedor = nomeFornecedor;
    }

    public String getNomeProduto() {
        return nomeProduto;
    }

    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }

    public String getDescricaoProduto() {
        return descricaoProduto;
    }

    public void setDescricaoProduto(String descricaoProduto) {
        this.descricaoProduto = descricaoProduto;
    }

    public void cadastrarFornecedor(String nomeProduto) {

        Scanner scanner = new Scanner(System.in);

        setNomeProduto(nomeProduto);

        System.out.println("Insira o nome do fornecedor");
        setNomeFornecedor(scanner.nextLine());

        System.out.println("Insira a decricao do produto");
        setDescricaoProduto(scanner.nextLine());

    }

    public String listarFornecedor() {

        return "Fornecedor: " + getNomeFornecedor()
                + "\nProduto: " + getNomeProduto()
                + "\nDescricao: " + getDescricaoProduto();

    }

}
