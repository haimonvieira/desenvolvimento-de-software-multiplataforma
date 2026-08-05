package br.com.springboot.contatosProva.repository;

import br.com.springboot.contatosProva.model.Contato;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContatoRepository extends JpaRepository<Contato, Integer> {
}
