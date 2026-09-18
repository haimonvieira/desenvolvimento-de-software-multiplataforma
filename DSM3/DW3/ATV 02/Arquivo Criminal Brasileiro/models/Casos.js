// Casos.js
// PROVISÓRIO: estruturado conforme o contrato global (shared/01_CONTRATO_GLOBAL.md).
// O responsável pelo Banco deve revisar e assumir este arquivo (guia 01, seção 10),
// incluindo a validação de documento aninhado com a Aula 03.1.
import mongoose from "mongoose";

// Schema aninhado de Detalhes (documento aninhado dentro de Caso)
const detalhesSchema = new mongoose.Schema({
    cidade: String,
    estado: String, // estado/UF
    anoInicio: Number,
    anoFim: Number,
    situacaoJudicial: String
});

// Schema aninhado de Producao (item da array producoes)
const producaoSchema = new mongoose.Schema({
    tmdbId: Number,
    titulo: String,
    tipo: String, // filme, série ou documentário
    ano: Number,
    sinopse: String,
    poster: String
});

// Criando o schema de Caso
const casoSchema = new mongoose.Schema({
    titulo: String,
    resumo: String,
    categorias: [String], // lista de classificações do caso
    detalhes: detalhesSchema, // documento aninhado
    producoes: [producaoSchema] // array de documentos aninhados
});

// Iniciando o Model
const Caso = mongoose.model("Caso", casoSchema);

export default Caso;
