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
      unique: [true, "CPF já cadastrado."],
      validate: [
        /^\d{3}\d{3}\d{3}\d{2}$/,
        "O campo de CPF deve possuir apenas 11 digitos.",
      ],
    },
    rg: {
      type: String,
      unique: [true, "RG já cadastrado."],
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
