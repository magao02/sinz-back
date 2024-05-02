const Apartment = require("../../model/Apartment");
const S3Storage = require("../../utils/S3Storage");
const {
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_INTERNAL_SERVER_ERROR,
} = require("../../utils/httpStatus");

async function deleteApartment(req, res) {
  if (req.user.admin) {
    const urlApt = req.params.urlApt;

    const apt = await Apartment.findOne({ urlApt });

    if (!apt) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Apartamento não encontrado." });
    }
    
    try {
      await Promise.all(apt.reservas.map(reserva => {
        if (reserva.pagamento.files?.length > 0) {
          return S3Storage.deleteFiles(reserva.pagamento.files.map(file => file.key))
        }

        return;
      }));
    } catch (err) {
      console.error("Falha ao deletar arquivos das reservas.", err);
    }
    
    try {
      await Apartment.deleteOne({ urlApt });
      return res
        .status(HTTP_CODE_OK)
        .json({ message: "Apartamento deletado com sucesso" });
    } catch (err) {
      console.error(err);
      return res
        .status(HTTP_CODE_INTERNAL_SERVER_ERROR)
        .json({ message: "Falha ao deletar apartamento" });
    }
  }
  return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });

}

module.exports = deleteApartment;
