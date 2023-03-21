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

async function createNewImpostoByYearUser(req, res) {
  const urlUser = req.params.urlUser;
  let user = await User.findOne({ urlUser });
  let ano = +req.params.ano;

  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Perfil não encontrado " });
  }

  let impostos = await Imposto.find({ idUser: user._id });

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
    return res.status(HTTP_CODE_CREATED).json({ message: "Imposto criado" });
  }

  return res
    .status(HTTP_CODE_BAD_REQUEST)
    .json({ message: "Imposto com o ano selecionado já existente" });
}

module.exports = createNewImpostoByYearUser;
