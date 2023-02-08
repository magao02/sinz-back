const setImpostoDeRenda = require("../service/impostoFunctions/setImpostoDeRenda");
const setImpostoDeRendaDep = require("../service/impostoFunctions/setImpostoDeRendaDep");
const createNewImpostoByYearUser = require("../service/impostoFunctions/createNewImpostoByYearUser");
const createNewImpostoByYearDep = require("../service/impostoFunctions/createNewImpostoByYearDep");

module.exports = {
  async setImpostoDeRenda(req, res) {
    return setImpostoDeRenda(req, res);
  },
  async setImpostoDeRendaDep(req, res) {
    return setImpostoDeRendaDep(req, res);
  },

  async createNewImpostoByYearUser(req, res) {
    return createNewImpostoByYearUser(req, res);
  },

  async createNewImpostoByYearDep(req, res) {
    return createNewImpostoByYearDep(req, res);
  },
};
