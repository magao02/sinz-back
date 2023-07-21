const Apartment = require("../../model/Apartment");
const { HTTP_CODE_NOT_FOUND, HTTP_CODE_OK } = require("../../utils/httpStatus");

async function getApartment(req, res) {
  const urlApt = req.params.urlApt;

  let apt = await Apartment.findOne({ urlApt });

  if (!apt) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Apartamento não encontrado." });
  }

  return res.status(HTTP_CODE_OK).json(apt);
}

module.exports = getApartment;
