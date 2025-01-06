const Lancamento = require("../../model/Lancamento");
const { HTTP_CODE_OK, HTTP_CODE_BAD_REQUEST } = require("../../utils/httpStatus");

const GetLancamentos = async (req, res) => {
  try {
    const lancamentos = await Lancamento.find({})
    return res.status(HTTP_CODE_OK).json(lancamentos);
  } catch (err) {
    return res.status(HTTP_CODE_BAD_REQUEST).json({ message: err.message });
  }
}
 
module.exports = GetLancamentos;