// userController.js:
// Importando o Service
import userService from "../services/userService.js";
// Importando o JSONWEBTOKEN
import jwt from 'jsonwebtoken';
// Criando um segredo para o TOKEN
const JWTSecret = 'apigamessecret'

// FUNÇÃO PARA CADASTRAR UM USUÁRIO
const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    await userService.Create(email, password);
    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    // Cod. 201: CREATED
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// FUNÇÃO PARA LOGAR UM USUÁRIO
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validar o email enviado
    if (email != undefined) {
      // Buscando o usuário pelo e-mail
      const user = await userService.getOne(email);
      // Verificando se o usuário existe
      if (user != undefined) {
        // Verificando se a senha está correta
        if (user.password == password) {
            // Se a senha estiver correta, gera o TOKEN
            jwt.sign({id: user._id, email: user.email}, JWTSecret, {expiresIn: '48h'}, (error, token) => {
              // Tratando o erro durante a geração do token
              if (error) {
                res.status(400).json({error: "Não foi possível gerar o token de autenticação."});
              // Caso sucesso
              } else {
                res.status(200).json({token});
              }
            });
        // Caso SENHA INCORRETA
        } else {
          res.status(401).json({error: "Credenciais inválidas. Tente novamente!"});
          // Cod. 401 (Unauthorized) - Não autorizado
        }
      // Caso USUÁRIO NÃO ENCONTRADO
      } else {
        res.status(404).json({error: "O usuário informado não existe."});
        // Cod. 404 (NOT FOUND)
      }
    // Caso e-mail não preenchido
    } else {
      res.status(400).json({error: "O e-mail enviado é inválido."})
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
export default { createUser, loginUser, JWTSecret};
