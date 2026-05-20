package br.com.springboot.cadastroDePassagemDeOnibus.controller;

import br.com.springboot.cadastroDePassagemDeOnibus.model.Passagem;
import br.com.springboot.cadastroDePassagemDeOnibus.repository.PassagemRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class PassagemController {

    private PassagemRepository passagemRepository;

    public PassagemController(PassagemRepository passagemRepository) {
        this.passagemRepository = passagemRepository;
    }

    @GetMapping("/cadastrar")
    public String cadastrar(Model model){

        model.addAttribute("passagem", new Passagem());

        return "formulario";

    }

    @PostMapping("/salvar")
    public String salvar(Passagem passagem){

        passagemRepository.save(passagem);

        return "redirect:/cadastrar";
    }

}
