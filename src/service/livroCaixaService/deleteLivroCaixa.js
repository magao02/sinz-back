const LivroCaixa = require("../../model/LivroCaixa");
const {
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_NOT_FOUND,
  HTTP_CODE_INTERNAL_SERVER_ERROR,
} = require("../../utils/httpStatus");

const deleteLivroCaixa = async (req, res) => {
  if (req.user.admin) {
    const id = req.params.id;
    const livroCaixa = await LivroCaixa.findOne({ _id: id });

    if (!livroCaixa) {
      return res
        .status(HTTP_CODE_NOT_FOUND)
        .json({ message: "Livro caixa não encontrado." });
    }

    try {
      await LivroCaixa.deleteOne({ _id: id });
      return res
        .status(HTTP_CODE_OK)
        .json({ message: "Livro caixa deletado com sucesso" });
    } catch (err) {
      console.error(err);
      return res
        .status(HTTP_CODE_INTERNAL_SERVER_ERROR)
        .json({ message: "Falha ao deletar livro caixa" });
    }
  }

  return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });
};

module.exports = deleteLivroCaixa;
