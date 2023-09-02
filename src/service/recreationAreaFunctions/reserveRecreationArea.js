const RecreationArea = require("../../model/RecreationArea");
const User = require("../../model/User");
const {
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_OK,
  HTTP_CODE_BAD_REQUEST,
} = require("../../utils/httpStatus");
const { DateTime } = require("luxon");
const { isReservationValid, validaData, validaHorario } = require("../../utils/reservation");

function dayDifference(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date2 - date1) / oneDay));
}

function createDateTime(date, horario) {
  const [hours, minutes] = horario.split(':').map(x => parseInt(x));
  if (date instanceof Date)
    date = DateTime.fromJSDate(date);
  return date.set({ hours, minutes });
}

const reserveRecreationArea = async (req, res) => {
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

  const area = await RecreationArea.findOne({ urlRec: req.params.urlRec });
  if (!area) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Area de lazer não encontrada." });
  }

  let {
    dataChegada,
    dataSaida,
    horarioChegada,
    horarioSaida,
    pessoas,
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
    diaria: area.diaria,
    dias,
    idAssociado: user._id,
    hospedes: {
      pessoas,
    }
  };

  const chegada = createDateTime(dataChegada, horarioChegada);
  const saida = createDateTime(dataSaida, horarioSaida);

  if (saida <= chegada) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Reserva tem horarios invalidos." });
  }

  if (!isReservationValid(reserva, area.reservas)) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Reserva bate com horario de outra reserva." });
  };

  area.reservas.push(reserva);
  await area.save();

  return res
    .status(HTTP_CODE_OK)
    .json({ message: "Reserva feita com sucesso." });
};

module.exports = reserveRecreationArea;
