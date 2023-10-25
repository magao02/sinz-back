const User = require("../../model/User");
const getImageUrl = require("../../utils/getImageUrl");
const compare = require("../../utils/compareFunctions.js");
const isNotBlank = require("../../utils/isNotBlank");
const {
  HTTP_CODE_OK,
  HTTP_CODE_UNAUTHORIZED,
} = require("../../utils/httpStatus.js");

function formatDate(date) {
  return (
    date.getDate() + 1 + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
}

async function getUsers(req, res) {
  if (req.user.admin) {
    let users = await User.find();
    let usersDTO = [];

    users.forEach((user) => {
      usersDTO.push({
        name: user.name !== "" ? user.name : "",
        nascimento: isNotBlank(user.nascimento) ? formatDate(user.nascimento) : "",
        cpf: user.cpf !== "" ? user.cpf : "",
        rg: isNotBlank(user.rg) ? user.rg : "",
        urlUser: user.urlUser !== "" ? user.urlUser : "",
        emissao: isNotBlank(user.emissao) ? formatDate(user.emissao) : "",
        profissao: isNotBlank(user.profissao) ? user.profissao : "", 
        profilePic: getImageUrl(user.profilePic),
        admin: user.admin,
      });
    });

    usersDTO.sort(compare);

    return res.status(HTTP_CODE_OK).json(usersDTO);
  } else {
    return res.status(HTTP_CODE_UNAUTHORIZED).json({
      message: "Usuário sem permissão de visualizar os assessores.",
    });
  }
}

module.exports = getUsers;
