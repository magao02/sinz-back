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
        unique: [true, "Telefone já cadastrado."],
        validate: [/^[(][0-9]{2}[)][ ][-][ ]([0-9]{8}|[0-9]{9})$/, "O campo de Telefone deve possuir o formato: +xx (xx) xxxxx-xxxx"]
    },
    nascimento: {
        type: Date,
        required: true
    },
    cpf: {
        type: String,
        required: true,
        unique: [true, "CPF já cadastrado."],
        validate: [/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, "O campo de CPF deve possuir o formato: xxx.xxx.xxx-xx"]
    },
    rg: {
        type: String,
        unique: [true, "RG já cadastrado."],
        required: true
    },
    emissao: {
        type: Date,
        required: true
    },
    filiacao: {
        type: String,
        required: true
    },
    dataAfiliacao: {
        type: Date,
        required: true
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
        required: true
    },
    numRegistroConselho: {
        type: String,
        required: true
    },
    dataRegistroConselho: {
        type: Date,
        required: true
    },
    empresa: {
        type: String,
        required: true
    },
    salario: {
        type: String,
        required: true
    },
    impostoDeRenda: {
        janeiro: {
            type: String,
            required: false,
            default: ""
        },
        fevereiro: {
            type: String,
            required: false,
            default: ""
        },
        marco: {
            type: String,
            required: false,
            default: ""
        },
        abril: {
            type: String,
            required: false,
            default: ""
        },
        maio: {
            type: String,
            required: false,
            default: ""
        },
        junho: {
            type: String,
            required: false,
            default: ""
        },
        julho: {
            type: String,
            required: false,
            default: ""
        },
        agosto: {
            type: String,
            required: false,
            default: ""
        },
        setembro: {
            type: String,
            required: false,
            default: ""
        },
        outubro: {
            type: String,
            required: false,
            default: ""
        },
        novembro: {
            type: String,
            required: false,
            default: ""
        },
        dezembro: {
            type: String,
            required: false,
            default: ""
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
        required: false
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