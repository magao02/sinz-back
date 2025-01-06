const createLancamento = require("../service/lancamentoService/createLancamento");
const getLancamentos = require("../service/lancamentoService/getLancamento");
const deleteLancamento = require("../service/lancamentoService/deleteLancamento");

module.exports = {
  async createLancamento(req, res) {
    return createLancamento(req, res);
  },
  async getLancamentos(req, res) {
    return getLancamentos(req, res);
  },
  async deleteLancamento(req, res) {
    return deleteLancamento(req, res);
  },
}