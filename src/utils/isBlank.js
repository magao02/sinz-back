function isBlank(str) {
    return str !== null && str.trim() !== "" && str !== undefined;
}

module.exports = isBlank;