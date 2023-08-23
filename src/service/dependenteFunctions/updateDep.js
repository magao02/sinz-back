const Dependent = require("../../model/Dependent");
const formataData = require("../../utils/dateFunctions");
const {
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_BAD_REQUEST,
} = require("../../utils/httpStatus");

const editDep = async (req, res) => {
  const urlDep = req.params.urlDep;

  let dep = await Dependent.findOne({ urlDep });

  if (!dep) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Dependente não encontrado." });
  }

  if (req.user.admin || req.user._id.equals(dep.idAssociado)) {
    let {
      name,
      nascimento,
      cpf,
      rg,
      emissao,
      parentesco,
    } = req.body;

    try {
      if (nascimento !== undefined && nascimento !== "") {
        nascimento = await formataData(nascimento);
      }
      if (emissao !== undefined && emissao !== "") {
        emissao = await formataData(emissao);
      }
    } catch (err) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json("Data inserida incorretamente. Formato correto: dd/mm/aaaa");
    }

    dep = await Dependent.findByIdAndUpdate(dep._id, {
      name, nascimento, cpf, rg, emissao, parentesco
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
