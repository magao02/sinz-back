const { Schema, model } = require("mongoose");

const recreationAreaSchema = new Schema({
  titulo: {
    type: String,
    required: true,
  },
  urlRec: {
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
  capacidadeMaxima: {
    type: Number,
    required: true,
  },
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
  diaria: {
    type: Number,
    required: false,
    default: 0,
  },
  reservas: [
    {
      dataChegada: {
        type: Date,
        required: true,
      },
      dataSaida: {
        type: Date,
        required: true,
      },
      horarioChegada: {
        type: String,
        required: true,
      },
      horarioSaida: {
        type: String,
        required: true,
      },
      diaria: {
        type: Number,
        required: false,
      },
      dias: {
        type: Number,
        required: false,
      },
      idAssociado: {
        type: String,
        required: false,
      },
      hospedes: {
        pessoas: {
          type: Number,
          required: false,
          default: 1,
        },
      },
      pagamento: {
        foiPago: {
          type: Boolean,
          required: false,
          default: false,
        },
        files: [
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
  regrasConvivencia: {
    type: [String],
    required: false,
    default: [],
  },
  pictures: [
    {
      key: {
        type: String,
        required: false
      },
      url: {
        type: String,
        required: false
      }
    },
  ],
});

module.exports = model("RecreationArea", recreationAreaSchema);
