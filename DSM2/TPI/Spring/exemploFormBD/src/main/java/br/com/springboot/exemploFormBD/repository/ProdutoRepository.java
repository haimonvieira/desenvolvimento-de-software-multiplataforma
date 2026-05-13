package br.com.springboot.exemploFormBD.repository;

import br.com.springboot.exemploFormBD.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Integer> {



}
