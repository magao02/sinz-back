module.exports = {
  async CreateURL(name, cpf) {
    let { name, cpf } = req.body;

    if (name === undefined || cpf === undefined) {
      return res.status(HTTP_CODE_BAD_REQUEST).json({ message: 'Preencha todos os campos.' });
    }

    let user = await User.findOne({ cpf });

    if (!user) {
      var temporalUrl = name.replace(/\s/g, '').toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "");

      let urlUser = temporalUrl;
      let urlUnavailable = true;

      while (urlUnavailable) {
        let userWithThisURL = await User.findOne({ urlUser });

        if (!userWithThisURL) {
          urlUnavailable = false;
        } else {
          urlUser = temporalUrl;
          let randonNum = Math.floor(Math.random() * 1001);
          urlUser = temporalUrl + randonNum.toString();
        }
      }
    }
  }
};

