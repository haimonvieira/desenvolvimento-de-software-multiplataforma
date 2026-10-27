---
disciplina: DSM2/TPI
titulo: Passagem
fonte: DSM2/TPI/Spring/cadastroDePassagemDeOnibus/src/main/java/br/com/springboot/cadastroDePassagemDeOnibus/model/Passagem.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
package br.com.springboot.cadastroDePassagemDeOnibus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "contatos")
public class Passagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nomePassageiro;
    private String rg;
    private String localViagem;
    private String data;
    private String horario;
    private String numpoltrona;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNomePassageiro() {
        return nomePassageiro;
    }

    public void setNomePassageiro(String nomePassageiro) {
        this.nomePassageiro = nomePassageiro;
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

    public String getNumpoltrona() {
        return numpoltrona;
    }

    public void setNumpoltrona(String numpoltrona) {
        this.numpoltrona = numpoltrona;
    }
}
```
