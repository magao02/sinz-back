const { Schema, model } = require("mongoose");
var Imposto = require("./Imposto.js");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    admin: {
      type: Boolean,
      required: false,
      default: false,
    },
    adminMaster: {
      type: Boolean,
      required: false,
      default: false,
    },
    telefone: {
      type: String,
      required: false,
    },
    telefoneFixo: {
      type: String,
      required: false,
    },
    nascimento: {
      type: Date,
      required: false,
    },
    cpf: {
      type: String,
      required: true,
      unique: [true, "CPF já cadastrado."],
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
    filiacao: {
      type: String,
      required: false,
    },
    dataAfiliacao: {
      type: Date,
      required: false,
    },
    profissao: {
      type: String,
      required: false,
    },
    numInscricao: {
      type: String,
      required: false,
    },
    formacaoSuperior: {
      type: String,
      required: false,
    },
    instituicaoSuperior: {
      type: String,
      required: false,
    },
    dataFormacao: {
      type: Date,
      required: false,
    },
    numRegistroConselho: {
      type: String,
      required: false,
    },
    dataRegistroConselho: {
      type: Date,
      required: false,
    },
    empresa: {
      type: String,
      required: false,
    },
    salario: {
      type: Number,
      required: false,
    },

    endereco: {
      rua: {
        type: String,
        required: false,
      },
      bairro: {
        type: String,
        required: false,
      },
      complemento: {
        type: String,
        required: false,
      },
      numero: {
        type: String,
        required: false,
      },
    },
    regional: {
      municipio: {
        type: String,
        required: false,
      },
      estado: {
        type: String,
        required: false,
      },
      naturalidade: {
        type: String,
        required: false,
      },
      nacionalidade: {
        type: String,
        required: false,
      },
    },
    urlUser: {
      type: String,
      required: true,
      unique: true,
    },
    dependentes: {
      type: [String],
      required: false,
      default: [],
    },
    token_list: {
      type: [String],
      required: false,
      default: [],
    },
    impostoDeRenda: {
      type: [Imposto.schema],
      required: false,
      deafult: [],
    },
    primeiroAcesso: {
      type: Boolean,
      required: false,
      default: true
    },

    profilePic: {
      key: {
        type: String,
        required: false
      },
      url: {
        type: String,
        required: false
      },
      seed: {
        type: Number,
        required: false
      }
    },

    isPendingSignup: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", UserSchema);
