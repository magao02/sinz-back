const { Schema, model } = require("mongoose");

const LivroCaixaSchema = new Schema(
  {
    mes: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    ano: {
      type: Number,
      required: true,
    },
    tipo: {
      type: String,
      required: true,
    },
    urlImagem: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("LivroCaixa", LivroCaixaSchema);
