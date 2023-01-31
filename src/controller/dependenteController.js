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
  async signUpDep(req, res) {
    return signUpDep(req, res);
  },
  async getDependents(req, res) {
    return getDependents(req, res);
  },

  async deleteDep(req, res) {
    return deleteDep(req, res);
  },
};
