---
disciplina: DSM2/TPI
titulo: ProdutoController
fonte: DSM2/TPI/Spring/Exercicios/mostrarDadosProduto/src/main/java/br/com/springboot/mostrarDadosProduto/controller/ProdutoController.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
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
```
