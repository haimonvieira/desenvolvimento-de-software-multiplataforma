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
public class Passagem {

    Conexao con = new Conexao();
    private int codigo;
    private String nomePassageiro;
    private String telefone;
    private String rg;
    private String localViagem;
    private String data;
    private String horario;
    private int numeroPoltrona;

    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

    public String getNomePassageiro() {
        return nomePassageiro;
    }

    public void setNomePassageiro(String nomePassageiro) {
        this.nomePassageiro = nomePassageiro;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getLocalViagem() {
        return localViagem;
    }

    public void setLocalViagem(String localViagem) {
        this.localViagem = localViagem;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public int getNumeroPoltrona() {
        return numeroPoltrona;
    }

    public void setNumeroPoltrona(int numeroPoltrona) {
        this.numeroPoltrona = numeroPoltrona;
    }
    
    public void cadastrar() {
        String sql;
        sql = "insert into passagens(codigo, nome, telefone, rg, local, "
                + "data, horario, numero_poltrona)values" 
                + "( " + "" + getCodigo() + " ,'" + getNomePassageiro()
                + "' ,'" + getTelefone()+ "', '"+ getRg()
                + "', '" + getLocalViagem()+ "' ,'" + getData()
                + "' ,'" + getHorario()+ "' ,'" + getNumeroPoltrona()
                + "'"
                + ")";
        con.executeSQL(sql);
        JOptionPane.showMessageDialog(null, "Gravado com Sucesso...");
    }

    public void excluir() {
        String sql;
        sql = "delete FROM passagens WHERE codigo=" + getCodigo() + "";
        con.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Excluido com sucesso...");

    }

    public void alterar() {
        String sql;
        sql = "UPDATE passagens set nome='" + getNomePassageiro() + "' ,telefone= '" 
                + getTelefone()+ "' , rg= '" + getRg() + "' ,local= '" 
                + getLocalViagem()+ "' , data= '" 
                + getData() + "' ,horario= '" + getHorario()
                + "' ,numero_poltrona= '" + getNumeroPoltrona()
                + "' WHERE codigo=" + getCodigo() + "";

        con.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Alterado com sucesso...");
    }

    public ResultSet consultar() {
        ResultSet tabela;
        tabela = null;

        String sql = "Select * from passagens";
        tabela = con.RetornarResultset(sql);
        return tabela;
    }

}
