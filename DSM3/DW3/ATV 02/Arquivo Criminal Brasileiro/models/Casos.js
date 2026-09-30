// models/Casos.js
import mongoose from "mongoose";

const detalhesSchema = new mongoose.Schema(
  {
    cidade: {
      type: String,
      required: true,
      trim: true,
    },
    estado: {
      type: String,
      required: true,
      trim: true,
      uppercase: true, // de brinde: salva "sp" como "SP"
      minlength: 2,
      maxlength: 2,
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
      trim: true,
    },
  },
  { _id: false }
);

const producaoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    tipo: {
      type: String,
      required: true,
      trim: true,
      enum: ["filme", "série", "documentário"],
    },
    ano: {
      type: Number,
      required: false,
    },
    sinopse: {
      type: String,
      required: false,
      trim: true,
    },
    poster: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
  },
  { _id: false }
);

const casoSchema = new mongoose.Schema({
  caso: {
    type: String,
    required: true,
    trim: true,
  },
  descricao: {
    type: String,
    required: true,
    trim: true,
  },
  categorias: {
    type: [String],
    default: [],
    // trim em cada item do array:
    set: (arr) => arr.map((s) => (typeof s === "string" ? s.trim() : s)),
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