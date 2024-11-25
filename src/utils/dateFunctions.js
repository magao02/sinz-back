async function formataData(data) {
    if (data === "") {
      return null;
    }
    data = data.split("/");
    data = new Date(
      `${data[2]}-${data[1].padStart(2, '0')}-${data[0].padStart(2, '0')}T01:00:00+01:00`
    );
    return data;
}

module.exports = formataData;
