---
disciplina: DSM2/TPI
titulo: IndexController
fonte: DSM2/TPI/Spring/revisaoSpring/src/main/java/br/com/springboot/revisaoSpring/controller/IndexController.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
package br.com.springboot.revisaoSpring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class IndexController {

    @GetMapping("/usuario")
    public String formularioUsuario(){

        return "formUsuario";

    }

    @PostMapping("/salvar-usuario")
    public String cadastrarUsuario(
            @RequestParam("nome") String nome,
            @RequestParam("profissao") String profissao,
            @RequestParam("idade") Integer idade,
            @RequestParam("altura") Double altura,
            @RequestParam("dataNascimento") String dataNascimento,
            Model model
    ){

        model.addAttribute("nome", nome);
        model.addAttribute("profissao", profissao);
        model.addAttribute("idade", idade);
        model.addAttribute("altura", altura);
        model.addAttribute("dataNascimento", dataNascimento);
        model.addAttribute("sucesso", true);

        return "formUsuario";

    }

}
```
