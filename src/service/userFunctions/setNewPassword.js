const User = require("../../model/User");
const Token = require("../../model/Token.");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

async function setNewPassword(req, res) {
  try {
    const user = await User.findOne({ email: req.params.userEmail });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .send("Link inválido ou expirado");
    }

    user.password = req.body.password;

    await User.updateOne(user);
    await Token.deleteOne(token);

    res.status(HTTP_CODE_OK).json({
      message: "Senha alterada com sucesso",
    });
  } catch (error) {
    console.log(error);
    res.send("Um erro inesperado aconteceu. Tente novamente mais tarde");
  }
}

module.exports = setNewPassword;
