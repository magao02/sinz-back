function isBlank(str) {
    return str !== null && str !== "" && str !== undefined;
}

module.exports = isBlank;