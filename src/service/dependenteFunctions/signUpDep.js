const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const formataData = require("../../utils/dateFunctions");
const createURL = require("../../utils/createURL.js");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

async function signUpDep(req, res) {
  const urlUser = req.params.urlUser;

  let user = await User.findOne({ urlUser });

  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Perfil não encontrado." });
  }

  let { name, nascimento, cpf, rg, emissao } = req.body;

  if (name === undefined) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Preencha o campo de nome do Dependente." });
  }

  if (req.user.admin || user._id.equals(req.userId)) {
    var temporalUrl = name
      .replace(/\s/g, "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    let urlDep = temporalUrl;
    let urlUnavailable = true;

    while (urlUnavailable) {
      let depWithThisURL = await Dependent.findOne({ urlDep });

      if (!depWithThisURL) {
        urlUnavailable = false;
      } else {
        urlDep = temporalUrl;
        let randonNum = Math.floor(Math.random() * 1001);
        urlDep = temporalUrl + randonNum.toString();
      }
    }

    try {
      if (nascimento !== "") {
        nascimento = await formataData(nascimento);
      }
      if (emissao !== "") {
        emissao = await formataData(emissao);
      }
    } catch (err) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json(
          "Data inserida incorretamente ou dado não inserido. Formato correto: dd/mm/aaaa"
        );
    }

    let dependent;
    try {
      dependent = await Dependent.create({
        name,
        nascimento,
        cpf,
        rg,
        emissao,
        urlDep,
        idAssociado: req.userId,
      });

      let impostosUser = await Imposto.find({ idUser: user._id });

      for (let i = 0; i < impostosUser.length; i++) {
        let impostoDependente = await Imposto.create({
          idUser: dependent.id,
          ano: impostosUser[i].ano,
        });
        dependent = await Dependent.findByIdAndUpdate(dependent.id, {
          impostoDeRenda: impostoDependente._id,
        });
      }
    } catch (e) {
      if (e.hasOwnProperty("code") && e.code === 11000) {
        return res.status(HTTP_CODE_BAD_REQUEST).json({
          message: "Valor de " + Object.keys(e.keyValue)[0] + " já cadastrado.",
        });
      } else {
        return res.status(HTTP_CODE_BAD_REQUEST).json({ message: e.message });
      }
    }

    try {
      let dependentes = user.dependentes.concat(`${dependent._id}`);
      user = await User.findByIdAndUpdate(user._id, {
        dependentes,
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

    return res
      .status(HTTP_CODE_OK)
      .json({ message: "Dependente cadastrado com sucesso." });
  }
  return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });
}

module.exports = signUpDep;
