const getAllApartments = require("../service/apartmentFunctions/getAllApartments");
const getApartment = require("../service/apartmentFunctions/getApartment");
const updateApartment = require("../service/apartmentFunctions/updateApartment");
const createApartment = require("../service/apartmentFunctions/createApartment");
const setApartmentPhotos = require("../service/apartmentFunctions/setApartmentPhotos");
const reserveApartment = require("../service/apartmentFunctions/reserveApartment");
const getReservations = require("../service/apartmentFunctions/getReservations");
const uploadPayment = require("../service/apartmentFunctions/uploadPayment");
const deletePayment = require("../service/apartmentFunctions/deletePayment");
const updatePayment = require("../service/apartmentFunctions/updatePayment");
const deleteApartment = require("../service/apartmentFunctions/deleteApartment");



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
  async deleteApartment(req, res) {
    return deleteApartment(req, res);
  },
  async getReservations(req, res) {
    return getReservations(req, res);
  },
  async setApartmentPhotos(req, res) {
    return setApartmentPhotos(req, res);
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
