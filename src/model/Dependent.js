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
    }
},
    {
        timestamps: true,
    });

module.exports = model('Dependent', DependentSchema);