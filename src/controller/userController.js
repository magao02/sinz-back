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
  //POST METHODS

  async store(req, res) {
    return store(req, res);
  },
  async login(req, res) {
    return login(req, res);
  },

  //GET METHODS

  async logout(req, res) {
    return logout(req, res);
  },

  async userPage(req, res) {
    return userPage(req, res);
  },

  async getPDF(req, res) {
    return getPDF(req, res);
  },

  async getUserYears(req, res) {
    return getUserYears(req, res);
  },

  async getUsers(req, res) {
    return getUsers(req, res);
  },

  //PUT METHODS

  async setPassword(req, res) {
    return setPassword(req, res);
  },

  async setPerfil(req, res) {
    return setPerfil(req, res);
  },

  async setUser(req, res) {
    return setUser(req, res);
  },

  async setNewAdmin(req, res) {
    return setNewAdmin(req, res);
  },

  //DELETE METHODS

  async deleteUser(req, res) {
    return deleteUser(req, res);
  },
};
