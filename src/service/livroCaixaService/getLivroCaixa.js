const LivroCaixa = require("../../model/LivroCaixa");
const { HTTP_CODE_OK, HTTP_CODE_BAD_REQUEST } = require("../../utils/httpStatus");

const getLivroCaixa = async (req, res) => {
  try {
    const livrosCaixa = await LivroCaixa.find({});
    return res.status(HTTP_CODE_OK).json(livrosCaixa);
  } catch (err) {
    return res.status(HTTP_CODE_BAD_REQUEST).json({ message: err.message });
  }
};

module.exports = getLivroCaixa;
