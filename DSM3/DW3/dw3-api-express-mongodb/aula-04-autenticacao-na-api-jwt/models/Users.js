import mongoose, { mongo } from "mongoose";

//Criando o schema de usuario
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = mongoose.model("User", userSchema)

export default User