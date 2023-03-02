const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const createURL = require("../../utils/createURL.js");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

async function deleteUser(req, res) {
  if (req.user.admin) {
    const urlUser = req.params.urlUser;
    let user = await User.findOne({ urlUser });

    if (!user) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Perfil não encontrado." });
    }

    await Imposto.deleteMany({ idUser: user._id });

    user = await User.deleteOne(user)
      .then(async function (deletedUser) {
        if (deletedUser) {
          for (let i = 0; i < user.dependentes.length; i++) {
            await Dependent.findByIdAndDelete(user.dependentes[i]);
            await Imposto.deleteMany({ idUser: user.dependentes[i]._id });
          }
          return res.status(HTTP_CODE_OK).json({
            message: `Usuário (${user.name}) deletado com sucesso.`,
          });
        } else {
          return res.status(HTTP_CODE_UNAUTHORIZED).json({
            message: "Usuário sem permissão para deletar outro usuário.",
          });
        }
      })
      .catch((err) => console.error(`Falha ao buscar e deletar: ${err}`));
  } else {
    return res
      .status(HTTP_CODE_UNAUTHORIZED)
      .json({ message: "Usuário sem permissão para deletar outro usuário." });
  }
}

module.exports = deleteUser;
