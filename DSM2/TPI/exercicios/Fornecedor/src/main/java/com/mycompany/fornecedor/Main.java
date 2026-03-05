/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.fornecedor;

/**
 *
 * @author fatec-dsm2
 */
public class Main {

    public static void main(String[] args) {
        
        Fornecedor fornecedor = new Fornecedor();
        fornecedor.cadastrarFornecedor("Coca-cola");
        System.out.println(fornecedor.listarFornecedor());
        
    }
}
