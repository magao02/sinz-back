const User = require("../../model/User");
const getImageUrl = require("../../utils/getImageUrl");
const { HTTP_CODE_OK, HTTP_CODE_NOT_FOUND } = require("../../utils/httpStatus");
const isBlank = require("../../utils/isBlank");

function formatDate(date) {
  return (
    date.getUTCDate() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear()
  );
}

async function userPage(req, res) {
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

  const dataPage = {
    name: user.name,
    email: user.email,
    password: user.password,
    telefone: user.telefone,
    telefoneFixo: user.telefoneFixo,
    nascimento: isBlank(user.nascimento) ? formatDate(user.nascimento) : "",
    cpf: user.cpf,
    rg: user.rg,
    emissao: isBlank(user.emissao) ? formatDate(user.emissao) : "",
    filiacao: user.filiacao,
    dataAfiliacao: isBlank(user.dataAfiliacao)
      ? formatDate(user.dataAfiliacao)
      : "",
    regional: isBlank(user.regional) ? user.regional : "",
    profissao: user.profissao,
    endereco: user.endereco,
    salario: user.salario,
    empresa: user.empresa,
    numInscricao: user.numInscricao,
    formacaoSuperior: user.formacaoSuperior,
    instituicaoSuperior: user.instituicaoSuperior,
    dataFormacao: isBlank(user.dataFormacao)
      ? formatDate(user.dataFormacao)
      : "",
    numRegistroConselho: user.numRegistroConselho,
    dataRegistroConselho: isBlank(user.dataRegistroConselho)
      ? user.dataRegistroConselho.getDate() +
        1 +
        "/" +
        (user.dataRegistroConselho.getMonth() + 1) +
        "/" +
        user.dataRegistroConselho.getFullYear()
      : "",
    profilePic: getImageUrl(user.profilePic),
  };
  return res.status(HTTP_CODE_OK).json(dataPage);
}

module.exports = userPage;
