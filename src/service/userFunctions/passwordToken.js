const User = require("../../model/User");
const crypto = require("crypto");
const Token = require("../../model/Token.");
const {
  HTTP_CODE_OK,
  HTTP_CODE_BAD_REQUEST,
} = require("../../utils/httpStatus");

async function passwordToken(req, res) {
  try {
    const user = await User.findOne({ email: req.params.userEmail });

    let token = await Token.findOne({ userId: user._id });

    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    return res.status(HTTP_CODE_OK).json({
      token: token.token,
    });
  } catch (error) {
    return res.status(HTTP_CODE_BAD_REQUEST).json({
      message: "Ocorreu algum erro durante o envio. Tente novamente mais tarde",
    });
  }
}

module.exports = passwordToken;
