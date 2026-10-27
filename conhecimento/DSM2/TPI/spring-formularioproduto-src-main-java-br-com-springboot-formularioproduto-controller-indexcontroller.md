---
disciplina: DSM2/TPI
titulo: IndexController
fonte: DSM2/TPI/Spring/FormularioProduto/src/main/java/br/com/springboot/FormularioProduto/controller/IndexController.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
package br.com.springboot.FormularioProduto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class IndexController {

    @GetMapping("/cadastrar-produto")
    public String abrirFormulario(){

        return "cadastro";
    }

    @PostMapping("/salvar-produto")
    public String salvar(@RequestParam("nome") String nome, @RequestParam("preco") Double preco,
                         @RequestParam("categoria") String categoria, Model model){
        //O nome do atributo nao precisa ser o mesmo que esta em RequestParam
        model.addAttribute("nome", nome);
        model.addAttribute("preco", preco);
        model.addAttribute("categoria", categoria);
        model.addAttribute("sucesso", true);
        return "cadastro";
    }



}
```
