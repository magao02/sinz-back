const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const { HTTP_CODE_NOT_FOUND, HTTP_CODE_OK } = require("../../utils/httpStatus");

async function getUserYears(req, res) {
  const urlUser = req.params.urlUser;
  let user = await User.findOne({ urlUser });

  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Perfil não encontrado." });
  }

  let impostos = await Imposto.find({ 
  $or: [
    { idUser: user._id }, 
    { idUser: user.oldId }
  ] 
});

  let anos = [];

  for (var i = 0; i < impostos.length; i++) {
    anos.push(impostos[i].ano);
  }
  return res.status(HTTP_CODE_OK).json({ anosUsuario: anos });
}

module.exports = getUserYears;
