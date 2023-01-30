const User = require("../model/User");
const Dependent = require("../model/Dependent");
const Imposto = require("../model/Imposto");
const jwt = require("jsonwebtoken");
const createURL = require("../utils/createURL.js");
const { findById, db, collection } = require("../model/Imposto");

const HTTP_CODE_OK = 200;
const HTTP_CODE_CREATED = 201;
const HTTP_CODE_BAD_REQUEST = 400;
const HTTP_CODE_UNAUTHORIZED = 401;
const HTTP_CODE_NOT_FOUND = 404;

const impostoController = {
  async createNewImpostoByYearUser(req, res) {},

  async setImpostoDeRenda(req, res) {},

  async setImpostoDeRendaDep(req, res) {},

  async getPDF(req, res) {},

  async addImpostos() {},

  async createNewImpostoByYearDep(req, res) {},
};

module.exports = impostoController;
