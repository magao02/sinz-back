const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const jwt = require("jsonwebtoken");
const createURL = require("../../utils/createURL.js");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

async function getUserYears(req, res) {
  const urlUser = req.params.urlUser;
  let user = await User.findOne({ urlUser });

  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Perfil não encontrado." });
  }

  let impostos = await Imposto.find({ idUser: user._id });

  let anos = [];

  for (var i = 0; i < impostos.length; i++) {
    anos.push(impostos[i].ano);
  }
  return res.status(HTTP_CODE_OK).json({ anosUsuario: anos });
}

module.exports = getUserYears;
