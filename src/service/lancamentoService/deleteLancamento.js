const Lancamento = require("../../model/Lancamento");
const {
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_INTERNAL_SERVER_ERROR,
} = require("../../utils/httpStatus");

const DeleteLancamento = async (req, res) => {
  if (req.user.admin) {
    const id = req.params.id;

    const lancamento = await Lancamento.findOne({ _id: id });

    if (!lancamento) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Lancamento não encontrado." });
    }

    try {
      await Lancamento.deleteOne({ _id: id });
      return res
        .status(HTTP_CODE_OK)
        .json({ message: "Lancamento deletado com sucesso" });
    } catch (err) {
      console.error(err);
      return res
        .status(HTTP_CODE_INTERNAL_SERVER_ERROR)
        .json({ message: "Falha ao deletar lancamento" });
    }
  }
  return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });
}
 
module.exports = DeleteLancamento;