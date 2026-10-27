---
disciplina: DSM2/TPI
titulo: Contato
fonte: DSM2/TPI/Spring/cadastroDeContato/src/main/java/br/com/springboot/cadastroDeContato/model/Contato.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
package br.com.springboot.cadastroDeContato.model;

import jakarta.persistence.*;

@Entity
@Table(name = "contatos")
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String telefone;
    private String endereco;
    private String cidade;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }
}
```
