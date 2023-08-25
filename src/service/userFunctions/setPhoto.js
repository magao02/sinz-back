const User = require("../../model/User");
const getImageUrl = require("../../utils/getImageUrl");
const {
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_OK,
} = require("../../utils/httpStatus");
const S3Storage = require("../../utils/S3Storage");

async function setPhoto(req, res) {
  const urlUser = req.params.urlUser;

  let user = await User.findOne({ urlUser });

  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Perfil não encontrado." });
  }

  if (!user._id.equals(req.userId) && !req.user.admin) {
    return res
      .status(HTTP_CODE_UNAUTHORIZED)
      .json({ message: "Usuário não tem permissão." });
  }

  let obj;
  try {
    obj = await S3Storage.saveProfilePicture(req.file.buffer, `uploads/user/${user._id.toString()}`, req.file.mimetype);
  } catch (err) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Houve um erro ao salvar a imagem." });
  }

  const profilePic = {
    key: obj.key,
    url: obj.url,
    seed: Math.floor(Math.random() * 1001),
  };

  await User.findByIdAndUpdate(user._id, {
    profilePic
  });
  
  return res
    .status(HTTP_CODE_OK)
    .json({
      message: "Imagem definida com sucesso.",
      url: getImageUrl(profilePic),
    });
}

module.exports = setPhoto;
