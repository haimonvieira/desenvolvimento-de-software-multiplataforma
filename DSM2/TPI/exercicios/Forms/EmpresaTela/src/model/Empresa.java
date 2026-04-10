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
public class Empresa {
    
    Conexao conexao = new Conexao();
    private int cnpj;
    private String nomeEmpresa;
    private String endereco;

    public int getCnpj() {
        return cnpj;
    }

    public void setCnpj(int cnpj) {
        this.cnpj = cnpj;
    }

    public String getNomeEmpresa() {
        return nomeEmpresa;
    }

    public void setNomeEmpresa(String nomeEmpresa) {
        this.nomeEmpresa = nomeEmpresa;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    
    
    public void cadastrarEmpresa() {
        String sql;
        sql = "insert into empresas(cnpj, nome, endereco)values" + "( "
                + "" + getCnpj()+ " ,'" + getNomeEmpresa()+ "' ,'" + getEndereco()
                + "')";
        conexao.executeSQL(sql);
        System.out.println(sql);
        JOptionPane.showMessageDialog(null, "Gravado com Sucesso...");
    }

    public void excluirEmpresa() {
        String sql;
        sql = "delete FROM empresas WHERE cnpj=" + getCnpj()+ "";
        conexao.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Excluido com sucesso...");

    }

    public void alterarEmpresa() {
        String sql;
        sql = "update empresas set nome='" + getNomeEmpresa()+ "' , endereco= '" 
                + getEndereco()+ "'" + " WHERE cnpj='" + getCnpj()+ "' ";

        conexao.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Alterado com sucesso!");
    }

    public ResultSet listarEmpresas() {
        ResultSet tabela;
        tabela = null;

        String sql = "select * from empresas";
        tabela = conexao.RetornarResultset(sql);
        return tabela;
    }
    
    
}
