const Lancamento = require("../../model/Lancamento");
const {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
} = require("../../utils/httpStatus");
const S3Storage = require("../../utils/S3Storage");

const createLancamento = async (req, res) => {
  if (req.user.admin) {
    const {
      descricao,
      data,
      valor,
      tipo,
      idAssociado,
    } = req.body;
    let obj = { url: '' };
    console.log(req.file);
    console.log('Body:', req.body);
    if (req.file) {
      const filename = req.file.originalname;
      const ext = filename.includes('.') ? '.' + filename.split('.').at(-1) : '';
      
      const now = new Date();
    const uniqueId = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    console.log(uniqueId);

      
      try {
    obj = await S3Storage.saveFile(req.file.buffer, `uploads/lancamentos/${uniqueId}${ext}`);
      } catch (err) {
        console.log(err);
    return res
      .status(HTTP_CODE_BAD_REQUEST)
      .json({ message: "Houve um erro ao fazer upload do arquivo." });
  }
    }
    
  
    try {
      const lancamento = await Lancamento.create({
        descricao,
        data,
        valor,
        tipo,
        idAssociado,
        urlComprovante : obj.url,
      });
      return res.status(HTTP_CODE_OK).json({
        message: "Lançamento " + lancamento.descricao + " criado com sucesso.",
      });
    } catch (err) {
      return res.status(HTTP_CODE_BAD_REQUEST).json({ message: err.message });
    }
  }
  return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });
}
 
module.exports = createLancamento;