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
public class Filme {
    
    Conexao conexao = new Conexao();
    private int codigo;
    private String titulo;
    private String genero;
    private String produtora;
    private String dataCompra;

    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getProdutora() {
        return produtora;
    }

    public void setProdutora(String produtora) {
        this.produtora = produtora;
    }

    public String getDataCompra() {
        return dataCompra;
    }

    public void setDataCompra(String dataCompra) {
        this.dataCompra = dataCompra;
    }
    
    public void cadastrarFilme() {
        String sql;
        sql = "insert into filmes(codigo, titulo, genero, produtora, data_compra) values ("
        + getCodigo() + ", '"
        + getTitulo() + "', '"
        + getGenero() + "', '"
        + getProdutora() + "', '"
        + getDataCompra() + "')";
        conexao.executeSQL(sql);
        System.out.println(sql);
        JOptionPane.showMessageDialog(null, "Gravado com Sucesso...");
    }

    public void excluirFilme() {
        String sql;
        sql = "delete FROM filmes WHERE codigo=" + getCodigo()+ "";
        conexao.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Excluido com sucesso...");

    }

    public void alterarFilme() {
        String sql;
        sql = "update filmes set titulo='" + getTitulo()+ "' , genero= '" 
                + getGenero()+ "' , produtora= '" 
                + getProdutora() + "' , data_compra= '" 
                + getDataCompra()+ "'" + " WHERE codigo='" + getCodigo()+ "' ";

        conexao.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Alterado com sucesso!");
    }

    public ResultSet listarFilmes() {
        ResultSet tabela;
        tabela = null;

        String sql = "select * from filmes";
        tabela = conexao.RetornarResultset(sql);
        return tabela;
    }
    
    
}
