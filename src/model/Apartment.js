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
      dataChegada: {
        type: String,
        required: false,
      },
      dataSaida: {
        type: String,
        required: false,
      },
      horarioChegada: {
        type: String,
        required: false,
      },
      horarioSaida: {
        type: String,
        required: false,
      },
      diaria: {
        type: Number,
        required: false,
      },
      dias: {
        type: Number,
        required: false,
      },
      hospedes: {
        adultos: {
          type: Number,
          required: false,
          default: 0,
        },
        bebes: {
          type: Number,
          required: false,
          default: 0,
        },
        criancas: {
          type: Number,
          required: false,
          default: 0,
        },
        animais: {
          type: Number,
          required: false,
          default: 0,
        },
      },
      pagamento: {
        foiPago: {
          type: Boolean,
          required: false,
          default: false,
        },
        arquivos: [
          {
            key: {
              type: String,
              required: false
            },
            url: {
              type: String,
              required: false
            },
            name: {
              type: String,
              required: false,
            }
          }
        ]
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
