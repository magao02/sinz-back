const User = require('../model/User');


async function createURL(name) {
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
          let randonNum = Math.floor(Math.random() * 10001);
          urlUser = temporalUrl + randonNum.toString();
        }
      }

      return urlUser;
};

module.exports = createURL;



