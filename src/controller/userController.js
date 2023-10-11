const createUser = require("../service/userFunctions/createUser");
const login = require("../service/userFunctions/login");
const logout = require("../service/userFunctions/logout");
const userPage = require("../service/userFunctions/userPage");
const getPDF = require("../service/userFunctions/getPDF");
const getUserYears = require("../service/userFunctions/getUserYears");
const getUsers = require("../service/userFunctions/getUsers");
const updatePerfil = require("../service/userFunctions/updatePerfil");
const updateUser = require("../service/userFunctions/updateUser");
const deleteUser = require("../service/userFunctions/deleteUser");
const passwordToken = require("../service/userFunctions/passwordToken");
const updatePassword = require("../service/userFunctions/updatePassword");
const setPhoto = require("../service/userFunctions/setPhoto");
const createIncompleteUser = require("../service/userFunctions/createIncompleteUser");

module.exports = {
  //POST METHODS

  async createUser(req, res) {
    return createUser(req, res);
  },
  async login(req, res) {
    return login(req, res);
  },
  async createIncompleteUser(req, res) {
    return createIncompleteUser(req, res);
  },

  //GET METHODS

  async passwordToken(req, res) {
    return passwordToken(req, res);
  },

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

  async updatePassword(req, res) {
    return updatePassword(req, res);
  },

  async updatePerfil(req, res) {
    return updatePerfil(req, res);
  },

  async updateUser(req, res) {
    return updateUser(req, res);
  },

  async setPhoto(req, res) {
    return setPhoto(req, res);
  },

  //DELETE METHODS

  async deleteUser(req, res) {
    return deleteUser(req, res);
  },
};
