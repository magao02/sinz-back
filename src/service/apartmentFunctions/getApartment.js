const Apartment = require("../../model/Apartment");
const { HTTP_CODE_NOT_FOUND, HTTP_CODE_OK } = require("../../utils/httpStatus");
const getImageUrl = require("../../utils/getImageUrl");

async function getApartment(req, res) {
  const urlApt = req.params.urlApt;

  let apt = await Apartment.findOne({ urlApt });

  if (!apt) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Apartamento não encontrado." });
  }

  let pictures = apt.apartmentPictures.map(x => getImageUrl(x));
  const data = {
    titulo: apt.titulo,
    urlApt: apt.urlApt,
    tipo: apt.tipo,
    suite: apt.suite,
    wifi: apt.wifi,
    animais: apt.animais,
    pictures,
    // exclusive to this endpoint:
    endereco: apt.endereco,
    descricao: apt.descricao,
    andar: apt.andar,
    diaria: apt.diaria,
    camas: apt.camas,
    locaisArredores: apt.locaisArredores,
    regrasConvivencia: apt.regrasConvivencia,
    itens: apt.itens,
    areasComuns: apt.areasComuns,
  };

  return res.status(HTTP_CODE_OK).json(data);
}

module.exports = getApartment;
