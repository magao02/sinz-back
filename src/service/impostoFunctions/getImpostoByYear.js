const User = require("../../model/User");
const Imposto = require("../../model/Imposto");
const Dependent = require("../../model/Dependent");
const createURL = require("../../utils/createURL.js");

async function getImpostoByYear(impostos, ano) {
  for (const imposto of impostos) {
    if (imposto.ano === ano) {
      return imposto;
    }
  }

  return undefined;
}

module.exports = getImpostoByYear;
