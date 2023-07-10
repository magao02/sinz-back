const Dependent = require("../../model/Dependent");
const {
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
} = require("../../utils/httpStatus");

const isBlank = (string) => {
  return string !== undefined && string !== "";
};

const editDep = async (req, res) => {
  if (req.user.admin) {
    const urlDep = req.params.urlDep;

    let dep = Dependent.findOne({ urlDep });

    if (!dep) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Dependente não encontrado." });
    }

    const { name, nascimento, cpf, rg, emissao, parentesco } = req.body;

    dep = await Dependent.findByIdAndUpdate(dep._id, {
      name: isBlank(name) ? name : dep.name,
      nascimento: isBlank(nascimento) ? nascimento : dep.nascimento,
      cpf: isBlank(cpf) ? cpf : dep.cpf,
      rg: isBlank(rg) ? rg : dep.rg,
      emissao: isBlank(emissao) ? emissao : dep.emissao,
      parentesco: isBlank(parentesco) ? parentesco : dep.parentesco,
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
