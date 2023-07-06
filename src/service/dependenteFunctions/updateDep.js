const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const createURL = require("../../utils/createURL.js");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

const isBlank = (string) => {
  return string !== undefined && string !== "";
}

const editDep = async (req, res) => {
  if(req.user.admin) {
    const urlDep = req.params.urlDep;

    let dep = Dependent.findOne({urlDep});

    if (!dep) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Dependente não encontrado." });
    }

    const { name, nascimento, cpf, rg, emissao, parentesco } = req.body;

    dep = await Dependent.findByIdAndUpdate(dep._id, {
      name: isBlank(name) ? name : dep.name,
      nascimento: isBlank(nascimento) ? nascimento : dep.nascimento ,
      cpf: isBlank(cpf) ? cpf : dep.cpf,
      rg: isBlank(rg) ? rg : dep.rg,
      emissao: isBlank(emissao) ? emissao : dep.emissao,
      parentesco: isBlank(parentesco) ? parentesco : dep.parentesco
    });

    return res
      .status(HTTP_CODE_OK)
      .json({ message: "Dados do dependente " + dep.name + " atualizados." });
  }
  return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });
};

module.exports = editDep;
