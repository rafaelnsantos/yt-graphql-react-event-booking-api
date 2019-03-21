const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.resolver = {
  User: {
    createdEvents: ({ createdEvents }, _, { dataloaders: { eventLoader } }, info) =>
      eventLoader(info).loadMany(createdEvents)
  },
  Mutation: {
    createUser: async (_, { userInput }, { models: { User } }) => {
      const { email, password } = userInput;
      try {
        const existingUser = await User.findOne({ email: email }, { _id: 1 });
        if (existingUser) {
          throw new Error('User exists already.');
        }
        const user = new User({
          email: email,
          password: password
        });

        return user.save();
      } catch (err) {
        throw err;
      }
    }
  },
  Query: {
    login: async (_, { email, password }, { models: { User } }) => {
      const user = await User.findOne({ email: email }, { password: 1 });
      if (!user) {
        throw new Error('User does not exist!');
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error('Password is incorrect!');
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        'somesupersecretkey',
        { expiresIn: '1h' }
      );
      return { userId: user.id, token: token, tokenExpiration: 1 };
    }
  }
};
