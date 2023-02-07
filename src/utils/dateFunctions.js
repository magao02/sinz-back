async function formataData(data) {
    data = data.split("/");
    data = new Date(
      `${data[2]}-${data[1]}-${data[0]}T01:00:00+01:00`
    );
    return data;
}

module.exports = formataData;
