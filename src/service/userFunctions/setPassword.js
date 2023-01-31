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

async function setPassword(req, res) {
  const { password, cpf } = req.body;

  let user = await User.findOne({ cpf });

  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Perfil não encontrado." });
  }

  if (user._id.equals(req.userId)) {
    user = await User.findByIdAndUpdate(user._id, {
      password: password !== undefined ? password : user.password,
    });

    let response = {
      message: "Senha alterada com sucesso.",
    };
    return res.status(HTTP_CODE_OK).json(response);
  }
  return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });
}

module.exports = setPassword;
