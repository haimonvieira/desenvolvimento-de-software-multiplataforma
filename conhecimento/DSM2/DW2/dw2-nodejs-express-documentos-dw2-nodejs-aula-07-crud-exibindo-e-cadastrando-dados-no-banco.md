---
disciplina: DSM2/DW2
titulo: DW2 NodeJS Aula 07 CRUD Exibindo e Cadastrando dados no banco
fonte: DSM2/DW2/dw2-nodejs-express/Documentos/DW2-NodeJS-Aula_07-CRUD-Exibindo e Cadastrando dados no banco.pdf
tipo: pdf
paginas: 9
extraido_em: 2026-10-24
---

<!-- page: 1 -->

 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


Aula 07.1:
CRUD - Exibindo dados

<!-- page: 2 -->

Consultando e exibindo dados
Agora iremos exibir esses dados na rota de clientes. O primeiro passo é
                                                                                                                                      {}
incluirmos no arquivo ClienteControllers.js as seguintes linhas:

import express from "express"
import Cliente from "../models/Cliente.js"
const router = express.Router()

// ROTA CLIENTES
router.get("/clientes", function(req, res){
    Cliente.findAll().then(clientes => {                                                               O método .findAll( ) do
        res.render("clientes", {                                                                       Sequelize é usado para
            clientes: clientes                                                                         buscar dados no banco.
        })
                                                                                                       O resultado da busca será
    })                                                                                                 passado a variável clientes,
})                                                                                                     que por sua vez, será o
                                                                                                       retorno da função.
export default router //exportando o módulo


                            Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 3 -->

Exibindo dados do banco na página
Com os dados sendo coletados do
                                                                                                                        {}
banco e sendo repassado a nossa
view de clientes, basta que exibamos
esses dados agora em uma tabela.


Sendo assim, a cada novo cadastro
que será realizado esses dados já
serão buscados e exibidos em
seguida na página.


Para isso, configure sua view de
cliente conforme o código ao lado:


                                   Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 4 -->

Exibindo dados do banco na página
Agora, ao acessarmos a rota de clientes, teremos o seguinte resultado, com os dados sendo
                                                                                                                   {}
buscados e exibidos:


                              Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 5 -->

 Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max


Aula 07.2:
CRUD - Cadastrando dados

<!-- page: 6 -->

Cadastrando dados no banco                                                                                      {}
Agora que já aprendemos como fazer a conexão do Node com o MySQL e exibir
dados do banco, aprenderemos agora como realizar o cadastro de informações.


O primeiro passo é configurar o Express para receber dados vindo de formulários.
Para isso, incluiremos as seguintes linhas no arquivo index.js:


// Permite receber dados vindo de formulários
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


                           Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 7 -->

Cadastrando dados no banco
Em seguida, criaremos nosso formulário de cadastro na view clientes.ejs. Esse formulário permitirá o
                                                                                                                           {}
cadastro de novos clientes. Para isso, insira as linhas abaixo no arquivo cliente.ejs, logo acima da tabela
que exibe os dados dos clientes:


                                      Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 8 -->

Cadastrando dados no banco
O último passo é criar a rota de cadastro de clientes. Para isso, no arquivo
                                                                                                                  {}
ClientesController.js inclua as seguintes linhas:

// ROTA DE CADASTRO DE CLIENTES
router.post("/clientes/new", (req, res) => {
    const nome = req.body.nome
    const cpf = req.body.cpf
    const endereco = req.body.endereco
    Cliente.create({
        nome : nome,
        cpf : cpf,
        endereco : endereco
    }).then(() => {
        res.redirect("/clientes")
    })
})


Note que utilizamos o método create() do Sequelize para cadastrar dados no
banco.
                             Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max

<!-- page: 9 -->

Cadastrando dados no banco
Agora, ao inserirmos os dados de um novo cliente no formulário e clicar no botão Cadastrar,
                                                                                                                   {}
ele será registrado no banco de dados e já exibido na página:


                              Fatec Registro – Curso: DSM - Disciplina: Desenvolvimento Web II – Prof. Diego Max
