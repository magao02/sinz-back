function validacaoPassword(password) {
  return true
}

function validacaoRG(rg) {
  var padraoRG = /^\d{0,9}$/;
  return padraoRG.test(rg);
}

function validacaoTelefone(telefone) {
  var padraoTelefone = /^\d{10,11}$/;
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
