const User = require("../../model/User");
const Apartment = require("../../model/Apartment");
const getImageUrl = require("../../utils/getImageUrl");
const {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_OK,
  HTTP_CODE_NOT_FOUND,
} = require("../../utils/httpStatus");
function formatDate(date) {
  return date.getUTCDate().toString().padStart(2, '0') + "/" + (date.getUTCMonth() + 1).toString().padStart(2, '0') + "/" + date.getUTCFullYear();
};

const fetchAssociadoData = async id => {
    const user = await User.findById(id);
    if (!user) {
      return {
        nome: "???",
        profissao: "???",
      };
    }
    return {
      nome: user.name,
      profissao: user.profissao,
      profilePic: getImageUrl(user.profilePic),
    };
  };


const getReservationsByDate = async (req, res) => {

  const dataEscolhida = req.params.urlUser ? new Date(req.params.urlUser) : new Date();

  let apts = await Apartment.find({
  "reservas": {
  $elemMatch: {
    "dataChegada": { $lte: dataEscolhida },
    "dataSaida": { $gte: dataEscolhida }
  }
}
  });

  if (!apts) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Apartamento não encontrado." });
  }
  const aptsData = [];
  console.log(apts);


  for (let apt of apts) {

    console.log(apt.reservas);
    const reservasFiltradas = apt.reservas.filter(reserva => 
  new Date(reserva.dataChegada) <= dataEscolhida &&
  new Date(reserva.dataSaida) >= dataEscolhida
);
    console.log(apt.reservas);
    const reservas = reservasFiltradas ?? [];


    for (let reserva of reservas) {
      const reservax = {
        id: reserva._id.toString(),
        apt: apt.urlApt,
    dataChegada: formatDate(reserva.dataChegada),
    dataSaida: formatDate(reserva.dataSaida),
    horarioChegada: reserva.horarioChegada,
    horarioSaida: reserva.horarioSaida,
    diaria: reserva.diaria,
    dias: reserva.dias,
    hospedes: reserva.hospedes,
        cancelled: reserva.cancelled ?? false,
    pagamento: {
      pago: !!reserva.pagamento.foiPago,
      files: reserva.pagamento.files ? reserva.pagamento.files.map(file => ({
        name: file.name,
        url: file.url
      })) : []
    },
    associado: await fetchAssociadoData(reserva.idAssociado)
      };
      aptsData.push(reservax);
    }
  }


  return res
    .status(HTTP_CODE_OK)
    .json(aptsData)
};

module.exports = getReservationsByDate;
