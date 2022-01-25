const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: [true, "E-mail já cadastrado."],
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: false,
        default: false
    },
    telefone: {
        type: String,
        required: true,
        // unique: [true, "Telefone já cadastrado."],
        // validate: [/^[(][0-9]{2}[)][ ][-][ ]([0-9]{8}|[0-9]{9})$/, "O campo de Telefone deve possuir o formato: (xx) - xxxxx-xxxx"]
    },
    nascimento: {
        type: Date,
        // required: true
    },
    cpf: {
        type: String,
        required: true,
        unique: [true, "CPF já cadastrado."],
        // validate: [/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, "O campo de CPF deve possuir o formato: xxx.xxx.xxx-xx"]
    },
    rg: {
        type: String,
        // unique: [true, "RG já cadastrado."],
        required: true
    },
    emissao: {
        type: Date,
        // required: true
    },
    filiacao: {
        type: String,
        required: true
    },
    dataAfiliacao: {
        type: Date,
        // required: true
    },
    profissao: {
        type: String,
        required: true
    },
    numInscricao: {
        type: String,
        required: true
    },
    formacaoSuperior: {
        type: String,
        required: true
    },
    instituicaoSuperior: {
        type: String,
        required: true
    },
    dataFormacao: {
        type: Date,
        // required: true
    },
    numRegistroConselho: {
        type: String,
        // required: true
    },
    dataRegistroConselho: {
        type: Date,
        // required: true
    },
    empresa: {
        type: String,
        required: true
    },
    salario: {
        type: Number,
        required: true
    },
    impostoDeRenda: {
        janeiro: {
            type: Number,
            required: false,
            default: 0
        },
        fevereiro: {
            type: Number,
            required: false,
            default: 0
        },
        marco: {
            type: Number,
            required: false,
            default: 0
        },
        abril: {
            type: Number,
            required: false,
            default: 0
        },
        maio: {
            type: Number,
            required: false,
            default: 0
        },
        junho: {
            type: Number,
            required: false,
            default: 0
        },
        julho: {
            type: Number,
            required: false,
            default: 0
        },
        agosto: {
            type: Number,
            required: false,
            default: 0
        },
        setembro: {
            type: Number,
            required: false,
            default: 0
        },
        outubro: {
            type: Number,
            required: false,
            default: 0
        },
        novembro: {
            type: Number,
            required: false,
            default: 0
        },
        dezembro: {
            type: Number,
            required: false,
            default: 0
        }
    },
    endereco: {
        rua: {
            type: String,
            required: true
        },
        bairro: {
            type: String,
            required: true
        },
        complemento: {
            type: String,
            required: true
        },
        numero: {
            type: String,
            required: true
        },
    },
    regional: {
        municipio: {
            type: String,
            required: true
        },
        estado: {
            type: String,
            required: true
        },
        naturalidade: {
            type: String,
            required: true
        },
        nacionalidade: {
            type: String,
            required: true
        }
    },
    urlUser: {
        type: String,
        required: false,
        unique: true
    },
    dependentes: {
        type: [String],
        required: false,
        default: []
    },
    token_list: {
        type: [String],
        required: false,
        default: []
    },
},
    {
        timestamps: true,
    });

module.exports = model('User', UserSchema);