const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const createURL = require("../../utils/createURL.js");
const compare = require("../../utils/compareFunctions");
const jwt = require("jsonwebtoken");
const { findById, db, collection } = require("@model/Imposto");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

async function getDependents(req, res) {
  const urlUser = req.params.urlUser;

  let user = await User.findOne({ urlUser });

  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Perfil não encontrado." });
  }

  if (user._id.equals(req.userId) || req.user.admin) {
    let dependentes = user.dependentes;
    let dependetesDTO = [];

    let dep;
    let _id;

    for (var i = 0; i < dependentes.length; i++) {
      _id = dependentes[i];
      dep = await Dependent.findById({ _id });

      if (!!dep) {
        dependetesDTO.push({
          name: dep.name,
          cpf: dep.cpf,
          nascimento:
            dep.nascimento !== "" &&
            dep.nascimento !== null &&
            dep.nascimento !== undefined
              ? dep.nascimento.getDate() +
                "/" +
                (dep.nascimento.getMonth() + 1) +
                "/" +
                dep.nascimento.getFullYear()
              : "",
          rg: dep.rg,
          urlDep: dep.urlDep,
          emissao:
            dep.emissao !== "" &&
            dep.emissao !== null &&
            dep.emissao !== undefined
              ? dep.emissao.getDate() +
                "/" +
                (dep.emissao.getMonth() + 1) +
                "/" +
                dep.emissao.getFullYear()
              : "",
        });
      }
    }

    dependetesDTO.sort(compare);

    return res.status(HTTP_CODE_OK).json(dependetesDTO);
  } else {
    return res.status(HTTP_CODE_UNAUTHORIZED).json({
      message:
        "Usuário sem permissão de visualizar os dependentes desse assessor.",
    });
  }
}

module.exports = getDependents;
