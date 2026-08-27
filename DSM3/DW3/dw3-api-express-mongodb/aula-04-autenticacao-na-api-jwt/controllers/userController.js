import userService from "../services/userService.js";

// Cadastrar usuario
const createUser = async (req, res) => {
    try{
        const {email, password} = req.body
        await userService.create(email, password)
        res.status(201).json({message: "Usuario cadastrado com sucesso"}) // 201 - Created

    }catch(error){
        console.log(error)
        res.status(500).json({error: "Erro interno no servidor"})
    }
}

// Funcao para logar
const loginUser = async (req, res) => {

    try{
        const {email, password} = req.body
        const user = await userService.getOne(email)

        res.status(200).json({message: "Usuario logado com sucesso"})

    }catch(error){
        console.log(error)
        res.status(500).json({error: "Erro interno no servidor"})
    }

}

export default {createUser, loginUser}