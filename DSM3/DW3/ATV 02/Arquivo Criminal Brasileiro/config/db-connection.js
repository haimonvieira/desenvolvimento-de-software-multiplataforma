// config/db-connection.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Força o uso do DNS do Google

dotenv.config();

const dbUser = process.env.MONGODB_USERNAME;
const dbPassword = process.env.MONGODB_PASSWORD;
const dbCluster = process.env.MONGODB_CLUSTER;
const dbName = process.env.MONGODB_DATABASE;

const connect = () => {
  mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@${dbCluster}/${dbName}?retryWrites=true&w=majority`
  );

  const connection = mongoose.connection;

  connection.on("error", () => {
    console.log("Erro ao conectar com o MongoDB.");
  });

  connection.on("open", () => {
    console.log("Conectado ao MongoDB com sucesso!");
  });
};

connect();

export default mongoose;