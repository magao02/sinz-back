const {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_OK,
  HTTP_CODE_INTERNAL_SERVER_ERROR,
} = require("../../utils/httpStatus");
const Apartment = require("../../model/Apartment");
async function cancelReservation(req, res) {
  const { apartmentId, reservaId } = req.params; 
  try {
    // Encontra o apartamento com a reserva correspondente
    console.log("cancelReservation", apartmentId, reservaId);
    const result = await Apartment.updateOne(
      { urlApt: apartmentId, "reservas._id": reservaId },
      { $set: { "reservas.$.cancelled": true } }
    );

    if (result.matchedCount === 0) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Apartamento ou reserva não encontrados." });
    }

    if (result.modifiedCount === 0) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json({ message: "A reserva já está cancelada ou não pôde ser atualizada." });
    }
    console.log("Reserva cancelada com sucesso!");
    console.log("result", result);

    return res
     
      .status(HTTP_CODE_OK)
      .json({ message: "Reserva cancelada com sucesso!" });
  } catch (error) {

    console.error("Erro ao cancelar a reserva:", error);
    return res
      .status(HTTP_CODE_INTERNAL_SERVER_ERROR)
      .json({ message: "Erro ao processar a solicitação." });
  }
}

module.exports = cancelReservation;