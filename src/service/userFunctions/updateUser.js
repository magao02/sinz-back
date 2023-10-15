const User = require("../../model/User");
const {
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
} = require("../../utils/httpStatus");

async function updateUser(req, res) {
  if (req.user.admin) {
    const urlUser = req.params.urlUser;
    let user = await User.findOne({ urlUser });

    if (!user) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Perfil não encontrado." });
    }

    if (user.adminMaster && !req.user.adminMaster) {
      return res
        .status(HTTP_CODE_UNAUTHORIZED)
        .json({ message: "Admin sem permissão de editar dados de admin master." });
    }

    let rawData = req.body;
    const allowedFields = [
      "name",
      "email",
      "password",
      "telefone",
      "telefoneFixo",
      "nascimento",
      "cpf",
      "rg",
      "emissao",
      "filiacao",
      "dataAfiliacao",
      "profissao",
      "numInscricao",
      "formacaoSuperior",
      "instituicaoSuperior",
      "dataFormacao",
      "numRegistroConselho",
      "dataRegistroConselho",
      "empresa",
      "salario",
      "endereco",
      "regional",
      "primeiroAcesso",
      "universidade",
    ];
    if (req.user.adminMaster) {
      allowedFields.push("admin");
    }
    const data = {};
    for (let field of allowedFields) {
      if (rawData[field] !== undefined) {
        data[field] = rawData[field];
      }
    }
    user = await User.findByIdAndUpdate(user._id, data);

    return res
      .status(HTTP_CODE_OK)
      .json({ 
        message: "Dados do usuário " + user.name + " atualizados.",
        user: user,
       });
  } else {
    return res.status(HTTP_CODE_UNAUTHORIZED).json({
      message: "Usuário sem permissão para atualizar dados de outro usuário.",
    });
  }
}

module.exports = updateUser;
