---
disciplina: DSM2/TPI
titulo: CatalogoController
fonte: DSM2/TPI/Spring/Exercicios/catalogoDePecas/src/main/java/br/com/springboot/catalogoDePecas/controller/CatalogoController.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
package br.com.springboot.catalogoDePecas.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class CatalogoController {

    @GetMapping("/cadastrar-peca")
    public String cadastrarPeca(){
        return "cadastro";
    }

    @PostMapping("/salvar-peca")
    public String salvarPeca(
            @RequestParam("nomePeca") String nomePeca,
            @RequestParam("corrente") String corrente,
            @RequestParam("categoria") String categoria,
            @RequestParam("quantidadeEstoque") Integer quantidadeEstoque,
            @RequestParam("tensao") Integer tensao,
            Model model
    ){

        model.addAttribute("nomePeca", nomePeca);
        model.addAttribute("corrente", corrente);
        model.addAttribute("categoria", categoria);
        model.addAttribute("quantidadeEstoque", quantidadeEstoque);
        model.addAttribute("tensao", tensao);
        model.addAttribute("sucesso", true);

        return "cadastro";
    }

}
```
