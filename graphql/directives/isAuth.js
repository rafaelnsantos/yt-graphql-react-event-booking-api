module.exports = {
  isAuth(next, _, requires, { userId }) {
    if (!userId) throw new Error('Unauthenticated');
    return next();
  }
};
