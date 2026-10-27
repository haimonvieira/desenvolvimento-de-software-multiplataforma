---
disciplina: DSM2/TPI
titulo: Cliente
fonte: DSM2/TPI/Spring/exemplo2BD/src/main/java/br/com/springboot/exemplo2BD/model/Cliente.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
package br.com.springboot.exemplo2BD.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nome;
    private String telefone;
    private String endereco;

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

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }
}
```
