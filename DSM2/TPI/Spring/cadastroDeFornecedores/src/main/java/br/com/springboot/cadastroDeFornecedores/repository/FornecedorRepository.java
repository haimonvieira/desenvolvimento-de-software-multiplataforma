package br.com.springboot.cadastroDeFornecedores.repository;

import br.com.springboot.cadastroDeFornecedores.model.Fornecedor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Integer> {



}
