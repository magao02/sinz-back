const RecreationArea = require("../../model/RecreationArea");
const {
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_OK,
} = require("../../utils/httpStatus");

const notUndefined = (array) => array != undefined;

async function editRecreationArea(req, res) {
  if (req.user.admin) {
    const urlRec = req.params.urlRecreationArea;
    let recreationArea = await RecreationArea.findOne({ urlRec });

    if (!recreationArea) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Area de lazer não encontrada." });
    }

    const data = req.body;
    delete data.reservas;
    recreationArea = await RecreationArea.findByIdAndUpdate(
      recreationArea._id,
      data
    );

    return res.status(HTTP_CODE_OK).json({
      message:
        "Dados da Area de lazer " + recreationArea.titulo + " atualizados.",
    });
  }
  return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });
}

module.exports = editRecreationArea;
