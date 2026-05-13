package br.com.springboot.mostrarDadosProduto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProdutoController {

    @GetMapping("/produto")
    public String produto(Model model){

        model.addAttribute("nomeProduto", "Coca-cola");
        model.addAttribute("preco", "2.98");
        model.addAttribute("descricao", "Bebida");
        return "produto";
    }

}
