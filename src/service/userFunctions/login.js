const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const createURL = require("../../utils/createURL.js");
const jwt = require("jsonwebtoken");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;
async function login(req, res) {
  const { cpf, password } = req.body;
  if (cpf === undefined || password === undefined)
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Preencha todos os campos." });
  let user = await User.findOne({ cpf });
  if (!user) {
    return res
      .status(HTTP_CODE_UNAUTHORIZED)
      .json({ message: "CPF não cadastrado" });
  } else {
    if (user.password === password) {
      let idUser = user._id;
      const token = jwt.sign({ idUser }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24, // expires in 24 hours
      });

      let new_token_list = user.token_list;
      new_token_list.push(token);
      user = await User.findByIdAndUpdate(user._id, {
        token_list: new_token_list,
      });

      let response = {
        auth: true,
        token: `Bearer ` + token,
        admin: user.admin,
        primeiroAcesso: user.primeiroAcesso,

        name: user.name,
        urlUser: user.urlUser,
      };

      if(user.primeiroAcesso) {
        await User.findByIdAndUpdate(user.id, {
          primeiroAcesso: false
        })
      }
      
      return res.status(HTTP_CODE_OK).json(response);
    } else {
      return res
        .status(HTTP_CODE_UNAUTHORIZED)
        .json({ message: "Senha inválida" });
    }
  }
}

module.exports = login;
