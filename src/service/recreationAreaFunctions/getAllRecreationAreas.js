const RecreationArea = require("../../model/RecreationArea");
const { HTTP_CODE_OK } = require("../../utils/httpStatus");
const getImageUrl = require("../../utils/getImageUrl");
const { isReservationValid, validaData, validaHorario, createDateTime, calculaProximaReserva, formatReserva } = require("../../utils/reservation");
const { DateTime } = require("luxon");

async function getAllRecreationAreas(req, res) {
  let areas = await RecreationArea.find({});
  
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
    areas = areas.filter(apt => isReservationValid(reserva, apt.reservas));
  }

  const reservaAgora = {
    chegada: DateTime.now(),
    saida: DateTime.now(),
  };

  reserva = reserva ?? reservaAgora;

  const data = areas.map(area => {
    let pictures = area.pictures.map(x => getImageUrl(x));

    let closestReserva, nextClosestReserva;
    try {
      [closestReserva, nextClosestReserva] = calculaProximaReserva(reserva, area.reservas);
    } catch (e) {}

    return {
      titulo: area.titulo,
      urlRec: area.urlRec,
      tipo: area.tipo,
      suite: area.suite,
      wifi: area.wifi,
      animais: area.animais,
      pictures,
      // o apartamento está reservado se uma reserva feita agora é invalida
      reservado: !isReservationValid(reservaAgora, area.reservas),
      closestReserva: closestReserva ? formatReserva(closestReserva) : undefined,
      nextClosestReserva: nextClosestReserva ? formatReserva(nextClosestReserva) : undefined,
    };
  });
  return res.status(HTTP_CODE_OK).json(data);
}

module.exports = getAllRecreationAreas;
