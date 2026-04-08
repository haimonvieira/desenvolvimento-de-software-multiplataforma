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
public class Produto {
    
    Conexao conexao = new Conexao();
    private int codigo;
    private String nomeProduto;
    private String descricao;

    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

    public String getNomeProduto() {
        return nomeProduto;
    }

    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    
    public void cadastrar() {
        String sql;
        sql = "insert into produtos(codigo, nome, descricao)values" + "( "
                + "" + getCodigo() + " ,'" + getNomeProduto()+ "' ,'" + getDescricao()
                + "')";
        conexao.executeSQL(sql);
        JOptionPane.showMessageDialog(null, "Gravado com Sucesso...");
    }

    public void excluir() {
        String sql;
        sql = "Delete FROM produtos WHERE codigo=" + getCodigo() + "";
        conexao.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Excluido com sucesso...");

    }

    public void alterar() {
        String sql;
        sql = "UPDATE produtos set nome='" + getNomeProduto()+ "' , descricao= '" 
                + getDescricao()+ "'" + " WHERE codigo='" + this.getCodigo() + "' ";

        conexao.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Alterado com sucesso...");
    }

    public ResultSet consultar() {
        ResultSet tabela;
        tabela = null;

        String sql = "Select * from produtos";
        tabela = conexao.RetornarResultset(sql);
        return tabela;
    }
    
    
}
