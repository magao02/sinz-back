const User = require("../../model/User");
const { HTTP_CODE_OK } = require("../../utils/httpStatus");

async function logout(req, res) {
  let user = req.user;
  new_token_list = user.token_list.remove(req.token);

  user = await User.findByIdAndUpdate(user._id, {
    token_list: new_token_list,
  });

  return res.status(HTTP_CODE_OK).json({ message: "User has logout." });
}

module.exports = logout;
