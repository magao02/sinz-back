const User = require("../../model/User");
const getImageUrl = require("../../utils/getImageUrl");
const { HTTP_CODE_OK, HTTP_CODE_NOT_FOUND } = require("../../utils/httpStatus");
const isNotBlank = require("../../utils/isNotBlank");

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

  const canSeePassword = user.adminMaster ? req.user.adminMaster : true;

  const dataPage = {
    name: user.name,
    email: user.email,
    password: canSeePassword ? user.password : "",
    telefone: user.telefone,
    telefoneFixo: user.telefoneFixo,
    nascimento: isNotBlank(user.nascimento) ? formatDate(user.nascimento) : "",
    cpf: user.cpf,
    rg: user.rg,
    emissao: isNotBlank(user.emissao) ? formatDate(user.emissao) : "",
    filiacao: user.filiacao,
    dataAfiliacao: isNotBlank(user.dataAfiliacao)
      ? formatDate(user.dataAfiliacao)
      : "",
    regional: isNotBlank(user.regional) ? user.regional : "",
    profissao: user.profissao,
    endereco: user.endereco,
    salario: user.salario,
    empresa: user.empresa,
    numInscricao: user.numInscricao,
    formacaoSuperior: user.formacaoSuperior,
    instituicaoSuperior: user.instituicaoSuperior,
    dataFormacao: isNotBlank(user.dataFormacao)
      ? formatDate(user.dataFormacao)
      : "",
    numRegistroConselho: user.numRegistroConselho,
    dataRegistroConselho: isNotBlank(user.dataRegistroConselho)
      ? formatDate(user.dataRegistroConselho)
      : "",
    profilePic: getImageUrl(user.profilePic),
    admin: user.admin,
    universidade: user.universidade,
    isPendingSignup: user.isPendingSignup,
  };
  return res.status(HTTP_CODE_OK).json(dataPage);
}

module.exports = userPage;
