const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const createURL = require("../../utils/createURL.js");
const formataData = require("../../utils/dateFunctions");
const handler = require("../../utils/nodemailer");
const {
  validacaoPassword,
  validacaoRG,
  validacaoTelefone,
  validacaoCPF,
} = require("../../utils/validationFunctions");
const {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_CREATED,
} = require("../../utils/httpStatus");

async function createUser(req, res) {
  let {
    name,
    email,
    password,
    telefone,
    telefoneFixo,
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
    admin
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

  /*if (endereco.complemento === "") {
    endereco.complemento = "Nenhum";
  }*/

  let user = await User.findOne({ cpf });

  if (!user) {
    let urlUser = await createURL(name);

    try {
      if (nascimento !== undefined && nascimento !== "") {
        nascimento = await formataData(nascimento);
      }

      if (emissao !== undefined && emissao !== "") {
        emissao = await formataData(emissao);
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
      console.log(err)
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json(
          "Data inserida incorretamente ou dado não inserido. Formato correto: dd/mm/aaaa"
        );
    }

    if (rg !== "" & rg  !== undefined) {
      if (!validacaoRG(rg)) {
        return res.status(HTTP_CODE_BAD_REQUEST).json({
          message:
            "RG inserido com formato incorreto. O RG deve ser inserido sem pontuação e possui entre 4 e 9 dígitos.",
        });
      }
    }

    if (telefone !== "" & telefone  !== undefined) {
      if (!validacaoTelefone(telefone)) {
        return res.status(HTTP_CODE_BAD_REQUEST).json({
          message:
            "Telefone inserido com formato incorreto. Formato correto para telefones moveis xx xxxxx-xxxx ou xx xxxx-xxxx para telefones fixos, sem pontuação.",
        });
      }
    }

    if (telefoneFixo !== "" && telefoneFixo !== undefined) {
      if (!validacaoTelefone(telefoneFixo)) {
        return res.status(HTTP_CODE_BAD_REQUEST).json({
          message:
            "Telefone fixo inserido com formato incorreto. Formato correto: xx xxxx-xxxx sem pontuação.",
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
    
    if(!admin){
      admin = false
    }

    try {
      user = await User.create({
        name,
        email,
        password,
        telefone,
        telefoneFixo,
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
        admin
      });
      let imposto = await Imposto.create({ idUser: user._id });
      user = await User.findByIdAndUpdate(user._id, {
        impostoDeRenda: imposto._id,
      });

      handler(`Usuário cadastrado com suceso, email;${email}, nome: ${name}`);

      

      return res.status(HTTP_CODE_CREATED).json({
        message: "Usuário cadastrado com sucesso",
        user: user,
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

module.exports = createUser;
