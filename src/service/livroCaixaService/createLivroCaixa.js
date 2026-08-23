const LivroCaixa = require("../../model/LivroCaixa");
const {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
} = require("../../utils/httpStatus");
const S3Storage = require("../../utils/S3Storage");

const createLivroCaixa = async (req, res) => {
  if (req.user.admin) {
    const { mes, ano } = req.body;
    let obj = { url: "" };

    if (req.file) {
      const filename = req.file.originalname;
      const ext = filename.includes(".") ? "." + filename.split(".").at(-1) : "";

      const now = new Date();
      const uniqueId = `${now.getFullYear()}${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}${now
        .getHours()
        .toString()
        .padStart(2, "0")}${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}${now
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

      try {
        obj = await S3Storage.saveFile(
          req.file.buffer,
          `uploads/livros-caixa/${uniqueId}${ext}`
        );
      } catch (err) {
        console.log(err);
        return res
          .status(HTTP_CODE_BAD_REQUEST)
          .json({ message: "Houve um erro ao fazer upload do arquivo." });
      }
    }

    try {
      const livroCaixa = await LivroCaixa.create({
        mes,
        ano,
        urlImagem: obj.url,
      });
      return res.status(HTTP_CODE_OK).json({
        message: "Livro caixa do mês " + livroCaixa.mes + "/" + livroCaixa.ano + " criado com sucesso.",
      });
    } catch (err) {
      return res.status(HTTP_CODE_BAD_REQUEST).json({ message: err.message });
    }
  }

  return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });
};

module.exports = createLivroCaixa;
