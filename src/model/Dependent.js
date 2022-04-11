const { Schema, model } = require('mongoose');

const DependentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    nascimento: {
        type: Date,
        // required: true
    },
    cpf: {
        type: String,
        // required: true,
        // unique: [true, "CPF já cadastrado."],
        // validate: [/^\d{3}\d{3}\d{3}\d{2}$/, "O campo de CPF deve possuir apenas 11 digitos."]
    },
    rg: {
        type: String,
        // unique: [true, "RG já cadastrado."],
        // required: true
    },
    emissao: {
        type: Date,
        // required: true
    },
    idAssociado: {
        type: String,
        required: true
    },

    ImpostoDeRenda: {
        type: Schema.Types.ObjectId,
        ref: 'ImpostoDeRenda'
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