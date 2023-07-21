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

    const data = req.body;
    dep = await Dependant.findByIdAndUpdate(dep._id, data);

    return res
      .status(HTTP_CODE_OK)
      .json({ message: "Dados do dependente " + dep.name + " atualizados." });
  }
  return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });
};

module.exports = editDep;
