const User = require("../../model/User");
const {
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
} = require("../../utils/httpStatus");

const isBlank = (string) => {
  return string !== undefined && string !== "";
};

async function setUser(req, res) {
  if (req.user.admin) {
    const urlUser = req.params.urlUser;
    let user = await User.findOne({ urlUser });

    if (!user) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Perfil não encontrado." });
    }

    let { email, telefone, filiacao, endereco } = req.body;

    user = await User.findByIdAndUpdate(user._id, {
      email: isBlank(email) ? email : user.email,
      telefone: isBlank(telefone) ? telefone : user.telefone,
      filiacao: isBlank(filiacao) ? filiacao : user.filiacao,
      endereco: {
        rua:
          endereco !== undefined && isBlank(endereco.rua)
            ? endereco.rua
            : user.endereco.rua,
        bairro:
          endereco !== undefined && isBlank(endereco.bairro)
            ? endereco.bairro
            : user.endereco.bairro,
        complemento:
          endereco !== undefined && isBlank(endereco.complemento)
            ? endereco.complemento
            : user.endereco.complemento,
        numero:
          endereco !== undefined && isBlank(endereco.numero)
            ? endereco.numero
            : user.endereco.numero,
      },
    });

    return res
      .status(HTTP_CODE_OK)
      .json({ message: "Dados do usuário " + user.name + " atualizados." });
  } else {
    return res.status(HTTP_CODE_UNAUTHORIZED).json({
      message: "Usuário sem permissão para atualizar dados de outro usuário.",
    });
  }
}

module.exports = setUser;
