const { Schema, model } = require('mongoose');

const DependentSchema = new Schema({
    name: {
        type: String,
        required: true,
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
    idAssociado: {
        type: String,
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
    urlDep: {
        type: String,
        required: false,
        unique: true
    }
},
    {
        timestamps: true,
    });

module.exports = model('Dependent', DependentSchema);