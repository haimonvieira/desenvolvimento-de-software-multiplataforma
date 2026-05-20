package br.com.springboot.exemplo3_BD.repository;

import br.com.springboot.exemplo3_BD.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer> {
}
