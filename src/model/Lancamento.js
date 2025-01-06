const { Schema, model } = require("mongoose");

const LancamentoSchema = new Schema(
  {
    descricao: {
      type: String,
      required: true,
    },
    data: {
      type: Date,
      required: true
    },
    valor: {
      type: Number,
      required: true,
    },
    tipo: {
      type: String,
      required: true,
      enum: ["recebimento", "despesa"],
    },
    idAssociado: {
      type: String,
      required: false,
    },
    urlComprovante: {
      type: String,
      required: false,
    },
    

  },

  {
    timestamps: true,
  }
);

module.exports = model("Lancamento", LancamentoSchema);
