package br.com.springboot.cadastroDeContato.controller;

import br.com.springboot.cadastroDeContato.model.Contato;
import br.com.springboot.cadastroDeContato.repository.ContatoRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class ContatoController {

    private ContatoRepository contatoRepository;

    public ContatoController(ContatoRepository contatoRepository) {
        this.contatoRepository = contatoRepository;
    }

    @GetMapping("/cadastrar")
    public String cadastrar(Model model){

        model.addAttribute("contato", new Contato());

        return "formulario";

    }

    @PostMapping("/salvar")
    public String salvar(Contato contato){

        contatoRepository.save(contato);

        return "redirect:/cadastrar";
    }

}
