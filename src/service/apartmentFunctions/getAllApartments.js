const Apartment = require("../../model/Apartment");
const { HTTP_CODE_OK, HTTP_CODE_BAD_REQUEST } = require("../../utils/httpStatus");
const getImageUrl = require("../../utils/getImageUrl");
const { isReservationValid, validaData, validaHorario, createDateTime, calculaProximaReserva, formatReserva, temReservaHoje  } = require("../../utils/reservation");
const { DateTime } = require("luxon");

async function getAllApartments(req, res) {
  let apartments = await Apartment.find({});
  
  let reserva;
  if (req.query.dataChegada) {
    try {
      reserva = {
        chegada: createDateTime(validaData(req.query.dataChegada), validaHorario(req.query.horarioChegada)),
        saida: createDateTime(validaData(req.query.dataSaida), validaHorario(req.query.horarioSaida)),
      };
    } catch (e) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json({ message: "Dados da reserva invalida." });
    }
    apartments = apartments.filter(apt => isReservationValid(reserva, apt.reservas));
  }

  const reservaAgora = {
    chegada: DateTime.now(),
    saida: DateTime.now(),
  };

  reserva = reserva ?? reservaAgora;

  const data = apartments.map(apt => {
    let pictures = apt.apartmentPictures.map(x => getImageUrl(x));

    let closestReserva, nextClosestReserva;
    try {
      [closestReserva, nextClosestReserva] = calculaProximaReserva(reserva, apt.reservas);
    } catch (e) {}

    return {
      titulo: apt.titulo,
      urlApt: apt.urlApt,
      tipo: apt.tipo,
      suite: apt.suite,
      wifi: apt.wifi,
      animais: apt.animais,
      pictures,
      // o apartamento está reservado se uma reserva feita agora é invalida
      reservado: temReservaHoje( apt.reservas),
      closestReserva: closestReserva ? formatReserva(closestReserva) : undefined,
      nextClosestReserva: nextClosestReserva ? formatReserva(nextClosestReserva) : undefined,
    };
  });
  return res.status(HTTP_CODE_OK).json(data);
}

module.exports = getAllApartments;
