const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const createURL = require("../../utils/createURL.js");
const formataData = require("../../utils/dateFunctions");
const {
  validacaoPassword,
  validacaoRG,
  validacaoTelefone,
  validacaoCPF,
} = require("../../utils/validationFunctions");
const {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_CREATED,
  HTTP_CODE_NOT_FOUND,
} = require("../../utils/httpStatus");

async function finishIncompleteUser(req, res) {
  const urlUser = req.params.urlUser;

  let user = await User.findOne({ urlUser });

  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Usuário não encontrado." });
  }

  if (!user.isPendingSignup) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Usuário já tem cadastro completo." });
  }

  let {
    name,
    email,
    password,
    telefone,
    nascimento,
    cpf,
    rg,
    emissao,
    filiacao,
    profissao,
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
    universidade,
  } = req.body;

  if (name === "") {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Preencha o campo nome " });
  }

  if (cpf === "") {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Preencha o campo cpf " });
  } else {
    if (!validacaoCPF(cpf)) {
      return res.status(HTTP_CODE_BAD_REQUEST).json({
        message:
          "CPF inserido com formato incorreto. O CPF deve ser inserido sem pontuação e deve ter 11 dígitos.",
      });
    }
  }

  try {
    nascimento = await formataData(nascimento);
    emissao = await formataData(emissao);

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
      .json(
        "Data inserida incorretamente ou dado não inserido. Formato correto: dd/mm/aaaa"
      );
  }

  if (!validacaoRG(rg)) {
    return res.status(HTTP_CODE_BAD_REQUEST).json({
      message:
        "RG inserido com formato incorreto. O RG deve ser inserido sem pontuação e possui entre 4 e 9 dígitos.",
    });
  }

  if (!validacaoTelefone(telefone)) {
    return res.status(HTTP_CODE_BAD_REQUEST).json({
      message:
        "Telefone inserido com formato incorreto. Formato correto: xx xxxx-xxxx sem pontuação.",
    });
  }

  if (!validacaoPassword(password)) {
    return res.status(HTTP_CODE_BAD_REQUEST).json({
      message:
        "Senha inserida com formato incorreto. Insira uma senha apenas com números e sem caracteres especiais com um tamanho de pelo menos 8 dígitos",
    });
  }

  try {
    user = await User.findByIdAndUpdate(user._id, {
      name,
      email,
      password,
      telefone,
      nascimento,
      cpf,
      rg,
      emissao,
      filiacao,
      profissao,
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
      urlUser,
      universidade,
      isPendingSignup: false,
    }, { new: true });

    return res.status(HTTP_CODE_CREATED).json({
      message: "Usuário cadastrado com sucesso",
      user: user,
    });
  } catch (e) {
    if (e.hasOwnProperty("code") && e.code === 11000) {
      return res.status(HTTP_CODE_BAD_REQUEST).json({
        message: "Valor de " + Object.keys(e.keyValue)[0] + " já cadastrado.",
      });
    } else {
      return res.status(HTTP_CODE_BAD_REQUEST).json({ message: e.message });
    }
  }
}

module.exports = finishIncompleteUser;
