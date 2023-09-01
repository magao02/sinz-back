const getAllApartments = require("../service/apartmentFunctions/getAllApartments");
const getApartment = require("../service/apartmentFunctions/getApartment");
const updateApartment = require("../service/apartmentFunctions/updateApartment");
const createApartment = require("../service/apartmentFunctions/createApartment");
const reserveApartment = require("../service/apartmentFunctions/reserveApartment");
const getReservations = require("../service/apartmentFunctions/getReservations");
const setApartmentPhotos = require("../service/apartmentFunctions/setApartmentPhotos");

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
  async reserveApartment(req, res) {
    return reserveApartment(req, res);
  },
  async getReservations(req, res) {
    return getReservations(req, res);
  }
  async setApartmentPhotos(req, res) {
    return setApartmentPhotos(req, res);
  },
};
