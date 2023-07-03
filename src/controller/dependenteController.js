const signUpDep = require("../service/dependenteFunctions/signUpDep");
const getDependents = require("../service/dependenteFunctions/getDependents");
const deleteDep = require("../service/dependenteFunctions/deleteDep");
const updateDep = require("../service/dependenteFunctions/updateDep")

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
  async updateDep(req,res) {
    return updateDep(req,res);
  }
};
