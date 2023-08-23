function isStringBlank(string) {
    return string === undefined || string === null || string.toString().trim() === "";
}

module.exports = isStringBlank;
