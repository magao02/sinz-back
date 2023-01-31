const User = require("../model/User");
const Dependent = require("../model/Dependent");

async function getDependents(req, res) {
  const urlUser = req.params.urlUser;

  let user = await User.findOne({ urlUser });

  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Perfil não encontrado." });
  }

  if (user._id.equals(req.userId) || req.user.admin) {
    let dependentes = user.dependentes;
    let dependetesDTO = [];

    let dep;
    let _id;

    for (var i = 0; i < dependentes.length; i++) {
      _id = dependentes[i];
      dep = await Dependent.findById({ _id });

      if (!!dep) {
        dependetesDTO.push({
          name: dep.name,
          cpf: dep.cpf,
          nascimento:
            dep.nascimento !== "" &&
            dep.nascimento !== null &&
            dep.nascimento !== undefined
              ? dep.nascimento.getDate() +
                "/" +
                (dep.nascimento.getMonth() + 1) +
                "/" +
                dep.nascimento.getFullYear()
              : "",
          rg: dep.rg,
          urlDep: dep.urlDep,
          emissao:
            dep.emissao !== "" &&
            dep.emissao !== null &&
            dep.emissao !== undefined
              ? dep.emissao.getDate() +
                "/" +
                (dep.emissao.getMonth() + 1) +
                "/" +
                dep.emissao.getFullYear()
              : "",
        });
      }
    }

    function compare(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
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
