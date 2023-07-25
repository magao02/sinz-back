const { Schema, model } = require("mongoose");

const ApartmentSchema = new Schema({
  titulo: {
    type: String,
    required: true,
  },
  urlApt: {
    type: String,
    required: false,
    unique: true,
  },
  endereco: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: false,
  },
  tipo: {
    type: String,
    required: true,
  },
  andar: {
    type: Number,
    required: true,
  },
  suite: {
    type: Boolean,
    required: true,
  },
  wifi: {
    type: Boolean,
    required: true,
  },
  animais: {
    type: Boolean,
    required: true,
  },
  diaria: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: false,
    default: [],
  },
  camas: [
    {
      tipo: {
        type: String,
        required: false,
      },
      quantidade: {
        type: Number,
        required: false,
      },
    },
  ],
  locaisArredores: {
    type: [String],
    required: false,
    default: [],
  },
  itens: {
    type: [String],
    required: false,
    default: [],
  },
  reservas: [
    {
      dataInicial : {
        type: String,
        required: false,
      },
      dataFinal : {
        type: String,
        required: false,
      },
      preco : {
        type: Number,
        required: false,
      },
      dias : {
        type: Number,
        required: false,
      },
      quantidadePessoas : {
        type: Number,
        required: false,
      }
    },
  ],
  areasComuns: {
    type: [String],
    required: false,
    default: [],
  },
  imageUrl: {
    type: [String],
    required: false,
    default: [],
  },
  regrasConvivencia: {
    type: [String],
    required: false,
    default: [],
  },
});

module.exports = model("Apartment", ApartmentSchema);
