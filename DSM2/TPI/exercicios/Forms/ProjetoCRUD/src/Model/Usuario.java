/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Model;

import Controller.Conexao;
import javax.swing.JOptionPane;
import java.sql.ResultSet;
        
/**
 *
 * @author fatec-dsm2
 */
public class Usuario {

    Conexao con = new Conexao();
    private int codigo;
    private String login;
    private String senha;
    private String telefone;
    

    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
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

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public void cadastrar() {
        String sql;
        sql = "Insert into usuarios(codigo,login,senha,telefone)values" + "( "
                + "" + getCodigo() + " ,'" + getLogin() + "' ,'" + getSenha() 
                + "', '" + getTelefone() + "')";
        con.executeSQL(sql);
        JOptionPane.showMessageDialog(null, "Gravado com Sucesso...");
    }

    public void excluir() {
        String sql;
        sql = "Delete FROM usuarios WHERE codigo=" + getCodigo() + "";
        con.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Excluido com sucesso...");

    }

    public void alterar() {
        String sql;
        sql = "UPDATE usuarios set login='" + getLogin() + "' ,telefone= '" 
                + getTelefone() + "' ,senha= '" + getSenha() 
                + "' WHERE codigo='" + this.getCodigo() + "' ";

        con.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Alterado com sucesso...");
    }

    public ResultSet consultar() {
        ResultSet tabela;
        tabela = null;

        String sql = "Select * from usuarios";
        tabela = con.RetornarResultset(sql);
        return tabela;
    }

}
