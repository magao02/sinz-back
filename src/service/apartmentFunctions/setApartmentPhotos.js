const Apartment = require("../../model/Apartment");
const getImageUrl = require("../../utils/getImageUrl");
const {
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_OK,
} = require("../../utils/httpStatus");
const S3Storage = require("../../utils/S3Storage");

async function setApartmentPhotos(req, res) {
  const urlApt = req.params.urlApt;

  let apt = await Apartment.findOne({ urlApt });

  if (!apt) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Apartamento não encontrado." });
  }

  if (!req.user.admin) {
    return res
      .status(HTTP_CODE_UNAUTHORIZED)
      .json({ message: "Usuário não tem permissão." });
  }

  const apartmentPictures = [];

  try {
    index = 0;

    for (const file of req.files) {
      const obj = await S3Storage.saveProfilePicture(
        file.buffer,
        `uploads/apartment/${apt._id.toString()}_${index}`,
        file.mimetype
      );
      index++
      apartmentPictures.push({
        key: obj.key,
        url: obj.url,
      });
    }
  } catch (err) {
    console.log(err)
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Houve um erro ao salvar a imagem." });
  }

  await Apartment.findByIdAndUpdate(apt._id, {
    apartmentPictures,
  });

  return res
    .status(HTTP_CODE_OK)
    .json({
      message: "Imagens definidas com sucesso.",
      urls: apartmentPictures.map((pic) => getImageUrl(pic)),
    });
}

module.exports = setApartmentPhotos;
