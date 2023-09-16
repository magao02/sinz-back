const User = require("../../model/User");
const formataData = require("../../utils/dateFunctions");
const isNotBlank = require("../../utils/isNotBlank");
const {
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_OK,
} = require("../../utils/httpStatus");
const { validacaoPassword } = require("../../utils/validationFunctions");

async function updatePerfil(req, res) {
  const urlUser = req.params.urlUser;

  let user = await User.findOne({ urlUser });

  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Perfil não encontrado." });
  }

  if (user._id.equals(req.userId) || req.user.admin) {
    let {
      name,
      email,
      telefone,
      telefoneFixo,
      nascimento,
      rg,
      emissao,
      filiacao,
      endereco,
      regional,
      numInscricao,
      dataAfiliacao,
      formacaoSuperior,
      instituicaoSuperior,
      dataFormacao,
      numRegistroConselho,
      dataRegistroConselho,
      empresa,
      salario,
      password,
      profissao,
    } = req.body;

    if (!isNotBlank(password) && !validacaoPassword(password)) {
      return res.status(HTTP_CODE_BAD_REQUEST).json({
        message:
          "Senha invalida. Insira uma senha sem caracteres especiais com um tamanho de pelo menos 8",
      });
    }

    try {
      if (nascimento !== undefined && nascimento !== "") {
        nascimento = await formataData(nascimento);
      }
      if (dataAfiliacao !== undefined && dataAfiliacao !== "") {
        dataAfiliacao = await formataData(dataAfiliacao);
      }
      if (dataFormacao !== undefined && dataFormacao !== "") {
        dataFormacao = await formataData(dataFormacao);
      }
      if (dataRegistroConselho !== undefined && dataRegistroConselho !== "") {
        dataRegistroConselho = await formataData(dataRegistroConselho);
      }
      if (emissao !== undefined && emissao !== "") {
        emissao = await formataData(emissao);
      }
    } catch (err) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json("Data inserida incorretamente. Formato correto: dd/mm/aaaa");
    }

    try {
      user = await User.findByIdAndUpdate(user._id, {
        name: isNotBlank(name) ? name : user.name,
        email: isNotBlank(email) ? email : user.email,
        telefone: isNotBlank(telefone) ? telefone : user.telefone,
        telefoneFixo: isNotBlank(telefoneFixo) ? telefoneFixo : user.telefoneFixo,
        nascimento: isNotBlank(nascimento) ? nascimento : user.nascimento,
        rg: isNotBlank(rg) ? rg : user.rg,
        filiacao: isNotBlank(filiacao) ? filiacao : user.filiacao,
        emissao: isNotBlank(emissao) ? emissao : user.emissao,
        numInscricao: isNotBlank(numInscricao) ? numInscricao : user.numInscricao,
        dataAfiliacao: isNotBlank(dataAfiliacao)
          ? dataAfiliacao
          : user.dataAfiliacao,
        formacaoSuperior: isNotBlank(formacaoSuperior)
          ? formacaoSuperior
          : user.formacaoSuperior,
        instituicaoSuperior: isNotBlank(instituicaoSuperior)
          ? instituicaoSuperior
          : user.instituicaoSuperior,
        dataFormacao: isNotBlank(dataFormacao) ? dataFormacao : user.dataFormacao,
        numRegistroConselho: isNotBlank(numRegistroConselho)
          ? numRegistroConselho
          : user.numRegistroConselho,
        dataRegistroConselho: isNotBlank(dataRegistroConselho)
          ? dataRegistroConselho
          : user.dataRegistroConselho,
        empresa: isNotBlank(empresa) ? empresa : user.empresa,
        salario: isNotBlank(salario) ? salario : user.salario,
        password: isNotBlank(password) ? password : user.password,
        profissao: isNotBlank(profissao) ? profissao : user.profissao,
        endereco: {
          rua:
            endereco !== undefined && isNotBlank(endereco.rua)
              ? endereco.rua
              : user.endereco.rua,
          bairro:
            endereco !== undefined && isNotBlank(endereco.bairro)
              ? endereco.bairro
              : user.endereco.bairro,
          complemento:
            endereco !== undefined && isNotBlank(endereco.complemento)
              ? endereco.complemento
              : user.endereco.complemento,
          numero:
            endereco !== undefined && isNotBlank(endereco.numero)
              ? endereco.numero
              : user.endereco.numero,
        },
        regional: {
          municipio:
            regional !== undefined && isNotBlank(regional.municipio)
              ? regional.municipio
              : user.regional.municipio,
          estado:
            regional !== undefined && isNotBlank(regional.estado)
              ? regional.estado
              : user.regional.estado,
          naturalidade:
            regional !== undefined && isNotBlank(regional.naturalidade)
              ? regional.naturalidade
              : user.regional.naturalidade,
          nacionalidade:
            regional !== undefined && isNotBlank(regional.nacionalidade)
              ? regional.nacionalidade
              : user.regional.nacionalidade,
        },
      });

      return res
        .status(HTTP_CODE_OK)
        .json({ message: "Perfil alterado com sucesso." });
    } catch (err) {
      if (err.hasOwnProperty("code") && err.code === 11000) {
        return res.status(HTTP_CODE_BAD_REQUEST).json({
          message:
            "Valor de " + Object.keys(err.keyValue)[0] + " já cadastrado.",
        });
      } else {
        return res.status(HTTP_CODE_BAD_REQUEST).json({ message: err.message });
      }
    }
  }
  return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });
}

module.exports = updatePerfil;
