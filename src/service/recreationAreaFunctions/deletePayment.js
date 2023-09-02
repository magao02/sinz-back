const RecreationArea = require("../../model/RecreationArea");
const {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_OK,
} = require("../../utils/httpStatus");
const S3Storage = require("../../utils/S3Storage");

async function deletePayment(req, res) {
  if (!req.user.admin) {
    return res
      .status(HTTP_CODE_UNAUTHORIZED)
      .json({ message: "Usuário não tem permissão." });
  }

  if (!req.body.url) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "URL não foi dada." });
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

  const index = reserva.pagamento.files.findIndex(x => x.url === req.body.url);
  if (index === -1) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Arquivo a ser deletado não encontrado." });
  }

  await S3Storage.deleteFile(reserva.pagamento.files[index].key);
  
  reserva.pagamento.files.splice(index, 1);
  
  await area.save();

  return res
    .status(HTTP_CODE_OK)
    .json({ message: "Deletado com sucesso" });
};

module.exports = deletePayment;
