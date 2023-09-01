const RecreationArea = require("../../model/RecreationArea");
const getImageUrl = require("../../utils/getImageUrl");
const {
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_OK,
} = require("../../utils/httpStatus");
const S3Storage = require("../../utils/S3Storage");

async function setRecreationAreaPhotos(req, res) {
  const urlRec = req.params.urlRec;

  let area = await RecreationArea.findOne({ urlRec });

  if (!area) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Area de lazer não encontrada." });
  }

  if (!req.user.admin) {
    return res
      .status(HTTP_CODE_UNAUTHORIZED)
      .json({ message: "Usuário não tem permissão." });
  }

  const pictures = [];

  try {
    let index = 0;

    for (const file of req.files) {
      const obj = await S3Storage.savePicture(
        file.buffer,
        `uploads/area/${area._id.toString()}_${index}`,
        file.mimetype
      );
      index++
      pictures.push({
        key: obj.key,
        url: obj.url,
      });
    }
  } catch (err) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Houve um erro ao salvar a imagem." });
  }

  await RecreationArea.findByIdAndUpdate(area._id, {
    pictures,
  });

  return res
    .status(HTTP_CODE_OK)
    .json({
      message: "Imagens definidas com sucesso.",
      urls: pictures.map(pic => getImageUrl(pic)),
    });
}

module.exports = setRecreationAreaPhotos;
