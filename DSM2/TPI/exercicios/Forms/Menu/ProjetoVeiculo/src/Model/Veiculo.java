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
public class Veiculo {

    Conexao con = new Conexao();
    private int codigo;
    private String marcaVeiculo;
    private String placa;
    private String tipoVeiculo;
    private String modeloVeiculo;
    private String chassi;

    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

    public String getMarcaVeiculo() {
        return marcaVeiculo;
    }

    public void setMarcaVeiculo(String marcaVeiculo) {
        this.marcaVeiculo = marcaVeiculo;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getTipoVeiculo() {
        return tipoVeiculo;
    }

    public void setTipoVeiculo(String tipoVeiculo) {
        this.tipoVeiculo = tipoVeiculo;
    }

    public String getModeloVeiculo() {
        return modeloVeiculo;
    }

    public void setModeloVeiculo(String modeloVeiculo) {
        this.modeloVeiculo = modeloVeiculo;
    }

    public String getChassi() {
        return chassi;
    }

    public void setChassi(String chassi) {
        this.chassi = chassi;
    }

   
    
    public void cadastrar() {
        String sql;
        sql = "insert into veiculos(codigo, marca, placa, tipo, modelo, "
                + "chassi)values" 
                + "( " + "" + getCodigo() + " ,'" + getMarcaVeiculo()
                + "' ,'" + getPlaca()+ "', '"+ getTipoVeiculo()
                + "', '" + getModeloVeiculo()+ "' ,'" + getChassi()
                + "'"
                + ")";
        con.executeSQL(sql);
        JOptionPane.showMessageDialog(null, "Gravado com Sucesso...");
    }

    public void excluir() {
        String sql;
        sql = "delete FROM veiculos WHERE codigo=" + getCodigo() + "";
        con.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Excluido com sucesso...");

    }

    public void alterar() {
        String sql;
        sql = "UPDATE veiculos set marca='" + getMarcaVeiculo()+ "' ,placa= '" 
                + getPlaca()+ "' , tipo= '" + getTipoVeiculo()+ "' ,modelo= '" 
                + getModeloVeiculo()+ "' , chassi= '" 
                + getChassi()+ "'"
                + "' WHERE codigo=" + getCodigo() + "";

        con.executeSQL(sql);
        JOptionPane.showMessageDialog(null,
                "Registro Alterado com sucesso...");
    }

    public ResultSet consultar() {
        ResultSet tabela;
        tabela = null;

        String sql = "Select * from veiculos";
        tabela = con.RetornarResultset(sql);
        return tabela;
    }

}
