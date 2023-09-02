const Apartment = require("../../model/Apartment");
const { HTTP_CODE_OK, HTTP_CODE_BAD_REQUEST } = require("../../utils/httpStatus");
const getImageUrl = require("../../utils/getImageUrl");
const { isReservationValid, validaData, validaHorario, createDateTime } = require("../../utils/reservation");
const { DateTime } = require("luxon");

function formatDate(date) {
  return date.getUTCDate().toString().padStart(2, '0') + "/" + (date.getUTCMonth() + 1).toString().padStart(2, '0') + "/" + date.getUTCFullYear();
}

function formatReserva(reserva) {
  return {
    chegada: formatDate(reserva.dataChegada),
    saida: formatDate(reserva.dataSaida),
  };
}

function findMinIndex(arr, pred) {
  let min = null;
  let ind = -1;
  for (let i = 0; i < arr.length; ++i) {
    let value = pred(arr[i]);
    if (value === undefined) continue;
    if (ind === -1 || value < min) {
      min = value;
      ind = i;
    }
  }
  return ind;
}

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

    // calculando qual a reserva mais proxima
    let closestReserva = findMinIndex(apt.reservas, otherReserva => {
      const otherChegada = createDateTime(otherReserva.dataChegada, otherReserva.horarioChegada);
      const otherSaida = createDateTime(otherReserva.dataSaida, otherReserva.horarioSaida);
      let diff = Math.min(Math.abs(otherChegada - reserva.saida), Math.abs(reserva.chegada - otherSaida));
      return diff;
    });
    
    closestReserva = apt.reservas[closestReserva];
    if (closestReserva)
      closestReserva.chegada = createDateTime(closestReserva.dataChegada, closestReserva.horarioChegada);

    // encontra o menor maior que closestReserva
    let nextClosestReserva = closestReserva ? findMinIndex(apt.reservas, otherReserva => {
      if (otherReserva == closestReserva) return;
      const otherChegada = createDateTime(otherReserva.dataChegada, otherReserva.horarioChegada);
      if (otherChegada < closestReserva.chegada) return;
      return otherChegada - closestReserva.chegada;
    }) : null;
    nextClosestReserva = apt.reservas[nextClosestReserva];

    return {
      titulo: apt.titulo,
      urlApt: apt.urlApt,
      tipo: apt.tipo,
      suite: apt.suite,
      wifi: apt.wifi,
      animais: apt.animais,
      pictures,
      // o apartamento está reservado se uma reserva feita agora é invalida
      reservado: !isReservationValid(reservaAgora, apt.reservas),
      closestReserva: closestReserva ? formatReserva(closestReserva) : undefined,
      nextClosestReserva: nextClosestReserva ? formatReserva(nextClosestReserva) : undefined,
    };
  });
  return res.status(HTTP_CODE_OK).json(data);
}

module.exports = getAllApartments;
