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

const getReservationsByUser = async (req, res) => {
  const user = await User.findOne({ urlUser: req.params.urlUser });
  if (!user) {
    return res
      .status(HTTP_CODE_NOT_FOUND)
      .json({ message: "Usuario não encontrado." });
  }

  let apts = await Apartment.find(
  { "reservas.idAssociado": user._id },
  )
  if (!apts) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Apartamento não encontrado." });
  }
  const aptsData = []
  for (let apt of apts) {
    apt.reservas = apt.reservas.filter(reserva => reserva.idAssociado == user._id);
    const reservas = {
      dados: apt.reservas,
      fotos: apt.apartmentPictures,
      urlApt: apt.urlApt,
      nome: apt.titulo,
      aptID: apt._id,

    }
    aptsData.push(reservas);
  }


  // const month = req.query.month ? parseInt(req.query.month) : null;

  // const fetchAssociadoData = async id => {
  //   const user = await User.findById(id);
  //   if (!user) {
  //     return {
  //       nome: "???",
  //       profissao: "???",
  //     };
  //   }
  //   return {
  //     nome: user.name,
  //     profissao: user.profissao,
  //     profilePic: getImageUrl(user.profilePic),
  //   };
  // };

  // const reservas = apt.reservas ?? [];

  // const year = (new Date()).getUTCFullYear();

  // const filtReservas = month !== null ? reservas.filter(reserva => {
  //   return reserva.dataChegada.getUTCMonth() === month && reserva.dataChegada.getUTCFullYear() === year;
  // }) : reservas;

  // const data = await Promise.all(filtReservas.map(async reserva => ({
  //   id: reserva._id.toString(),
  //   dataChegada: formatDate(reserva.dataChegada),
  //   dataSaida: formatDate(reserva.dataSaida),
  //   horarioChegada: reserva.horarioChegada,
  //   horarioSaida: reserva.horarioSaida,
  //   diaria: reserva.diaria,
  //   dias: reserva.dias,
  //   hospedes: reserva.hospedes,
  //   pagamento: {
  //     pago: !!reserva.pagamento.foiPago,
  //     files: reserva.pagamento.files ? reserva.pagamento.files.map(file => ({
  //       name: file.name,
  //       url: file.url
  //     })) : []
  //   },
  //   associado: await fetchAssociadoData(reserva.idAssociado)
  // })));

  return res
    .status(HTTP_CODE_OK)
    .json(aptsData)
};

module.exports = getReservationsByUser;
