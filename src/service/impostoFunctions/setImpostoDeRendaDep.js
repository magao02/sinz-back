const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const jwt = require("jsonwebtoken");
const { findById, db, collection } = require("@model/Imposto");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

async function setImpostoDeRendaDep(req, res) {
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
    console.log(req.body);
    let impostoDeRenda = req.body;
    let impostos = await Imposto.find({ idUser: dep._id });

    console.log(impostoDeRenda);

    //Seleciona o imposto do ano correto.
    for (var i = 0; i < impostos.length; i++) {
      if (impostos[i].ano === +req.params.ano) {
        var antigoImposto = await Imposto.find({ idUser: dep.id });
        break;
      }
    }

    if (antigoImposto === undefined || antigoImposto.length === 0) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json({ message: "Imposto do ano inserido não existe " });
    }

    antigoImposto = antigoImposto[0];

    const novoImposto = await Imposto.updateOne(
      { idUser: dep.id, ano: +req.params.ano },
      {
        $set: {
          janeiro:
            impostoDeRenda.janeiro !== undefined &&
            impostoDeRenda.janeiro !== null &&
            impostoDeRenda.janeiro !== "" &&
            impostoDeRenda.janeiro !== 0
              ? impostoDeRenda.janeiro
              : antigoImposto.janeiro,
          fevereiro:
            impostoDeRenda.fevereiro !== undefined &&
            impostoDeRenda.fevereiro !== null &&
            impostoDeRenda.fevereiro !== "" &&
            impostoDeRenda.fevereiro !== 0
              ? impostoDeRenda.fevereiro
              : antigoImposto.fevereiro,
          marco:
            impostoDeRenda.marco !== undefined &&
            impostoDeRenda.marco !== null &&
            impostoDeRenda.marco !== "" &&
            impostoDeRenda.marco !== 0
              ? impostoDeRenda.marco
              : antigoImposto.marco,
          abril:
            impostoDeRenda.abril !== undefined &&
            impostoDeRenda.abril !== null &&
            impostoDeRenda.abril !== "" &&
            impostoDeRenda.abril !== 0
              ? impostoDeRenda.abril
              : antigoImposto.abril,
          maio:
            impostoDeRenda.maio !== undefined &&
            impostoDeRenda.maio !== null &&
            impostoDeRenda.maio !== "" &&
            impostoDeRenda.maio !== 0
              ? impostoDeRenda.maio
              : antigoImposto.maio,
          junho:
            impostoDeRenda.junho !== undefined &&
            impostoDeRenda.junho !== null &&
            impostoDeRenda.junho !== "" &&
            impostoDeRenda.junho !== 0
              ? impostoDeRenda.junho
              : antigoImposto.junho,
          julho:
            impostoDeRenda.julho !== undefined &&
            impostoDeRenda.julho !== null &&
            impostoDeRenda.julho !== "" &&
            impostoDeRenda.julho !== 0
              ? impostoDeRenda.julho
              : antigoImposto.julho,
          agosto:
            impostoDeRenda.agosto !== undefined &&
            impostoDeRenda.agosto !== null &&
            impostoDeRenda.agosto !== "" &&
            impostoDeRenda.agosto !== 0
              ? impostoDeRenda.agosto
              : antigoImposto.agosto,
          setembro:
            impostoDeRenda.setembro !== undefined &&
            impostoDeRenda.setembro !== null &&
            impostoDeRenda.setembro !== "" &&
            impostoDeRenda.setembro !== 0
              ? impostoDeRenda.setembro
              : antigoImposto.setembro,
          outubro:
            impostoDeRenda.outubro !== undefined &&
            impostoDeRenda.outubro !== null &&
            impostoDeRenda.outubro !== "" &&
            impostoDeRenda.outubro !== 0
              ? impostoDeRenda.outubro
              : antigoImposto.outubro,
          novembro:
            impostoDeRenda.novembro !== undefined &&
            impostoDeRenda.novembro !== null &&
            impostoDeRenda.novembro !== "" &&
            impostoDeRenda.novembro !== 0
              ? impostoDeRenda.novembro
              : antigoImposto.novembro,
          dezembro:
            impostoDeRenda.dezembro !== undefined &&
            impostoDeRenda.dezembro !== null &&
            impostoDeRenda.dezembro !== "" &&
            impostoDeRenda.dezembro !== 0
              ? impostoDeRenda.dezembro
              : antigoImposto.dezembro,
        },
      }
    );

    return res
      .status(HTTP_CODE_OK)
      .json({ message: "Imposto de Renda atualizado." });
  } else {
    return res.status(HTTP_CODE_UNAUTHORIZED).json({
      message: "Usuário sem permissão para atualizar imposto de renda.",
    });
  }
}

module.exports = setImpostoDeRendaDep;
