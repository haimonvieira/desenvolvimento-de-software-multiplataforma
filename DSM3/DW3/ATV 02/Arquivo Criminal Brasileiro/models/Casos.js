// models/Casos.js
import mongoose from "mongoose";

const detalhesSchema = new mongoose.Schema(
  {
    cidade: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      required: true, // UF
    },
    anoInicio: {
      type: Number,
      required: true,
    },
    anoFim: {
      type: Number,
      required: false,
    },
    situacaoJudicial: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const producaoSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true,
    },
    titulo: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      required: true,
      enum: ["filme", "série", "documentário"],
    },
    ano: {
      type: Number,
      required: false,
    },
    sinopse: {
      type: String,
      required: false,
    },
    poster: {
      type: String,
      required: false,
      default: null,
    },
  },
  { _id: false }
);

const casoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  resumo: {
    type: String,
    required: true,
  },
  categorias: {
    type: [String],
    default: [],
  },
  detalhes: {
    type: detalhesSchema,
    required: true,
  },
  producoes: {
    type: [producaoSchema],
    default: [],
  },
});

const Caso = mongoose.model("Caso", casoSchema);

export default Caso;