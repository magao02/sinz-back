const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const createURL = require("../../utils/createURL.js");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

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
      email: email !== undefined && email !== "" ? email : user.email,
      telefone:
        telefone !== undefined && telefone !== "" ? telefone : user.telefone,
      filiacao:
        filiacao !== undefined && filiacao !== "" ? filiacao : user.filiacao,
      endereco: {
        rua:
          endereco !== undefined &&
          endereco.rua !== undefined &&
          endereco.rua !== ""
            ? endereco.rua
            : user.endereco.rua,
        bairro:
          endereco !== undefined &&
          endereco.bairro !== undefined &&
          endereco.bairro !== ""
            ? endereco.bairro
            : user.endereco.bairro,
        complemento:
          endereco !== undefined &&
          endereco.complemento !== undefined &&
          endereco.complemento !== ""
            ? endereco.complemento
            : user.endereco.complemento,
        numero:
          endereco !== undefined &&
          endereco.numero !== undefined &&
          endereco.numero !== ""
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
