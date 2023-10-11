const Apartment = require("../../model/Apartment");
const User = require("../../model/User");
const {
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_OK,
  HTTP_CODE_BAD_REQUEST,
} = require("../../utils/httpStatus");
const { isReservationValid, validaData, validaHorario, createDateTime, dayDifference } = require("../../utils/reservation");

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
  
  if (user.isPendingSignup) {
    return res
      .status(HTTP_CODE_UNAUTHORIZED)
      .json({ message: "Usuario tem precadastro pendente." });
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
  const dias = Math.max(1, dayDifference(dataChegada, dataSaida) + 1);
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

  if (!isReservationValid(reserva, apt.reservas)) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Reserva bate com horario de outra reserva." });
  };

  apt.reservas.push(reserva);
  await apt.save();

  return res
    .status(HTTP_CODE_OK)
    .json({ message: "Reserva feita com sucesso." });
};

module.exports = reserveApartment;
