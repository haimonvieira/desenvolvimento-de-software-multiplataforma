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
public class Usuario {
    
    Conexao conexao = new Conexao();
    private String nome;
    private String email;
    private String login;
    private String senha;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
    
    
    public void cadastrarUsuario() {
        String sql;
        sql = "insert into usuarios(nome, email, login, senha)values" + "( "
                + "'" + getNome()+ "' ,'" + getEmail()+ "' ,'" + getLogin() +
                "', '" + getSenha() + "')";
        conexao.executeSQL(sql);
        JOptionPane.showMessageDialog(null, "Gravado com Sucesso...");
    }

    public void excluirUsuario() {
        String sql;
        sql = "delete FROM usuarios WHERE login='" + getLogin()+ "'";
        conexao.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Excluido com sucesso...");

    }

    public void alterarUsuario() {
        String sql;
        sql = "update usuarios set nome='" + getNome()+ "' , email= '" 
                + getEmail() + "' , senha= '" + getSenha()+ "'" 
                + " WHERE login='" + getLogin()+ "' ";

        conexao.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Alterado com sucesso!");
    }

    public ResultSet listarUsuarios() {
        ResultSet tabela;
        tabela = null;

        String sql = "select * from usuarios";
        tabela = conexao.RetornarResultset(sql);
        return tabela;
    }
    
    
}
