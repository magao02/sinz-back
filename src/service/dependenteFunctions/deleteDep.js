const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const {
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
} = require("../../utils/httpStatus");

async function deleteDep(req, res) {
  const urlDep = req.params.urlDep;
  let dep = await Dependent.findOne({ urlDep: urlDep });

  if (!dep) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Dependente não encontrado." });
  }

  await Imposto.deleteMany({ idUser: dep._id });

  try {
    Dependent.deleteOne({ urlDep: urlDep }, function (err) {
      if (err) return handleError(err);
    });
    return res
      .status(HTTP_CODE_OK)
      .json({ message: "Depedente deletado com sucesso" });
  } catch (err) {
    return res
      .status(HTTP_CODE_UNAUTHORIZED)
      .json({ message: "Usuário sem permissão para deletar outro usuário." });
  }
}

module.exports = deleteDep;
