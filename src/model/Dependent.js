const { Schema, model } = require("mongoose");
var Imposto = require("./Imposto.js");

const DependentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nascimento: {
      type: Date,
      required: false
    },
    cpf: {
      type: String,
      required: false,
    },
    rg: {
      type: String,
      required: false,
    },
    emissao: {
      type: Date,
      required: false,
    },
    idAssociado: {
      type: String,
      required: false,
    },

    impostoDeRenda: {
      type: [Imposto.schema],
      required: false,
      deafult: [],
    },
    urlDep: {
      type: String,
      required: false,
      unique: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = model("Dependent", DependentSchema);
