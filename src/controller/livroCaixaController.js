const createLivroCaixa = require("../service/livroCaixaService/createLivroCaixa");
const getLivroCaixa = require("../service/livroCaixaService/getLivroCaixa");
const deleteLivroCaixa = require("../service/livroCaixaService/deleteLivroCaixa");

module.exports = {
  async createLivroCaixa(req, res) {
    return createLivroCaixa(req, res);
  },
  async getLivroCaixa(req, res) {
    return getLivroCaixa(req, res);
  },
  async deleteLivroCaixa(req, res) {
    return deleteLivroCaixa(req, res);
  },
};
