package br.com.spring.avaliacaoTP1.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class BolsaController {

    @GetMapping("/")
    public String cadastrar(){
        return "cadastro";
    }

    @PostMapping("/salvar")
    public String salvar(
            @RequestParam("nome") String nome,
            @RequestParam("preco") String preco,
            @RequestParam("categoria") String categoria,
            Model model
    ){

        model.addAttribute("nome", nome);
        model.addAttribute("preco", preco);
        model.addAttribute("categoria", categoria);
        model.addAttribute("sucesso", true);

        return "cadastro";
    }

}
