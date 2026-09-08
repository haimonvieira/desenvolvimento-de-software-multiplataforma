// Users.js
import mongoose from "mongoose";

// Criando o schema de Usuário
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Iniciando o Model
const User = mongoose.model("User", userSchema);

export default User;