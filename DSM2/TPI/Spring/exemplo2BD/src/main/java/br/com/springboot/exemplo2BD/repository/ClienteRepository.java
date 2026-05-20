package br.com.springboot.exemplo2BD.repository;

import br.com.springboot.exemplo2BD.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
}
