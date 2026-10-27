---
disciplina: DSM2/TPI
titulo: ClienteRepository
fonte: DSM2/TPI/Spring/exemplo2BD/src/main/java/br/com/springboot/exemplo2BD/repository/ClienteRepository.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
package br.com.springboot.exemplo2BD.repository;

import br.com.springboot.exemplo2BD.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
}
```
