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
public class Prefeitura {
    
    Conexao conexao = new Conexao();
    private int codigo;
    private String nomePrefeitura;
    private String cidade;

    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

    public String getNomePrefeitura() {
        return nomePrefeitura;
    }

    public void setNomePrefeitura(String nomePrefeitura) {
        this.nomePrefeitura = nomePrefeitura;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }
    
    public void cadastrarPrefeitura() {
        String sql;
        sql = "insert into prefeituras(codigo, nome, cidade)values" + "( "
                + "" + getCodigo() + " ,'" + getNomePrefeitura()+ "' ,'" + getCidade()
                + "')";
        conexao.executeSQL(sql);
        System.out.println(sql);
        JOptionPane.showMessageDialog(null, "Gravado com Sucesso...");
    }

    public void excluirPrefeitura() {
        String sql;
        sql = "delete FROM prefeituras WHERE codigo=" + getCodigo() + "";
        conexao.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Excluido com sucesso...");

    }

    public void alterarPrefeitura() {
        String sql;
        sql = "update prefeituras set nome='" + getNomePrefeitura()+ "' , cidade= '" 
                + getCidade() + "'" + " WHERE codigo='" + this.getCodigo() + "' ";

        conexao.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Alterado com sucesso!");
    }

    public ResultSet listarPrefeituras() {
        ResultSet tabela;
        tabela = null;

        String sql = "select * from prefeituras";
        tabela = conexao.RetornarResultset(sql);
        return tabela;
    }
    
    
}
