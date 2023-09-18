const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const Apartment = require("../../model/Apartment");
const RecreationArea = require("../../model/RecreationArea");
const S3Storage = require("../../utils/S3Storage");
const {
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
} = require("../../utils/httpStatus");

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
          
          // delete reservations by this user
          await Apartment.updateMany({}, { $pull: { reservas: { idAssociado: user._id } } });
          await RecreationArea.updateMany({}, { $pull: { reservas: { idAssociado: user._id } } });
          
          // delete this user's profile picture from S3
          if (user.profilePic?.key) {
            await S3Storage.deleteFile(user.profilePic.key);
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
