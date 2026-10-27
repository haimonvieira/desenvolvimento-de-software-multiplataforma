---
disciplina: DSM2/TPI
titulo: Funcionario
fonte: DSM2/TPI/Spring/exemplo3_BD/src/main/java/br/com/springboot/exemplo3_BD/model/Funcionario.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
package br.com.springboot.exemplo3_BD.model;

import jakarta.persistence.*;

@Entity
@Table(name = "funcionarios")
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nome;
    private String cargo;
    private Double salario;

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

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public Double getSalario() {
        return salario;
    }

    public void setSalario(Double salario) {
        this.salario = salario;
    }
}
```
