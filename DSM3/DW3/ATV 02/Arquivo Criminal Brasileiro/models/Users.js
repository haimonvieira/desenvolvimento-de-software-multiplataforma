// Users.js
// PROVISÓRIO: estruturado conforme o contrato global (shared/01_CONTRATO_GLOBAL.md).
// O responsável pelo Banco deve revisar e assumir este arquivo (guia 01, seção 10).
import mongoose from "mongoose";

// Criando o schema de Usuário
const userSchema = new mongoose.Schema({
    email: String,
    password: String // armazena o hash Argon2id da senha
});

// Iniciando o Model
const User = mongoose.model("User", userSchema);

export default User;
