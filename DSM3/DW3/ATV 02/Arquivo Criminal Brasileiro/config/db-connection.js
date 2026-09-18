import mongoose from "mongoose";
import dotenv from 'dotenv' // Carrega as variáveis do arquivo .env
dotenv.config({
    path: ['.env', 'atlas-credentials.env']
});
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Força o uso do DNS do Google

const dbUser = process.env.MONGODB_USERNAME;
const dbPassword = process.env.MONGODB_PASSWORD;

const connect = async () => {

    try {
        await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@cluster0.7zenwrs.mongodb.net/arquivo_criminal_brasileiro?retryWrites=true&w=majority&appName=Cluster0`
        )
    } catch (error) {
        // Enquanto as credenciais do Atlas não forem configuradas no .env,
        // a API continua no ar para permitir o desenvolvimento das rotas.
        console.log("Erro ao conectar ao mongoDB:", error.message)
    }

    const connection = mongoose.connection
    connection.on("error", (error) => {
        console.log("Erro ao conectar ao mongoDB:", error.message)
    })
    connection.on("open", () => {
        console.log("Conectado ao mongoBD com sucesso")
    })

}

connect()
export default mongoose
