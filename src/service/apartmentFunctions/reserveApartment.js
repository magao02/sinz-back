const Apartment = require("../../model/Apartment");
const User = require("../../model/User");
const formataData = require("../../utils/dateFunctions");
const {
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_OK,
  HTTP_CODE_BAD_REQUEST,
} = require("../../utils/httpStatus");

const { DateTime } = require("luxon");

function dayDifference(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date2 - date1) / oneDay));
}

function validaData(data) {
  data = data.split("-");
  return new Date(
    `${data[0]}-${data[1].padStart(2, '0')}-${data[2].padStart(2, '0')}T01:00:00+01:00`
  );
}

function validaHorario(horario) {
  function assert(cond) {
    if (!cond) {
      throw new Error("Assertion failed");
    }
  }
  assert(horario.split(':').length === 2);
  const [hour, minute] = horario.split(':').map(x => parseInt(x));
  assert(hour >= 0 && hour < 24);
  assert(minute >= 0 && minute < 60);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

function createDateTime(date, horario) {
  const [hours, minutes] = horario.split(':').map(x => parseInt(x));
  if (date instanceof Date)
    date = DateTime.fromJSDate(date);
  return date.set({ hours, minutes });
}

const reserveApartment = async (req, res) => {
  if (!req.user.admin && req.user.urlUser !== req.params.urlUser) {
    return res
      .status(HTTP_CODE_UNAUTHORIZED)
      .json({ message: "Usuário não tem permissão para reservar por outro usuario." });
  }

  const user = await User.findOne({ urlUser: req.params.urlUser });
  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Usuario não encontrado." });
  }

  const apt = await Apartment.findOne({ urlApt: req.params.urlApt });
  if (!apt) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Apartamento não encontrado." });
  }

  let {
    dataChegada,
    dataSaida,
    horarioChegada,
    horarioSaida,
    adultos,
    bebes,
    criancas,
    animais
  } = req.body;

  try {
    dataChegada = validaData(dataChegada);
    dataSaida = validaData(dataSaida);
  } catch (err) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Data inserida incorretamente. Formato correto: aaaa-mm-dd" });
  }
  const dias = Math.max(1, dayDifference(dataChegada, dataSaida));
  try {
    horarioChegada = validaHorario(horarioChegada);
    horarioSaida = validaHorario(horarioSaida);
  } catch (err) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Horario inserido incorretamente. Formato correto: HH:MM" });
  }

  const reserva = {
    dataChegada,
    dataSaida,
    horarioChegada,
    horarioSaida,
    diaria: apt.diaria,
    dias,
    idAssociado: user._id,
    hospedes: {
      adultos,
      bebes,
      criancas,
      animais
    }
  };

  const chegada = createDateTime(dataChegada, horarioChegada);
  const saida = createDateTime(dataSaida, horarioSaida);

  if (saida <= chegada) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Reserva tem horarios invalidos." });
  }

  const invalidReservation = () => {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Reserva bate com horario de outra reserva." });
  };

  for (let otherReserva of apt.reservas) {
    const otherChegada = createDateTime(otherReserva.dataChegada, otherReserva.horarioChegada);
    const otherSaida = createDateTime(otherReserva.dataSaida, otherReserva.horarioSaida);
    if (chegada > otherChegada) {
      // essa reserva inicia apos a outra, então a saida da outra tem que ser antes da chegada dessa
      if (chegada < otherSaida) {
        return invalidReservation();
      }
    } else {
      // essa reserva inicia antes da outra, então a saida dessa tem que ser antes da chegada da outra
      if (saida > otherChegada) {
        return invalidReservation();
      }
    }
  }
  // a esse ponto a reserva é considerada valida

  apt.reservas.push(reserva);
  await apt.save();

  return res
    .status(HTTP_CODE_OK)
    .json({ message: "Reserva feita com sucesso." });
};

module.exports = reserveApartment;
