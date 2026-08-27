import mongoose, { mongo } from "mongoose";

const descriptionSchema = new mongoose.Schema({
    genre: String,
    platform: String,
    rating: String
})

//Criando schema de Games
const gameSchema = new mongoose.Schema({
    title: String,
    year: Number,
    platform: String,
    price: Number,
    descriptions: descriptionSchema
});

// Criando coleção e estrutura de dados (schema)
const Game = mongoose.model('Game', gameSchema);

export default Game;