import mongoose, { mongo } from "mongoose";

//Criando schema de Games
const gameSchema = new mongoose.Schema({
    title: String,
    year: Number,
    platform: String,
    price: Number
});

// Criando coleção e estrutura de dados (schema)
const Game = mongoose.model('Game', gameSchema);

export default Game;