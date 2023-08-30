const getAllApartments = require("../service/apartmentFunctions/getAllApartments");
const getApartment = require("../service/apartmentFunctions/getApartment");
const updateApartment = require("../service/apartmentFunctions/updateApartment");
const createApartment = require("../service/apartmentFunctions/createApartment");
const setPhotoApartament = require("../service/apartmentFunctions/setPhotoApartment");

module.exports = {
  async createApartment(req, res) {
    return createApartment(req, res);
  },
  async getAllApartments(req, res) {
    return getAllApartments(req, res);
  },
  async getApartment(req, res) {
    return getApartment(req, res);
  },
  async updateApartment(req, res) {
    return updateApartment(req, res);
  },
  async setPhotoApartament(req, res) {
  return setPhotoApartament(req, res);
  },
};
