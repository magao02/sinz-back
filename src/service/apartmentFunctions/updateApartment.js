const Apartment = require("../../model/Apartment");
const { HTTP_CODE_UNAUTHORIZED, HTTP_CODE_OK } = require("../../utils/httpStatus");

async function editApartment(req, res) {
  if (req.user.admin) {
    const urlApt = req.params.urlApt;

    let apt = await Apartment.findOne({ urlApt });

    if (!apt) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Apartamento não encontrado." });
    }
    const data = req.body;
    delete data.reservas;
    
    apt = await Apartment.findByIdAndUpdate(apt._id, data);

    return res
      .status(HTTP_CODE_OK)
      .json({
        message: "Dados do apartamento " + apt.titulo + " atualizados.",
      });
  }
  return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });
}

module.exports = editApartment;
