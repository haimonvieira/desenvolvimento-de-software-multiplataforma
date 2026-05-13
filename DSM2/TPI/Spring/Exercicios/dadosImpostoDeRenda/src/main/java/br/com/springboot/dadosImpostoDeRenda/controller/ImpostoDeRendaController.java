package br.com.springboot.dadosImpostoDeRenda.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ImpostoDeRendaController {

    @GetMapping("/imposto")
    public String produto(Model model){

        model.addAttribute("nomeFisico", "Haimon Vieira");
        model.addAttribute("valorTotalRecebido", "R$ 10.000,00");
        model.addAttribute("quantidadeDependentes", "0");
        model.addAttribute("valorPagar", "R$ 100,00");
        return "imposto";
    }

}
