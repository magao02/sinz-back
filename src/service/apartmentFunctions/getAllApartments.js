const Apartment = require("../../model/Apartment");
const { HTTP_CODE_OK } = require("../../utils/httpStatus");

async function getAllApartments(req, res) {
  const apartments = await Apartment.find({});
  return res.status(HTTP_CODE_OK).json(apartments);
}

module.exports = getAllApartments;
