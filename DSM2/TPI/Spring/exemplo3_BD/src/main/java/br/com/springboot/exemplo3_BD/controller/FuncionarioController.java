package br.com.springboot.exemplo3_BD.controller;

import br.com.springboot.exemplo3_BD.model.Funcionario;
import br.com.springboot.exemplo3_BD.repository.FuncionarioRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class FuncionarioController {

    private FuncionarioRepository funcionarioRepository;

    public FuncionarioController(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    @GetMapping("/funcionario")
    public String formFuncionario(Model model){

        model.addAttribute("funcionario", new Funcionario());

        return  "formulario";
    }

    @PostMapping("/salvar")
    public String salvar(Funcionario funcionario){

        //Salvando os dados do funcionario na tabela do BD
        funcionarioRepository.save(funcionario);

        return "redirect:/funcionario";
    }

}
