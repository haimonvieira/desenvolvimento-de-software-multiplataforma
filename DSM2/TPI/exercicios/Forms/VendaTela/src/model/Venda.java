/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

import controller.Conexao;
import java.sql.ResultSet;
import javax.swing.JOptionPane;

/**
 *
 * @author fatec-dsm2
 */
public class Venda {
    
    Conexao conexao = new Conexao();
    private int codigo;
    private String nomeVendedor;
    private String nomeProduto;

    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

    public String getNomeVendedor() {
        return nomeVendedor;
    }

    public void setNomeVendedor(String nomeVendedor) {
        this.nomeVendedor = nomeVendedor;
    }

    public String getNomeProduto() {
        return nomeProduto;
    }

    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }
    
    public void cadastrarVenda() {
        String sql;
        sql = "insert into vendas(codigo, nome, nome_produto)values" + "( "
                + "" + getCodigo() + " ,'" + getNomeVendedor()+ "' ,'" + getNomeProduto()
                + "')";
        conexao.executeSQL(sql);
        System.out.println(sql);
        JOptionPane.showMessageDialog(null, "Gravado com Sucesso...");
    }

    public void excluirVenda() {
        String sql;
        sql = "delete FROM vendas WHERE codigo=" + getCodigo() + "";
        conexao.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Excluido com sucesso...");

    }

    public void alterarVenda() {
        String sql;
        sql = "update vendas set nome='" + getNomeVendedor()+ "' , nome_produto= '" 
                + getNomeProduto()+ "'" + " WHERE codigo='" + this.getCodigo() + "' ";

        conexao.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Alterado com sucesso!");
    }

    public ResultSet consultarVendas() {
        ResultSet tabela;
        tabela = null;

        String sql = "select * from vendas";
        tabela = conexao.RetornarResultset(sql);
        return tabela;
    }
    
    
}
