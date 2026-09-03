// MODEL DE GAMES
// Importando o mongoose
import mongoose from "mongoose";

// Schema para documento aninhado (descriptions)
const descriptionSchema = new mongoose.Schema({
    genre: String,
    platform: String,
    rating: String
});

// Criando o schema de Games
const gameSchema = new mongoose.Schema({
    title: String,
    year: Number,
    price: Number,
    descriptions: descriptionSchema
});

const Game = mongoose.model('Game', gameSchema)

export default Game;