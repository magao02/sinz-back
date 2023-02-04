const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const createURL = require("../../utils/createURL.js");
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

    // Modificando formato das datas

    if (nascimento !== undefined && nascimento !== "" && nascimento !== null) {
      nascimento = nascimento.split("/");
      nascimento = new Date(
        `${nascimento[2]}-${nascimento[1]}-${nascimento[0]}T01:00:00+01:00`
      );
    }
    if (emissao !== undefined && emissao !== "" && emissao !== null) {
      emissao = emissao.split("/");
      emissao = new Date(
        `${emissao[2]}-${emissao[1]}-${emissao[0]}T01:00:00+01:00`
      );
    }
    if (
      dataAfiliacao !== undefined &&
      dataAfiliacao !== "" &&
      dataAfiliacao !== null
    ) {
      dataAfiliacao = dataAfiliacao.split("/");
      dataAfiliacao = new Date(
        `${dataAfiliacao[2]}-${dataAfiliacao[1]}-${dataAfiliacao[0]}T01:00:00+01:00`
      );
    }
    if (
      dataFormacao !== undefined &&
      dataFormacao !== "" &&
      dataFormacao !== null
    ) {
      dataFormacao = dataFormacao.split("/");
      dataFormacao = new Date(
        `${dataFormacao[2]}-${dataFormacao[1]}-${dataFormacao[0]}T01:00:00+01:00`
      );
    }
    if (
      dataRegistroConselho !== undefined &&
      dataRegistroConselho !== "" &&
      dataRegistroConselho !== null
    ) {
      dataRegistroConselho = dataRegistroConselho.split("/");
      dataRegistroConselho = new Date(
        `${dataRegistroConselho[2]}-${dataRegistroConselho[1]}-${dataRegistroConselho[0]}T01:00:00+01:00`
      );
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