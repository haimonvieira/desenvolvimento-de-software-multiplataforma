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
public class Cliente {
    
    Conexao conncliente = new Conexao();
    
    private int codigo;
    private String nome;
    private String telefone;
    private String email;

    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public void cadastrar(){
        
        String sql = "INSERT INTO clientes (codigo, nome, telefone, email) VALUES (" 
        + getCodigo() + ", '" 
        + getNome() + "', '" 
        + getTelefone() + "', '" 
        + getEmail() + "')";
        
        conncliente.executeSQL(sql);
        JOptionPane.showMessageDialog(null, 
                "Cadastrado com sucesso!");
        
    }
    
    public ResultSet consultar(){
        
        ResultSet tabela;
        tabela = null;
        String sql = "select * from clientes";
        tabela = conncliente.RetornarResultset(sql);
        return tabela;
    }
    
}
