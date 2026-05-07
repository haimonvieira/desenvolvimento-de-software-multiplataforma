import express from "express";
const router = express.Router(); //cria rotas


//Importando models
import Usuario from "../models/Usuario.js";

//Importando bcrypt
import bcrypt from "bcrypt";
// import express from "express";

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/cadastro", (req, res) => {
  res.render("cadastro");
});

//Rota de criação de usuario no banco
router.post("/caduser", (req, res) => {
  //Coletando dados do formulario
  const email = req.body.email;
  const senha = req.body.senha;

  //Verificar se o usuario ja existe
  Usuario.findOne({
    where: {
      email: email,
    },
  }).then((usuario) => {

    if (usuario == undefined) {
      //Hash de senha
      const salt = bcrypt.genSaltSync(10); //Criando "sal" de senha
      const hash = bcrypt.hashSync(senha, salt);

      //Enviar para o banco
      Usuario.create({
        email: email,
        senha: hash,
      })
        .then(() => {
          console.log("Usuario cadastrado com sucesso!");
          res.redirect("/login");
        })
        .catch((erro) => {
          console.log("Erro ao cadastrar usuario: " + erro);
        });
    }else{
        res.send(`Usuário já cadastrado!
                <br>
                <a href="/login">Faça o login.</a>
            `);
    }

  });
});

//Rota de autenticação (login)
router.post("/autenticacao", (req, res) => {

    //Capturando os dados do formulario
    const email = req.body.email;
    const senha = req.body.senha;

    Usuario.findOne({
        where:{
            email: email
        }
        //tratamdp promise
    }).then(usuario => {
        //Se usuario existir
        if(usuario != undefined){

            //Validar senha
            const correct = bcrypt.compareSync(senha, usuario.senha);

            //Se senha for valida
            if(correct){
                //Autoriza login

                //Armazenando os dados na sessao

                req.session.usuario = {
                    id: usuario.id,
                    email: usuario.email
                }
                res.send(`Sessão do usuário criada com sucesso!
                    <br>id: ${req.session.usuario['id']}<br>
                    Email: ${req.session.usuario['email']}
                    `)
            }else{
                res.send(`Senha inválida! 
                    <br><a href="/login">Tente novamente.</a>
                    `);
            }

        //Usuario nao existir
        }else{ 
            res.send(`Usuario não existe.
                <br><a href="/cadastro">Cadastre-se</a>
                `);
        }
    })


})

//Exportar módulo
export default router;
