---
disciplina: DSM2/TPI
titulo: Fornecedor
fonte: DSM2/TPI/Spring/cadastroDeFornecedores/src/main/java/br/com/springboot/cadastroDeFornecedores/model/Fornecedor.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
package br.com.springboot.cadastroDeFornecedores.model;

import jakarta.persistence.*;

@Entity
@Table(name = "contatos")
public class Fornecedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nome;
    private String nomeProduto;
    private String descricaoProduto;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNomeProduto() {
        return nomeProduto;
    }

    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }

    public String getDescricaoProduto() {
        return descricaoProduto;
    }

    public void setDescricaoProduto(String descricaoProduto) {
        this.descricaoProduto = descricaoProduto;
    }
}
```
