package br.com.springboot.cadastroDeContato.repository;

import br.com.springboot.cadastroDeContato.model.Contato;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContatoRepository extends JpaRepository<Contato, Integer> {



}
