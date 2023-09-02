const Apartment = require("../../model/Apartment");
const { HTTP_CODE_OK, HTTP_CODE_BAD_REQUEST } = require("../../utils/httpStatus");
const getImageUrl = require("../../utils/getImageUrl");
const { isReservationValid, validaData, validaHorario } = require("../../utils/reservation");

async function getAllApartments(req, res) {
  let apartments = await Apartment.find({});
  
  if (req.query.dataChegada) {
    let reserva;
    try {
      reserva = {
        dataChegada: validaData(req.query.dataChegada),
        dataSaida: validaData(req.query.dataSaida),
        horarioChegada: validaHorario(req.query.horarioChegada),
        horarioSaida: validaHorario(req.query.horarioSaida),
      };
    } catch (e) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json({ message: "Dados da reserva invalida." });
    }
    apartments = apartments.filter(apt => isReservationValid(reserva, apt.reservas ?? []));
  }

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
