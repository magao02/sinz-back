function isBlank(str) {
    return str !== null && str !== undefined && str.toString().trim() !== "";
}

module.exports = isBlank;