const { findOne, findByIdAndUpdate } = require("../../model/User");
const {
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
} = require("../../utils/httpStatus");

async function updateUser(req, res) {
  if (req.user.admin) {
    const urlUser = req.params.urlUser;
    let user = await findOne({ urlUser });

    if (!user) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Perfil não encontrado." });
    }

    let data = req.body;
    user = await findByIdAndUpdate(user._id, data);

    return res
      .status(HTTP_CODE_OK)
      .json({ message: "Dados do usuário " + user.name + " atualizados." });
  } else {
    return res.status(HTTP_CODE_UNAUTHORIZED).json({
      message: "Usuário sem permissão para atualizar dados de outro usuário.",
    });
  }
}

module.exports = updateUser;
