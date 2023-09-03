const Apartment = require("../../model/Apartment");
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

  const index = reserva.pagamento.files.findIndex(x => x.url === req.body.url);
  if (index === -1) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Arquivo a ser deletado não encontrado." });
  }

  await S3Storage.deleteFile(reserva.pagamento.files[index].key);
  
  reserva.pagamento.files.splice(index, 1);
  
  await apt.save();

  return res
    .status(HTTP_CODE_OK)
    .json({ message: "Deletado com sucesso" });
};

module.exports = deletePayment;
