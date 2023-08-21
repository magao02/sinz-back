const RecreationArea = require("../../model/RecreationArea");
const { HTTP_CODE_NOT_FOUND, HTTP_CODE_OK } = require("../../utils/httpStatus");

async function getRecreationArea(req, res) {
  const urlRec = req.params.urlRecreationArea;

  let rec = await RecreationArea.findOne({ urlRec });

  if (!rec) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Area de Lazer não encontrada." });
  }

  return res.status(HTTP_CODE_OK).json(rec);
}

module.exports = getRecreationArea;
