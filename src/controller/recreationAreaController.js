const getAllRecreationAreas = require("../service/recreationAreaFunctions/getAllRecreationAreas");
const getRecreationArea = require("../service/recreationAreaFunctions/getRecreationArea");
const updateRecreationArea = require("../service/recreationAreaFunctions/updateRecreationArea");
const createRecreationArea = require("../service/recreationAreaFunctions/createRecreationArea");

module.exports = {
  async createRecreationArea(req, res) {
    return createRecreationArea(req, res);
  },
  async getAllRecreationAreas(req, res) {
    return getAllRecreationAreas(req, res);
  },
  async getRecreationArea(req, res) {
    return getRecreationArea(req, res);
  },
  async updateRecreationArea(req, res) {
    return updateRecreationArea(req, res);
  },
};
