---
disciplina: DSM2/TPI
titulo: TarefaController
fonte: DSM2/TPI/Spring/Exercicios/gerenciamentoDeTarefas/src/main/java/br/com/springboot/gerenciamentoDeTarefas/controller/TarefaController.java
tipo: java
paginas: 0
extraido_em: 2026-10-24
---

```java
package br.com.springboot.gerenciamentoDeTarefas.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class TarefaController {

    @GetMapping("/cadastrar-tarefa")
    public String cadastrarTarefa(){
        return "cadastro";
    }

    @PostMapping("/salvar-tarefa")
    public String salvarTarefa(
            @RequestParam("prioridade") Integer prioridade,
            @RequestParam("tarefa") String tarefa,
            @RequestParam("descricao") String descricao,
            @RequestParam("tempoDisponivelTarefa") Integer tempoDisponivelTarefa,
            Model model
    ){

        model.addAttribute("prioridade", prioridade);
        model.addAttribute("tarefa", tarefa);
        model.addAttribute("descricao", descricao);
        model.addAttribute("tempoDisponivelTarefa", tempoDisponivelTarefa);
        model.addAttribute("sucesso", true);

        return "cadastro";
    }

}
```
