module.exports = {
  queryLogin: {
    query: `
      query ($email: Email!, $password: String!) {
        login(email: $email password: $password) {
          userId
          token
          tokenExpiration
        }
      }
    `
  }
};
