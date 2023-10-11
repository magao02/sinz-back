const User = require("../../model/User");
const createURL = require("../../utils/createURL.js");
const isStringBlank = require("../../utils/isStringBlank");
const {
  validacaoPassword,
  validacaoTelefone,
  validacaoCPF,
} = require("../../utils/validationFunctions");
const {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_CREATED,
  HTTP_CODE_UNAUTHORIZED,
} = require("../../utils/httpStatus");

async function createIncompleteUser(req, res) {
  if (!req.user.admin) {
    return res
      .status(HTTP_CODE_UNAUTHORIZED)
      .json({ message: "Usuário não tem permissão." });
  }

  let {
    name,
    email,
    cpf,
    password,
    admin,
  } = req.body;

  if (isStringBlank(name)) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Preencha o campo name" });
  }

  if (isStringBlank(password)) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Preencha o campo password" });
  }

  if (isStringBlank(cpf)) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Preencha o campo cpf" });
  } else {
    if (!validacaoCPF(cpf)) {
      return res.status(HTTP_CODE_BAD_REQUEST).json({
        message:
          "CPF inserido com formato incorreto. O CPF deve ser inserido sem pontuação e deve ter 11 dígitos.",
      });
    }
  }

  if (!req.user.adminMaster) {
    admin = false;
  }

  let user = await User.findOne({ cpf });

  if (!user) {
    let urlUser = await createURL(name);

    if (!validacaoPassword(password)) {
      return res.status(HTTP_CODE_BAD_REQUEST).json({
        message:
          "Senha inserida com formato incorreto. Insira uma senha apenas com números e sem caracteres especiais com um tamanho de pelo menos 8 dígitos",
      });
    }

    try {
      user = await User.create({
        name,
        email,
        password,
        cpf,
        urlUser,
        admin,
        isPendingSignup: true,
      });

      return res.status(HTTP_CODE_CREATED).json({
        message: "Usuário cadastrado com sucesso",
        user: user,
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
  } else {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "CPF já cadastrado." });
  }
}

module.exports = createIncompleteUser;
