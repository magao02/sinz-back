const Apartment = require("../../model/Apartment");
const {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_OK,
} = require("../../utils/httpStatus");

async function updatePayment(req, res) {
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

  const reserva = apt.reservas.find(r => r._id.equals(req.params.reservaId));
  if (!reserva) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Reserva não encontrada." });
  }

  reserva.pagamento.foiPago = !!req.body.pago;

  await apt.save();

  return res
    .status(HTTP_CODE_OK)
    .json({ message: "Pagamento atualizado com sucesso" });
};

module.exports = updatePayment;
