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

const dependenteController = {
  async signUpDep(req, res) {},

  async deleteDep(req, res) {},

  async getDependents(req, res) {},
};

module.exports = dependenteController;
