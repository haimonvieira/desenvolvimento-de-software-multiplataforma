package br.com.springboot.exemploFormBD.controller;

import br.com.springboot.exemploFormBD.model.Produto;
import br.com.springboot.exemploFormBD.repository.ProdutoRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class ProdutoController {

    private ProdutoRepository produtoRepository;

    public ProdutoController (ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    @GetMapping("/formulario")
    public String formulario(Model model){
            model.addAttribute("produto", new Produto());
        return "formulario";
    }

    @PostMapping("/salvar")
    public String salvar(Produto produto){
        produtoRepository.save(produto);
        return "redirect:/formulario";
    }

}
