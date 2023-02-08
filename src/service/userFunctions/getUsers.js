const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const createURL = require("../../utils/createURL.js");
const compare = require("../../utils/compareFunctions.js");
const jwt = require("jsonwebtoken");
const { findById, db, collection } = require("@model/Imposto");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

async function getUsers(req, res) {
  if (req.user.admin) {
    let users = await User.find();
    let usersDTO = [];

    users.forEach((user) => {
      usersDTO.push({
        name: user.name !== "" ? user.name : "",
        nascimento:
          user.nascimento !== "" &&
          user.nascimento !== null &&
          user.nascimento !== undefined
            ? user.nascimento.getDate() +
              1 +
              "/" +
              (user.nascimento.getMonth() + 1) +
              "/" +
              user.nascimento.getFullYear()
            : "",
        cpf: user.cpf !== "" ? user.cpf : "",
        rg:
          user.rg !== "" && user.rg !== null && user.rg !== undefined
            ? user.rg
            : "",
        urlUser: user.urlUser !== "" ? user.urlUser : "",
        emissao:
          user.emissao !== "" &&
          user.emissao !== null &&
          user.emissao !== undefined
            ? user.emissao.getDate() +
              1 +
              "/" +
              (user.emissao.getMonth() + 1) +
              "/" +
              user.emissao.getFullYear()
            : "",
      });
    });

    usersDTO.sort(compare);

    return res.status(HTTP_CODE_OK).json(usersDTO);
  } else {
    return res.status(HTTP_CODE_UNAUTHORIZED).json({
      message: "Usuário sem permissão de visualizar os assessores.",
    });
  }
}

module.exports = getUsers;
