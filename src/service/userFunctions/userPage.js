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

async function userPage(req, res) {
  const urlUser = req.params.urlUser;

  let user = await User.findOne({ urlUser });

  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Perfil não encontrado." });
  } else {
    dataPage = {
      name: user.name,
      email: user.email,
      telefone: user.telefone,
      nascimento:
        user.nascimento !== "" &&
        user.nascimento !== null &&
        user.nascimento !== undefined
          ? user.nascimento.getDate() +
            "/" +
            (user.nascimento.getMonth() + 1) +
            "/" +
            user.nascimento.getFullYear()
          : "",
      cpf: user.cpf,
      rg: user.rg,
      emissao:
        user.emissao !== "" &&
        user.emissao !== null &&
        user.emissao !== undefined
          ? user.emissao.getDate() +
            "/" +
            (user.emissao.getMonth() + 1) +
            "/" +
            user.emissao.getFullYear()
          : "",
      filiacao: user.filiacao,
      dataAfiliacao:
        user.dataAfiliacao !== "" &&
        user.dataAfiliacao !== null &&
        user.dataAfiliacao !== undefined
          ? user.dataAfiliacao.getDate() +
            "/" +
            (user.dataAfiliacao.getMonth() + 1) +
            "/" +
            user.dataAfiliacao.getFullYear()
          : "",
      regional:
        user.regional !== null &&
        user.regional !== "" &&
        user.regional !== undefined
          ? user.regional
          : "",
      profissao: user.profissao,
      endereco: user.endereco,
      salario: user.salario,
      empresa: user.empresa,
      numInscricao: user.numInscricao,
      formacaoSuperior: user.formacaoSuperior,
      instituicaoSuperior: user.instituicaoSuperior,
      dataFormacao:
        user.dataFormacao !== "" &&
        user.dataFormacao !== null &&
        user.dataFormacao !== undefined
          ? user.dataFormacao.getDate() +
            1 +
            "/" +
            (user.dataFormacao.getMonth() + 1) +
            "/" +
            user.dataFormacao.getFullYear()
          : "",
      numRegistroConselho: user.numRegistroConselho,
      dataRegistroConselho:
        user.dataRegistroConselho !== "" &&
        user.dataRegistroConselho !== null &&
        user.dataRegistroConselho !== undefined
          ? user.dataRegistroConselho.getDate() +
            1 +
            "/" +
            (user.dataRegistroConselho.getMonth() + 1) +
            "/" +
            user.dataRegistroConselho.getFullYear()
          : "",
    };
    return res.status(HTTP_CODE_OK).json(dataPage);
  }
}

module.exports = userPage;
