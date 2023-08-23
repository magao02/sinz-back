const User = require("../../model/User");
const Dependent = require("../../model/Dependent");
const compare = require("../../utils/compareFunctions");
const isStringBlank = require("../../utils/isStringBlank");
const {
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
} = require("../../utils/httpStatus");


async function getDependents(req, res) {
  const urlUser = req.params.urlUser;

  let user = await User.findOne({ urlUser });

  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Perfil não encontrado." });
  }

  if (user._id.equals(req.userId) || req.user.admin) {
    let dependetesDTO = [];

    for await (let dep of Dependent.find({ idAssociado: user._id })) {
      dependetesDTO.push({
        name: dep.name,
        cpf: dep.cpf,
        nascimento:
          !isStringBlank(dep.nascimento)
            ? dep.nascimento.getDate() +
              "/" +
              (dep.nascimento.getMonth() + 1) +
              "/" +
              dep.nascimento.getFullYear()
            : "",
        rg: dep.rg,
        urlDep: dep.urlDep,
        emissao:
          !isStringBlank(dep.emissao)
            ? dep.emissao.getDate() +
              "/" +
              (dep.emissao.getMonth() + 1) +
              "/" +
              dep.emissao.getFullYear()
            : "",
        parentesco: dep.parentesco,
      });
    }

    dependetesDTO.sort(compare);

    return res.status(HTTP_CODE_OK).json(dependetesDTO);
  } else {
    return res.status(HTTP_CODE_UNAUTHORIZED).json({
      message:
        "Usuário sem permissão de visualizar os dependentes desse assessor.",
    });
  }
}

module.exports = getDependents;
