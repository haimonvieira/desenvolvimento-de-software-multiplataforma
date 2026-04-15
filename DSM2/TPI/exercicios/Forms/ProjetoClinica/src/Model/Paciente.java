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
public class Paciente {

    Conexao con = new Conexao();
    private int codigo;
    private String nomePaciente;
    private String endereco;
    private String complemento;
    private String rg;
    private String cpf;
    private String dataNascimento;

    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

    public String getNomePaciente() {
        return nomePaciente;
    }

    public void setNomePaciente(String nomePaciente) {
        this.nomePaciente = nomePaciente;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(String dataNascimento) {
        this.dataNascimento = dataNascimento;
    }
    
    public void cadastrar() {
        String sql;
        sql = "Insert into pacientes(codigo, nome, endereco, complemento, rg, cpf, "
                + "data_nascimento)values" 
                + "( " 
                + "" + getCodigo() + " ,'" + getNomePaciente()
                + "' ,'" + getEndereco() + "', '"
                + getComplemento() + "', '" + getRg() + "' ,'" 
                + getCpf()+ "' ,'" + getDataNascimento()+ "'"
                + ")";
        con.executeSQL(sql);
        JOptionPane.showMessageDialog(null, "Gravado com Sucesso...");
    }

    public void excluir() {
        String sql;
        sql = "delete FROM pacientes WHERE codigo=" + getCodigo() + "";
        con.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Excluido com sucesso...");

    }

    public void alterar() {
        String sql;
        sql = "UPDATE pacientes set endereco='" + getEndereco()+ "' ,complemento= '" 
                + getComplemento()+ "' , rg= '" + getRg() + "' ,cpf= '" 
                + getCpf() + "' , data_nascimento= '" 
                + getDataNascimento()
                + "' WHERE codigo='" + getCodigo() + "' ";

        con.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Alterado com sucesso...");
    }

    public ResultSet consultar() {
        ResultSet tabela;
        tabela = null;

        String sql = "Select * from pacientes";
        tabela = con.RetornarResultset(sql);
        return tabela;
    }

}
