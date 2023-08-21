const RecreationArea = require("../../model/RecreationArea");
const { HTTP_CODE_OK } = require("../../utils/httpStatus");

async function getAllRecreationAreas(req, res) {
  const recreationAreas = await RecreationArea.find({});
  return res.status(HTTP_CODE_OK).json(recreationAreas);
}

module.exports = getAllRecreationAreas;
