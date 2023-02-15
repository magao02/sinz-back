const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const createURL = require("../../utils/createURL.js");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

async function logout(req, res) {
  let user = req.user;
  new_token_list = user.token_list.remove(req.token);

  user = await User.findByIdAndUpdate(user._id, {
    token_list: new_token_list,
  });

  return res.status(HTTP_CODE_OK).json({ message: "User has logout." });
}

module.exports = logout;
