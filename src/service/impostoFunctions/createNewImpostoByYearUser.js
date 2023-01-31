const User = require("../model/User");
const Imposto = require("../model/Imposto");
const jwt = require("jsonwebtoken");
const { findById, db, collection } = require("@model/Imposto");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

async function createNewImpostoByYearUser(req, res) {
  const urlUser = req.params.urlUser;
  let user = await User.findOne({ urlUser });

  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Perfil não encontrado " });
  }

  let impostos = await Imposto.find({ idUser: user._id });

  for (let i = 0; i < impostos.length; i++) {
    if (impostos[i].ano === +req.params.ano) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json({ message: "Imposto com o ano selecionado já existente" });
    }
  }

  let imposto = await Imposto.create({
    idUser: user._id,
    ano: req.params.ano,
  });

  user = await User.findByIdAndUpdate(user._id, {
    impostoDeRenda: imposto._id,
  });

  return res.status(HTTP_CODE_CREATED).json({ message: "Imposto criado" });
}

module.exports = createNewImpostoByYearUser;
