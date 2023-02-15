const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const createURL = require("../../utils/createURL.js");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

async function createNewImpostoByYearDep(req, res) {
  if (req.user.admin) {
    const urlUser = req.params.urlUser;
    let user = await User.findOne({ urlUser });
    if (!user) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Perfil não encontrado." });
    }

    const urlDep = req.params.urlDep;
    let dep = await Dependent.findOne({ urlDep });

    if (!dep) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Dependente não encontrado." });
    }

    let impostos = await Imposto.find({ idUser: dep._id });

    for (let i = 0; i < impostos.length; i++) {
      if (impostos[i].ano === +req.params.ano) {
        return res
          .status(HTTP_CODE_BAD_REQUEST)
          .json({ message: "Imposto com o ano selecionado já existente" });
      }
    }

    let imposto = await Imposto.create({
      idUser: dep._id,
      ano: req.params.ano,
    });

    user = await User.findByIdAndUpdate(dep._id, {
      impostoDeRenda: imposto._id,
    });

    return res.status(HTTP_CODE_CREATED).json({ message: "Imposto criado" });
  } else {
    return res.status(HTTP_CODE_UNAUTHORIZED).json({
      message: "Usuário sem permissão para atualizar imposto de renda.",
    });
  }
}

module.exports = createNewImpostoByYearDep;
