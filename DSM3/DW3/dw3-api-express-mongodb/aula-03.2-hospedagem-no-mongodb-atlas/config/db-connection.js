import mongoose from "mongoose";
import dotenv from 'dotenv' // Carrega as variáveis do arquivo .env
dotenv.config({
    path: ['.env', 'atlas-credentials.env']
});
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Força o uso do DNS do Google


const dbUser = process.env.MONGODB_USERNAME;
const dbPassword = process.env.MONGODB_PASSWORD;

const connect = () => {

    mongoose.connect(
        `mongodb+srv://${dbUser}:${dbPassword}@cluster0.7zenwrs.mongodb.net/apithegames?retryWrites=true&w=majority&appName=Cluster0`
    )

    const connection = mongoose.connection
    connection.on("error", () => {
        console.log("Erro ao conectar ao mongoDB")
    })
    connection.on("open", () => {
        console.log("Conectado ao mongoBD com sucesso")
    })

}

connect()
export default mongoose