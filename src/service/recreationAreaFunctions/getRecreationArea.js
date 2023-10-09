const RecreationArea = require("../../model/RecreationArea");
const { HTTP_CODE_NOT_FOUND, HTTP_CODE_OK } = require("../../utils/httpStatus");
const getImageUrl = require("../../utils/getImageUrl");

async function getRecreationArea(req, res) {
  const urlRec = req.params.urlRecreationArea;

  let rec = await RecreationArea.findOne({ urlRec });

  if (!rec) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Area de Lazer não encontrada." });
  }

  let pictures = rec.pictures.map(x => getImageUrl(x));
  const data = {
    titulo: rec.titulo,
    urlRec: rec.urlRec,
    tipo: rec.tipo,
    suite: rec.suite,
    wifi: rec.wifi,
    animais: rec.animais,
    pictures,
    // exclusive to this endpoint:
    endereco: rec.endereco,
    descricao: rec.descricao,
    andar: rec.andar,
    diaria: rec.diaria,
    locaisArredores: rec.locaisArredores,
    regrasConvivencia: rec.regrasConvivencia,
    itens: rec.itens,
    areasComuns: rec.areasComuns,
    capacidadeMaxima: rec.capacidadeMaxima
  };

  return res.status(HTTP_CODE_OK).json(data);
}

module.exports = getRecreationArea;
