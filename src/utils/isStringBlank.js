function isStringBlank(string) {
    return string === undefined || string.trim() === "" || string === null;
}

module.exports = isStringBlank;
