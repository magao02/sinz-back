const getAllRecreationAreas = require("../service/recreationAreaFunctions/getAllRecreationAreas");
const getRecreationArea = require("../service/recreationAreaFunctions/getRecreationArea");
const updateRecreationArea = require("../service/recreationAreaFunctions/updateRecreationArea");
const createRecreationArea = require("../service/recreationAreaFunctions/createRecreationArea");
const setRecreationAreaPhotos = require("../service/recreationAreaFunctions/setRecreationAreaPhotos");
const reserveRecreationArea = require("../service/recreationAreaFunctions/reserveRecreationArea");
const getReservations = require("../service/recreationAreaFunctions/getReservations");
const uploadPayment = require("../service/recreationAreaFunctions/uploadPayment");
const deletePayment = require("../service/recreationAreaFunctions/deletePayment");
const updatePayment = require("../service/recreationAreaFunctions/updatePayment");

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
  async setRecreationAreaPhotos(req, res) {
    return setRecreationAreaPhotos(req, res);
  },
  async reserveRecreationArea(req, res) {
    return reserveRecreationArea(req, res);
  },
  async getReservations(req, res) {
    return getReservations(req, res);
  },
  async uploadPayment(req, res) {
    return uploadPayment(req, res);
  },
  async deletePayment(req, res) {
    return deletePayment(req, res);
  },
  async updatePayment(req, res) {
    return updatePayment(req, res);
  },
};
