const jwt = require('jsonwebtoken');
const debug = require('debug')('middleware:auth');
module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretkey');
  } catch (err) {
    debug(err);
    return next();
  }
  if (!decodedToken) {
    return next();
  }
  req.userId = decodedToken.userId;
  next();
};
