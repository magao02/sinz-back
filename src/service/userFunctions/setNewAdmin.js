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

async function setNewAdmin(req, res) {
  if (req.user.admin) {
    const urlUser = req.params.urlUser;
    let user = await User.findOne({ urlUser });

    if (!user) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Perfil não encontrado." });
    }

    user = await User.findByIdAndUpdate(user._id, { admin: true });

    return res
      .status(HTTP_CODE_OK)
      .json({ message: "Usuário " + user.name + ", agora, é admin." });
  } else {
    return res.status(HTTP_CODE_UNAUTHORIZED).json({
      message: "Usuário sem permissão para tornar outro usuário admin.",
    });
  }
}

module.exports = setNewAdmin;
