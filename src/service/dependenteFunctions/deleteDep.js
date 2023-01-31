const User = require("../../model/User");
const Dependent = require("../../model/Dependent");

async function deleteDep(req, res) {
  if (req.user.admin) {
    const urlUser = req.params.urlUser;
    let user = await User.findOne({ urlUser });

    if (!user) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Perfil não encontrado." });
    }

    user = await User.deleteOne(user)
      .then(async function (deletedUser) {
        if (deletedUser) {
          for (let i = 0; i < user.dependentes.length; i++) {
            await Dependent.findByIdAndDelete(user.dependentes[i]);
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

module.exports = deleteDep;
