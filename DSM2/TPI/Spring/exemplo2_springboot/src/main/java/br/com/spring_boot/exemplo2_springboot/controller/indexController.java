package br.com.spring_boot.exemplo2_springboot.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class indexController {
    @GetMapping("/dados")
    public String nome(Model model){
    model.addAttribute("mensagem", "Bem vindo Haimon");
    model.addAttribute("Ano", 2026);
    return "dados";
    }
}
