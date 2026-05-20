package br.com.springboot.cadastroDeFornecedores.controller;

import br.com.springboot.cadastroDeFornecedores.model.Fornecedor;
import br.com.springboot.cadastroDeFornecedores.repository.FornecedorRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class FornecedorController {

    private FornecedorRepository fornecedorRepository;

    public FornecedorController(FornecedorRepository fornecedorRepository) {
        this.fornecedorRepository = fornecedorRepository;
    }

    @GetMapping("/cadastrar")
    public String cadastrar(Model model){

        model.addAttribute("fornecedor", new Fornecedor());

        return "formulario";

    }

    @PostMapping("/salvar")
    public String salvar(Fornecedor fornecedor){

        fornecedorRepository.save(fornecedor);

        return "redirect:/cadastrar";
    }

}
