const User = require("../../model/User");
const Token = require("../../model/Token.");
const { validacaoPassword } = require("../../utils/validationFunctions");

const HTTP_CODE_OK = 200;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;

async function setNewPassword(req, res) {
  try {
    const user = await User.findOne({ email: req.params.userEmail });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) {
      return res.status(HTTP_CODE_UNAUTHORIZED).json({
        message: "Link inválido ou expirado",
      });
    }

    if (!validacaoPassword(req.body.password)) {
      return res.status(HTTP_CODE_BAD_REQUEST).json({
        message:
          "Senha inserida com formato incorreto. Insira uma senha apenas com números e sem caracteres especiais com um tamanho de pelo menos 8 dígitos",
      });
    }

    const usuarioAtualizado = await User.findOneAndUpdate({
      id: user.id,
      password: req.body.password,
    });

    await Token.deleteOne(token);

    res.status(HTTP_CODE_OK).json({
      message: "Senha alterada com sucesso",
    });
  } catch (error) {
    console.log(error);
    return res.status(HTTP_CODE_BAD_REQUEST).json({
      message:
        "Ocorreu algum durante a operação. Verifique o Token ou tente novamente mais tarde",
    });
  }
}

module.exports = setNewPassword;
