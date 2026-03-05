//1
const listaClientes = [
    {
        nome: "João",
        endereco: "Rua A, 123",
        cpf: 12345678909
    },
    {
        nome: "Ramada da Tataer",
        endereco: "Rua Reooa, 1454",
        cpf: 12345678909
    },
    {
        nome: "Loli Pop",
        endereco: "Avenida Rios",
        cpf: 12345678909
    }
];

//2
listaClientes.forEach( cliente => {
    document.writeln(
        `
        Nome: ${cliente.nome} <br>
        Endereço: ${cliente.endereco} <br>
        CPF: ${cliente.cpf} <br><br>
        `
    );
});

//3
listaClientes.push(
    {
        nome: "Haimon",
        endereco: "Rua Haimon",
        cpf: 123123213
    }
)

document.writeln(`<h4>Lista atualizada</h4>`);

listaClientes.forEach(cliente => {
     document.writeln(
        `
        Nome: ${cliente.nome} <br>
        Endereço: ${cliente.endereco} <br>
        CPF: ${cliente.cpf} <br><br>
        `
    );
});

//4
listaClientes.unshift(
    {
        nome: "Diego Max",
        endereco: "Dieguinho Godoi",
        cpf: 123123213
    }
);

document.writeln(`<h4>Lista atualizada</h4>`);

listaClientes.forEach(cliente => {
     document.writeln(
        `
        Nome: ${cliente.nome} <br>
        Endereço: ${cliente.endereco} <br>
        CPF: ${cliente.cpf} <br><br>
        `
    );
});

//5
document.writeln(`Há ${listaClientes.length} clientes`);