const User = require("../../model/User");
const formataData = require("../../utils/dateFunctions");
const isBlank = require("../../utils/isBlank");
const {
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_OK,
} = require("../../utils/httpStatus");

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
      nascimento,
      rg,
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
    } catch (err) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json("Data inserida incorretamente. Formato correto: dd/mm/aaaa");
    }

    try {
      user = await User.findByIdAndUpdate(user._id, {
        name: isBlank(name) ? name : user.name,
        email: isBlank(email) ? email : user.email,
        telefone: isBlank(telefone) ? telefone : user.telefone,
        nascimento: isBlank(nascimento) ? nascimento : user.nascimento,
        rg: isBlank(rg) ? rg : user.rg,
        filiacao: isBlank(filiacao) ? filiacao : user.filiacao,
        numInscricao: isBlank(numInscricao) ? numInscricao : user.numInscricao,
        dataAfiliacao: isBlank(dataAfiliacao)
          ? dataAfiliacao
          : user.dataAfiliacao,
        formacaoSuperior: isBlank(formacaoSuperior)
          ? formacaoSuperior
          : user.formacaoSuperior,
        instituicaoSuperior: isBlank(instituicaoSuperior)
          ? instituicaoSuperior
          : user.instituicaoSuperior,
        dataFormacao: isBlank(dataFormacao) ? dataFormacao : user.dataFormacao,
        numRegistroConselho: isBlank(numRegistroConselho)
          ? numRegistroConselho
          : user.numRegistroConselho,
        dataRegistroConselho: isBlank(dataRegistroConselho)
          ? dataRegistroConselho
          : user.dataRegistroConselho,
        empresa: isBlank(empresa) ? empresa : user.empresa,
        salario: isBlank(salario) ? salario : user.salario,
        password: isBlank(password) ? password : user.password,
        profissao: isBlank(profissao) ? profissao : user.profissao,
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
        regional: {
          municipio:
            regional !== undefined && isBlank(regional.municipio)
              ? regional.municipio
              : user.regional.municipio,
          estado:
            regional !== undefined && isBlank(regional.estado)
              ? regional.estado
              : user.regional.estado,
          naturalidade:
            regional !== undefined && isBlank(regional.naturalidade)
              ? regional.naturalidade
              : user.regional.naturalidade,
          nacionalidade:
            regional !== undefined && isBlank(regional.nacionalidade)
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
