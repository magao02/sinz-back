const Apartment = require("../../model/Apartment");
const { HTTP_CODE_OK } = require("../../utils/httpStatus");
const getImageUrl = require("../../utils/getImageUrl");

async function getAllApartments(req, res) {
  const apartments = await Apartment.find({});
  const data = apartments.map(apt => {
    let pictures = apt.apartmentPictures.map(x => getImageUrl(x));
    return {
      titulo: apt.titulo,
      urlApt: apt.urlApt,
      tipo: apt.tipo,
      suite: apt.suite,
      wifi: apt.wifi,
      animais: apt.animais,
      pictures,
    };
  });
  return res.status(HTTP_CODE_OK).json(data);
}

module.exports = getAllApartments;
