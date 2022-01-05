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
        validate: [/^(?:\+)[0-9]{2}\s? (?:\()[0-9]{2}(?:\))\s? [0-9]{4,5}(?:-)[0-9]{4}$/, "O campo de Telefone deve possuir o formato: +xx (xx) xxxxx-xxxx"]
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
    profissao: {
        type: String,
        required: true
    },
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
        required: false
    },
    numero: {
        type: String,
        required: false
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