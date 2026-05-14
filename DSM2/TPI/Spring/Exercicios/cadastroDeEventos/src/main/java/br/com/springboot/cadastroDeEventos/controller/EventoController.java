package br.com.springboot.cadastroDeEventos.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class EventoController {

    @GetMapping("/cadastrar-evento")
    public String cadastrarEvento(){
        return "cadastro";
    }

    @PostMapping("/salvar-evento")
    public String salvarEvento(
            @RequestParam("dataEvento")String dataEvento,
            @RequestParam("tipoIngresso") String tipoIngresso,
            @RequestParam("quantidadePessoas") Integer quantidadePessoas,
            @RequestParam("meiaEntrada") String meiaEntrada,
            Model model
            ){
        model.addAttribute("dataEvento", dataEvento);
        model.addAttribute("tipoIngresso", tipoIngresso);
        model.addAttribute("quantidadePessoas", quantidadePessoas);
        model.addAttribute("meiaEntrada", meiaEntrada);
        model.addAttribute("sucesso", true);
        return "cadastro";

    }

}
