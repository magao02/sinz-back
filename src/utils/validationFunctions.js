function validacaoPassword(password) {
  var padraoSenha = /^[a-zA-Z0-9]{8,}$/;
  return padraoSenha.test(password);
}

function validacaoRG(rg) {
  var padraoRG = /^\d{0,9}$/;
  return padraoRG.test(rg);
}

function validacaoTelefone(telefone) {
  var padraoTelefone = /^\d{11}$/;
  return padraoTelefone.test(telefone);
}

function validacaoCPF(cpf) {
  var padraoCPF = /^\d{11}$/;
  return padraoCPF.test(cpf);
}

module.exports = {
  validacaoPassword,
  validacaoRG,
  validacaoTelefone,
  validacaoCPF,
};
