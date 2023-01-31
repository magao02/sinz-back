const store = require("../service/userFunctions/store");
const login = require("../service/userFunctions/login");
const logout = require("../service/userFunctions/logout");
const userPage = require("../service/userFunctions/userPage");
const getPDF = require("../service/userFunctions/getPDF");
const getUserYears = require("../service/userFunctions/getUserYears");
const getUsers = require("../service/userFunctions/getUsers");
const setPassword = require("../service/userFunctions/setPassword");
const setPerfil = require("../service/userFunctions/setPerfil");
const setUser = require("../service/userFunctions/setUser");
const setNewAdmin = require("../service/userFunctions/setNewAdmin");
const deleteUser = require("../service/userFunctions/deleteUser");

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
