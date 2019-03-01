const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const { eventLoader } = require('./dataloaders');

exports.resolver = {
  User: {
    createdEvents: ({ createdEvents }) => eventLoader.loadMany(createdEvents)
  },
  Mutation: {
    createUser: async (_, args) => {
      try {
        const existingUser = await User.findOne({
          email: args.userInput.email
        });
        if (existingUser) {
          throw new Error('User exists already.');
        }
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        });

        const result = await user.save();

        return result;
      } catch (err) {
        throw err;
      }
    }
  },
  Query: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email: email });
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
        {
          expiresIn: '1h'
        }
      );
      return { userId: user.id, token: token, tokenExpiration: 1 };
    }
  }
};
