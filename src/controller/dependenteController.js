const signUpDep = require("../service/dependenteFunctions/signUpDep");
const getDependents = require("../service/dependenteFunctions/getDependents");
const deleteDep = require("../service/dependenteFunctions/deleteDep");

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
