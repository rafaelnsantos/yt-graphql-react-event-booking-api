const isAuth = require('./isAuth');
const recatpcha = require('./recaptcha');

module.exports = {
  ...isAuth,
  ...recatpcha
};
