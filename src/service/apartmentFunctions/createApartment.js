const Apartment = require("../../model/Apartment");
const {
  HTTP_CODE_BAD_REQUEST,
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
} = require("../../utils/httpStatus");

const createApartment = async (req, res) => {
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
      camas,
      locaisArredores,
      itens,
      areasComuns,
      regrasConvivencia,
    } = req.body;

    let urlApt = titulo.toLowerCase().replace(/\s/g, "-");

    let apt = await Apartment.findOne({ urlApt });

    if (!!apt) {
      return res
        .status(HTTP_CODE_BAD_REQUEST)
        .json({ message: "Apartamento já cadastrado." });
    }

    try {
      apt = await Apartment.create({
        titulo,
        endereco,
        descricao,
        tipo,
        andar,
        suite,
        diaria,
        wifi,
        animais,
        camas,
        urlApt,
        locaisArredores,
        itens,
        areasComuns,
        regrasConvivencia,
      });
      return res.status(HTTP_CODE_OK).json({
        message: "Apartamento " + apt.titulo + " criado com sucesso.",
        url: urlApt,
      });
    } catch (err) {
      return res.status(HTTP_CODE_BAD_REQUEST).json({ message: err.message });
    }
  }
  return res
    .status(HTTP_CODE_UNAUTHORIZED)
    .json({ message: "Usuário não tem permissão." });
};

module.exports = createApartment;
