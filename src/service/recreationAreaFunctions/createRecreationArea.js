const RecreationArea = require("../../model/RecreationArea");
const { HTTP_CODE_BAD_REQUEST, HTTP_CODE_OK } = require("../../utils/httpStatus");

const createRecreationArea = async (req, res) => {
  if (req.user.admin) {
    const {
      titulo,
      endereco,
      descricao,
      tipo,
      andar,
      suite,
      diaria,
      wifi,
      animais,
      capacidadeMaxima,
      locaisArredores,
      itens,
      areasComuns,
      regrasConvivencia,
    } = req.body;

    let urlRec = titulo.toLowerCase().replace(/\s/g, "-");
    let rec = await RecreationArea.findOne({ urlRec });
    console.log(urlRec);
    if (!!rec) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json({ message: "Area de Lazer já cadastrada." });
    }

    try {
      rec = await RecreationArea.create({
        titulo,
        endereco,
        descricao,
        tipo,
        andar,
        suite,
        diaria,
        wifi,
        animais,
        capacidadeMaxima,
        urlRec,
        locaisArredores,
        itens,
        areasComuns,
        regrasConvivencia,
      });
      return res.status(HTTP_CODE_OK).json({
        message: "Area de lazer " + rec.titulo + " criado com sucesso.",
      });
    } catch (err) {
      return res.status(HTTP_CODE_BAD_REQUEST).json({ message: err.message });
    }
  }
  return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });
};

module.exports = createRecreationArea;
