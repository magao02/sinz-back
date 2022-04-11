const { Schema, model } = require('mongoose');

 const ImpostoSchema = new Schema ({
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
    },
    idUser: {
        type: String,
        required: true
    }
 });

module.exports = model('ImpostoDeRenda', ImpostoSchema);