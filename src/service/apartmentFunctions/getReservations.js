const User = require("../../model/User");
const Apartment = require("../../model/Apartment");
const getImageUrl = require("../../utils/getImageUrl");
const {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_OK,
} = require("../../utils/httpStatus");

const getReservations = async (req, res) => {
  if (!req.user.admin) {
    return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });
  }

  let apt = await Apartment.findOne({ urlApt: req.params.urlApt });

  if (!apt) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Apartamento não encontrado." });
  }

  const month = req.query.month ? parseInt(req.query.month) : null;

  const fetchAssociadoData = async id => {
    const user = await User.findById(id);
    return {
      nome: user.name,
      profissao: user.profissao,
      profilePic: getImageUrl(user.profilePic),
    };
  };

  const reservas = apt.reservas ?? [];

  const year = (new Date()).getUTCFullYear();

  const filtReservas = month !== null ? reservas.filter(reserva => {
    return reserva.dataChegada.getUTCMonth() === month && reserva.dataChegada.getUTCFullYear() === year;
  }) : reservas;

  const data = await Promise.all(filtReservas.map(async reserva => ({
    id: reserva._id.toString(),
    dataChegada: reserva.dataChegada,
    dataSaida: reserva.dataSaida,
    horarioChegada: reserva.horarioChegada,
    horarioSaida: reserva.horarioSaida,
    diaria: reserva.diaria,
    dias: reserva.dias,
    hospedes: reserva.hospedes,
    pagamento: {
      pago: !!reserva.pagamento.foiPago,
      files: reserva.pagamento.files ? reserva.pagamento.files.map(file => ({
        name: file.name,
        url: file.url
      })) : []
    },
    associado: await fetchAssociadoData(reserva.idAssociado)
  })));

  return res
    .status(HTTP_CODE_OK)
    .json(data)
};

module.exports = getReservations;
