async function getImpostoByYear(impostos, ano) {
  for (const imposto of impostos) {
    if (imposto.ano === ano) {
      return imposto;
    }
  }

  return undefined;
}

module.exports = getImpostoByYear;
