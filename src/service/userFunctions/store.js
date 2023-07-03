const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const createURL = require("../../utils/createURL.js");
const formataData = require("../../utils/dateFunctions");
const {
  validacaoPassword,
  validacaoRG,
  validacaoTelefone,
  validacaoCPF,
} = require("../../utils/validationFunctions");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

async function store(req, res) {
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

  if (endereco.complemento === "") {
    endereco.complemento = "Nenhum";
  }

  let user = await User.findOne({ cpf });

  if (!user) {
    let urlUser = await createURL(name);

    try {
      if (nascimento !== "") {
        nascimento = await formataData(nascimento);
      }
      if (emissao !== "") {
        emissao = await formataData(emissao);
      }
      if (dataAfiliacao !== "") {
        dataAfiliacao = await formataData(dataAfiliacao);
      }
      if (dataFormacao !== "") {
        dataFormacao = await formataData(dataFormacao);
      }
      if (dataRegistroConselho !== "") {
        dataRegistroConselho = await formataData(dataRegistroConselho);
      }
    } catch (err) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json(
          "Data inserida incorretamente ou dado não inserido. Formato correto: dd/mm/aaaa"
        );
    }

    if (rg !== "") {
      if (!validacaoRG(rg)) {
        return res.status(HTTP_CODE_BAD_REQUEST).json({
          message:
            "RG inserido com formato incorreto. O RG deve ser inserido sem pontuação e possui entre 4 e 9 dígitos.",
        });
      }
    }

    if (telefone !== "") {
      if (!validacaoTelefone(telefone)) {
        return res.status(HTTP_CODE_BAD_REQUEST).json({
          message:
            "Telefone inserido com formato incorreto. Formato correto: xx xxxx-xxxx sem pontuação.",
        });
      }
    }

    if (password !== "") {
      if (!validacaoPassword(password)) {
        return res.status(HTTP_CODE_BAD_REQUEST).json({
          message:
            "Senha inserida com formato incorreto. Insira uma senha apenas com números e sem caracteres especiais com um tamanho de pelo menos 8 dígitos",
        });
      }
    } else {
      password = cpf;
    }

    try {
      user = await User.create({
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
      });
      let imposto = await Imposto.create({ idUser: user._id });
      user = await User.findByIdAndUpdate(user._id, {
        impostoDeRenda: imposto._id,
      });

      return res.status(HTTP_CODE_CREATED).json({
        message: "Usuário cadastrado com sucesso",
      });
    } catch (e) {
      console.log(e);
      if (e.hasOwnProperty("code") && e.code === 11000) {
        return res.status(HTTP_CODE_BAD_REQUEST).json({
          message: "Valor de " + Object.keys(e.keyValue)[0] + " já cadastrado.",
        });
      } else {
        return res.status(HTTP_CODE_BAD_REQUEST).json({ message: e.message });
      }
    }
  } else {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "CPF já cadastrado." });
  }
}

module.exports = store;
