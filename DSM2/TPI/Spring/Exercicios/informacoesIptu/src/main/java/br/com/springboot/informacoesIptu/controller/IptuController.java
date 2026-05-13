package br.com.springboot.informacoesIptu.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IptuController {

    @GetMapping("/iptu")
    public String produto(Model model){

        model.addAttribute("localTerreno", "Registro - SP");
        model.addAttribute("areaTerreno", "100m2");
        model.addAttribute("valorIptu", "R$ 10.000,00");
        return "iptu";
    }

}
