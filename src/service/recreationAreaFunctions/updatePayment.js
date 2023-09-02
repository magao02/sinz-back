const RecreationArea = require("../../model/RecreationArea");
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

  let area = await RecreationArea.findOne({ urlRec: req.params.urlRec });

  if (!area) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Area de lazer não encontrada." });
  }

  const reserva = area.reservas.find(r => r._id.equals(req.params.reservaId));
  if (!reserva) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Reserva não encontrada." });
  }

  reserva.pagamento.foiPago = !!req.body.pago;

  await area.save();

  return res
    .status(HTTP_CODE_OK)
    .json({ message: "Pagamento atualizado com sucesso" });
};

module.exports = updatePayment;
