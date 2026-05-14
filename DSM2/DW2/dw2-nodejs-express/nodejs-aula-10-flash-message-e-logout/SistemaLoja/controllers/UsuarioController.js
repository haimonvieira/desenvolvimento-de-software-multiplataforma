import express from "express";
const router = express.Router(); //cria rotas


//Importando models
import Usuario from "../models/Usuario.js";

//Importando bcrypt
import bcrypt from "bcrypt";
// import express from "express";

router.get("/login", (req, res) => {
  res.render("login", {
    // Coletando mensagem
    messages: req.flash(),
    loggedOut: true
  });
});

router.get('/logout', (req, res) => {
  // Limpando sessao
  req.session.usuario = undefined;
  res.redirect('/');
})

router.get("/cadastro", (req, res) => {
  res.render("cadastro", {
    messages: req.flash(),
    loggedOut: true
  });
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
       req.flash('warning', 'O usuário informado já existe.');
       res.redirect("/cadastro");
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

                //Envinado alerta de notificacao
                //success, warning, danger
                req.flash('success', 'Login realizado com sucesso!');
                res.redirect('/');

            }else{

                // res.send(`Senha inválida! 
                //     <br><a href="/login">Tente novamente.</a>
                //     `);

                // Enviando alerta
                req.flash('danger', 'Senha esta incorreta. Tente novamente.');
                res.redirect('/login');
                    
            }

        //Usuario nao existir
        }else{ 
            req.flash('warning', 'O usuário informado não existe.');
            res.redirect('/login');
        }
    })


})

//Exportar módulo
export default router;
