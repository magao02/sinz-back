const Apartment = require("../../model/Apartment");
const User = require("../../model/User");
const formataData = require("../../utils/dateFunctions");
const {
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_OK,
  HTTP_CODE_BAD_REQUEST,
} = require("../../utils/httpStatus");

function dayDifference(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date2 - date1) / oneDay));
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
    dataChegada = await formataData(dataChegada);
    dataSaida = await formataData(dataSaida);
  } catch (err) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json("Data inserida incorretamente. Formato correto: dd/mm/aaaa");
  }
  const dias = dayDifference(dataChegada, dataSaida);
  try {
    horarioChegada = validaHorario(horarioChegada);
    horarioSaida = validaHorario(horarioSaida);
  } catch (err) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json("Horario inserido incorretamente. Formato correto: HH:MM");
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

  // FIXME: this is wrong!!! only temporary..

  apt.reservas.push(reserva);
  await apt.save();

  return res
    .status(HTTP_CODE_OK)
    .json({ message: "Reserva feita com sucesso." });
};

module.exports = reserveApartment;
