const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const createURL = require("../../utils/createURL.js");
const getImpostoByYear = require("./getImpostoByYear");

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
    let ano = +req.params.ano;

    let novoImposto = await getImpostoByYear(impostos, ano);

    if (novoImposto === undefined) {
      let impostoAnoAnterior = await getImpostoByYear(
        impostos,
        ano - 1
      );

      if (impostoAnoAnterior === undefined) {
        novoImposto = await Imposto.create({
          idUser: user._id,
          ano: ano,
        });
      } else {
        novoImposto = await Imposto.create({
          idUser: user._id,
          ano: ano,
          janeiro: impostoAnoAnterior.janeiro,
          fevereiro: impostoAnoAnterior.fevereiro,
          marco: impostoAnoAnterior.marco,
          abril: impostoAnoAnterior.abril,
          maio: impostoAnoAnterior.maio,
          junho: impostoAnoAnterior.junho,
          julho: impostoAnoAnterior.julho,
          agosto: impostoAnoAnterior.agosto,
          setembro: impostoAnoAnterior.setembro,
          outubro: impostoAnoAnterior.outubro,
          novembro: impostoAnoAnterior.novembro,
          dezembro: impostoAnoAnterior.dezembro,
        });
      }

      user = await User.findByIdAndUpdate(dep._id, {
        impostoDeRenda: novoImposto._id,
      });

      return res.status(HTTP_CODE_CREATED).json({ message: "Imposto criado" });
    }

    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Imposto com o ano selecionado já existente" });
  } else {
    return res.status(HTTP_CODE_UNAUTHORIZED).json({
      message: "Usuário sem permissão para atualizar imposto de renda.",
    });
  }
}

module.exports = createNewImpostoByYearDep;
