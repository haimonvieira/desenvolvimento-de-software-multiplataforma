---
disciplina: DSM2/TPI
titulo: FuncionarioRepository
fonte: DSM2/TPI/Spring/exemplo3_BD/src/main/java/br/com/springboot/exemplo3_BD/repository/FuncionarioRepository.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
package br.com.springboot.exemplo3_BD.repository;

import br.com.springboot.exemplo3_BD.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer> {
}
```
