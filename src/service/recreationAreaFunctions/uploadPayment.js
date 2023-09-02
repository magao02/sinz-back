const RecreationArea = require("../../model/RecreationArea");
const {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_UNAUTHORIZED,
  HTTP_CODE_OK,
} = require("../../utils/httpStatus");
const S3Storage = require("../../utils/S3Storage");
const { nanoid } = require('nanoid');

async function uploadPayment(req, res) {
  if (!req.user.admin) {
    return res
      .status(HTTP_CODE_UNAUTHORIZED)
      .json({ message: "Usuário não tem permissão." });
  }

  if (!req.file) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "file não foi dado." });
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

  const id = nanoid();
  const filename = req.file.originalname;
  const ext = filename.includes('.') ? '.' + filename.split('.').at(-1) : '';
  let obj;
  try {
    obj = await S3Storage.saveFile(req.file.buffer, `uploads/payment/${id}${ext}`);
  } catch (err) {
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Houve um erro ao fazer upload do arquivo." });
  }

  reserva.pagamento.files.push({
    key: obj.key,
    url: obj.url,
    name: filename
  });

  await area.save();

  return res
    .status(HTTP_CODE_OK)
    .json({
      message: "Upload feito com sucesso",
      url: obj.url
    });
};

module.exports = uploadPayment;
