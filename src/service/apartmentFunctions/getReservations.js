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

  const fetchAssociadoData = async id => {
    const user = await User.findById(id);
    return {
      nome: user.name,
      profissao: user.profissao,
      profilePic: getImageUrl(user.profilePic),
    };
  };

  const data = apt.reservas ? await Promise.all(apt.reservas.map(async reserva => ({
    dataChegada: reserva.dataChegada,
    dataSaida: reserva.dataSaida,
    horarioChegada: reserva.horarioChegada,
    horarioSaida: reserva.horarioSaida,
    diaria: reserva.diaria,
    dias: reserva.dias,
    hospedes: reserva.hospedes,
    pagamento: {
      pago: !!reserva.foiPago,
      files: reserva.files ? reserva.files.map(file => ({
        name: file.name,
        url: file.url
      })) : []
    },
    associado: await fetchAssociadoData(reserva.idAssociado)
  }))) : [];

  return res
    .status(HTTP_CODE_OK)
    .json(data)
};

module.exports = getReservations;
