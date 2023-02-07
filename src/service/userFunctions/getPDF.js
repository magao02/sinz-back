const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const createURL = require("../../utils/createURL.js");
const compareFunctions = require("../../utils/compareFunctions.js");
const jwt = require("jsonwebtoken");
const { findById, db, collection } = require("@model/Imposto");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

async function getPDF(req, res) {
  const urlUser = req.params.urlUser;
  let user = await User.findOne({ urlUser });

  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Perfil não encontrado." });
  } else {
    if (req.user.admin || user._id.equals(req.userId)) {
      let impRendaDeps = [];
      let dep;
      let depDTO;

      let impostosDoUser = await Imposto.find({ idUser: user._id });
      for (let i = 0; i < impostosDoUser.length; i++) {
        if (impostosDoUser[i].ano === +req.params.ano) {
          var impostoAtualUser = await Imposto.find({
            idUser: user.id,
            ano: +req.params.ano,
          });
          break;
        }
      }

      if (impostoAtualUser === undefined) {
        return res
          .status(HTTP_CODE_BAD_REQUEST)
          .json({ message: "Imposto do ano inserido não existe " });
      }

      for (let i = 0; i < user.dependentes.length; i++) {
        dep = await Dependent.findById(user.dependentes[i]);

        if (!!dep) {
          let impostosDoDependente = await Imposto.find({ idUser: dep._id });

          for (let j = 0; j < impostosDoDependente.length; j++) {
            if (impostosDoDependente[j].ano === +req.params.ano) {
              var impostoAtualDependente = await Imposto.find({
                idUser: dep.id,
                ano: +req.params.ano,
              });
              break;
            }
          }
          depDTO = {
            name: dep.name,
            cfp: dep.cpf,
            impostoDeRenda: impostoAtualDependente,
          };
          impRendaDeps.push(depDTO);
        }
      }

      impRendaDeps.sort(compareFunctions.compare);

      return res.status(HTTP_CODE_OK).json({
        name: user.name,
        cpf: user.cpf,
        impostoDeRenda:
          impostoAtualUser.length !== 0 ? impostoAtualUser[0] : {},
        dependentes: impRendaDeps,
      });
    } else {
      return res.status(HTTP_CODE_UNAUTHORIZED).json({
        message: "Usuário sem permissão para baixar esse imposto de renda.",
      });
    }
  }
}

module.exports = getPDF;
