package br.com.springboot.cadastroDePassagemDeOnibus.repository;

import br.com.springboot.cadastroDePassagemDeOnibus.model.Passagem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassagemRepository extends JpaRepository<Passagem, Integer> {



}
