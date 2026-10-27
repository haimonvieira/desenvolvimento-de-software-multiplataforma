---
disciplina: DSM2/TPI
titulo: Produto
fonte: DSM2/TPI/Spring/exemploFormBD/src/main/java/br/com/springboot/exemploFormBD/model/Produto.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
package br.com.springboot.exemploFormBD.model;

import jakarta.persistence.*;

@Entity
@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nome;
    private String descricao;
    private Double preco;

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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getPreco() {
        return preco;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }
}
```
