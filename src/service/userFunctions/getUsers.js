const User = require("../../model/User");
const compare = require("../../utils/compareFunctions.js");
const isBlank = require("../../utils/isBlank");
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
        nascimento: isBlank(user.nascimento) ? formatDate(user.nascimento) : "",
        cpf: user.cpf !== "" ? user.cpf : "",
        rg: isBlank(user.rg) ? user.rg : "",
        urlUser: user.urlUser !== "" ? user.urlUser : "",
        emissao: isBlank(user.emissao) ? formatDate(user.emissao) : "",
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
