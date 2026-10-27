---
disciplina: DSM2/TPI
titulo: ImpostoDeRendaController
fonte: DSM2/TPI/Spring/Exercicios/dadosImpostoDeRenda/src/main/java/br/com/springboot/dadosImpostoDeRenda/controller/ImpostoDeRendaController.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
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
```
