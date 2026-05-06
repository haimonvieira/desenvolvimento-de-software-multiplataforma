package com.example.exercicio01.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

    @GetMapping("/produto")
    public String home(Model model){
        model.addAttribute("nomeProduto", "Coca-cola");
        model.addAttribute("preco", 2.98);
        model.addAttribute("descricao", "Bebida");

        return "produto";
    }

}
