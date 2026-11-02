// Middleware de Autenticação
import jwt from "jsonwebtoken"
import userController from "../controllers/userController.js"

//Função que ira verificar se o usuario possui um token valido
const Authorization = (req, res, next) => {

    //Capturando o token do cabeçalho da requisicao
    const authToken = req.headers['authorization']

    //Se o token nao for vazio
    if(authToken != undefined){

        const bearer = authToken.split(' ')
        const token = bearer[1] // Capturando o token com split de 'Bearer token'

        //Validando o token com JWT
        jwt.verify(token, userController.JWTSecret, (error, data) => {
            //Se o token for invalido
            if(error){
                res.status(401).json({error: "Token inválido"}) // 401 Unauthorized
            //Se o token  for valido
            }else{
                req.token = token
                req.loggedUser = {
                    id: data.id,
                    email: data.email
                }
                //Permite prosseguir com a requisição
                next()
            }
        })
    //Se o token estiver vazio
    }else{

        res.status(401).json({error: "Token nao informado"})

    }

}

export default {Authorization}