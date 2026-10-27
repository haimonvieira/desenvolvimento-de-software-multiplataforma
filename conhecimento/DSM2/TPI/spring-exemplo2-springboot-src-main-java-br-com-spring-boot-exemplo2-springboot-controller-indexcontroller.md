---
disciplina: DSM2/TPI
titulo: indexController
fonte: DSM2/TPI/Spring/exemplo2_springboot/src/main/java/br/com/spring_boot/exemplo2_springboot/controller/indexController.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
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
```
