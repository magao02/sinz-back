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

async function setPerfil(req, res) {
  const urlUser = req.params.urlUser;

  let user = await User.findOne({ urlUser });

  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Perfil não encontrado." });
  }

  if (user._id.equals(req.userId) || req.user.admin) {
    let {
      name,
      email,
      telefone,
      nascimento,
      rg,
      filiacao,
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
      password,
      profissao,
    } = req.body;

    if (nascimento !== undefined && nascimento !== "" && nascimento !== null) {
      nascimento = nascimento.split("/");
      nascimento = new Date(
        `${nascimento[2]}-${nascimento[1]}-${nascimento[0]}T01:00:00+01:00`
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

    user = await User.findByIdAndUpdate(user._id, {
      name: name !== undefined && name !== "" ? name : user.name,
      email: email !== undefined && email !== "" ? email : user.email,
      telefone:
        telefone !== undefined && telefone !== "" ? telefone : user.telefone,
      nascimento:
        nascimento !== undefined && nascimento !== ""
          ? nascimento
          : user.nascimento,
      rg: rg !== undefined && rg !== "" ? rg : user.rg,
      filiacao:
        filiacao !== undefined && filiacao !== "" ? filiacao : user.filiacao,
      numInscricao:
        numInscricao !== undefined && numInscricao !== ""
          ? numInscricao
          : user.numInscricao,
      dataAfiliacao:
        dataAfiliacao !== undefined && dataAfiliacao !== ""
          ? dataAfiliacao
          : user.dataAfiliacao,
      formacaoSuperior:
        formacaoSuperior !== undefined && formacaoSuperior !== ""
          ? formacaoSuperior
          : user.formacaoSuperior,
      instituicaoSuperior:
        instituicaoSuperior !== undefined && instituicaoSuperior !== ""
          ? instituicaoSuperior
          : user.instituicaoSuperior,
      dataFormacao:
        dataFormacao !== undefined && dataFormacao !== ""
          ? dataFormacao
          : user.dataFormacao,
      numRegistroConselho:
        numRegistroConselho !== undefined && numRegistroConselho !== ""
          ? numRegistroConselho
          : user.numRegistroConselho,
      dataRegistroConselho:
        dataRegistroConselho !== undefined && dataRegistroConselho !== ""
          ? dataRegistroConselho
          : user.dataRegistroConselho,
      empresa: empresa !== undefined && empresa !== "" ? empresa : user.empresa,
      salario: salario !== undefined && salario !== "" ? salario : user.salario,
      password:
        password !== undefined && password !== "" ? password : user.password,
      profissao:
        profissao !== undefined && profissao !== ""
          ? profissao
          : user.profissao,
      endereco: {
        rua:
          endereco !== undefined &&
          endereco.rua !== undefined &&
          endereco.rua !== ""
            ? endereco.rua
            : user.endereco.rua,
        bairro:
          endereco !== undefined &&
          endereco.bairro !== undefined &&
          endereco.bairro !== ""
            ? endereco.bairro
            : user.endereco.bairro,
        complemento:
          endereco !== undefined &&
          endereco.complemento !== undefined &&
          endereco.complemento !== ""
            ? endereco.complemento
            : user.endereco.complemento,
        numero:
          endereco !== undefined &&
          endereco.numero !== undefined &&
          endereco.numero !== ""
            ? endereco.numero
            : user.endereco.numero,
      },
      regional: {
        municipio:
          regional !== undefined &&
          regional.municipio !== undefined &&
          regional.municipio !== ""
            ? regional.municipio
            : user.regional.municipio,
        estado:
          regional !== undefined &&
          regional.estado !== undefined &&
          regional.estado !== ""
            ? regional.estado
            : user.regional.estado,
        naturalidade:
          regional !== undefined &&
          regional.naturalidade !== undefined &&
          regional.naturalidade !== ""
            ? regional.naturalidade
            : user.regional.naturalidade,
        nacionalidade:
          regional !== undefined &&
          regional.nacionalidade !== undefined &&
          regional.nacionalidade !== ""
            ? regional.nacionalidade
            : user.regional.nacionalidade,
      },
    });

    return res
      .status(HTTP_CODE_OK)
      .json({ message: "Perfil alterado com sucesso." });
  }
  return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });
}

module.exports = setPerfil;
