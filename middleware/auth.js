const jwt = require('jsonwebtoken');
const debug = require('debug')('middleware:auth');

module.exports = authHeader => {
  if (!authHeader) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    return null;
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    debug(err);
    return null;
  }
  if (!decodedToken) {
    return null;
  }
  return decodedToken.userId;
};
