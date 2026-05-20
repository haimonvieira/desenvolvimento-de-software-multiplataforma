package br.com.springboot.exemplo2BD.controller;

import br.com.springboot.exemplo2BD.model.Cliente;
import br.com.springboot.exemplo2BD.repository.ClienteRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class ClienteController {

    private ClienteRepository clienteRepository;

    public ClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @GetMapping("/formulario")
    public String formulario(Model model) {
        model.addAttribute("cliente", new Cliente());

        return "formulario";
    }

    //post usado para salvar as informações
    @PostMapping("/salvar")
    //para salvar no banco
    public String salvar(Cliente cliente) {
        //o save faz o insert automaticamente na tabela
        clienteRepository.save(cliente);

        //o redirect serve para não repetir os dados no banco de dados
        return "redirect:/formulario";
    }
}
