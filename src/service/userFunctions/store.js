const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const createURL = require("../../utils/createURL.js");
const formataData = require("../../utils/dateFunctions");
const jwt = require("jsonwebtoken");
const { findById, db, collection } = require("@model/Imposto");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

async function store(req, res) {
  let {
    name,
    email,
    password,
    telefone,
    nascimento,
    cpf,
    rg,
    emissao,
    filiacao,
    profissao,
    endereco,
    regional,
    numInscricao,
    dataAfiliacao,
    formacaoSuperior,
    instituicaoSuperior,
    dataFormacao,
    numRegistroConselho,
    dataRegistroConselho,
    empresa,
    salario,
  } = req.body;

  for (const field in req.body) {
    if (!req.body[field]) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json({ message: "Preencha todos os campos." });
    }
  }

  if (endereco.complemento === "") {
    endereco.complemento = "Nenhum";
  }

  let user = await User.findOne({ cpf });

  if (!user) {
    let urlUser = await createURL(name);

    try {
      nascimento = await formataData(nascimento);
      emissao = await formataData(emissao);
      dataAfiliacao = await formataData(dataAfiliacao);
      dataFormacao = await formataData(dataFormacao);
      dataRegistroConselho = await formataData(dataRegistroConselho);
    } catch (err) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json("Data inserida incorretamente. Formato correto: dd/mm/aaaa");
    }

    try {
      user = await User.create({
        name,
        email,
        password,
        telefone,
        nascimento,
        cpf,
        rg,
        emissao,
        filiacao,
        profissao,
        endereco,
        regional,
        numInscricao,
        dataAfiliacao,
        formacaoSuperior,
        instituicaoSuperior,
        dataFormacao,
        numRegistroConselho,
        dataRegistroConselho,
        empresa,
        salario,
        urlUser,
      });
      let imposto = await Imposto.create({ idUser: user._id });
      user = await User.findByIdAndUpdate(user._id, {
        impostoDeRenda: imposto._id,
      });
    } catch (e) {
      if (e.hasOwnProperty("code") && e.code === 11000) {
        return res.status(HTTP_CODE_BAD_REQUEST).json({
          message: "Valor de " + Object.keys(e.keyValue)[0] + " já cadastrado.",
        });
      } else {
        return res.status(HTTP_CODE_BAD_REQUEST).json({ message: e.message });
      }
    }
    return res
      .status(HTTP_CODE_CREATED)
      .json({ message: "Usuário cadastrado com sucesso." });
  } else {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "CPF já cadastrado." });
  }
}

module.exports = store;
