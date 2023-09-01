const RecreationArea = require("../../model/RecreationArea");
const { HTTP_CODE_OK } = require("../../utils/httpStatus");
const getImageUrl = require("../../utils/getImageUrl");

async function getAllRecreationAreas(req, res) {
  const recreationAreas = await RecreationArea.find({});
  const data = recreationAreas.map(area => {
    let pictures = area.pictures.map(x => getImageUrl(x));
    return {
      titulo: area.titulo,
      urlRec: area.urlRec,
      tipo: area.tipo,
      suite: area.suite,
      wifi: area.wifi,
      animais: area.animais,
      pictures,
    };
  });
  return res.status(HTTP_CODE_OK).json(data);
}

module.exports = getAllRecreationAreas;
