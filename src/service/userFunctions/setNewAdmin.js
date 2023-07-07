const User = require("../../model/User");
const {
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
} = require("../../utils/httpStatus");

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
