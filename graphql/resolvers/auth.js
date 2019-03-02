const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const { eventLoader } = require('./dataloaders');
const infoToProjection = require('../mongodb-projection');

exports.resolver = {
  User: {
    createdEvents: ({ createdEvents }, _, ctx, info) =>
      eventLoader(info).loadMany(createdEvents)
  },
  Mutation: {
    createUser: async (_, { userInput }) => {
      const { email, password } = userInput;
      try {
        const existingUser = await User.findOne(
          {
            email: email
          },
          { _id: 1 }
        );
        if (existingUser) {
          throw new Error('User exists already.');
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
          email: email,
          password: hashedPassword
        });

        return user.save();
      } catch (err) {
        throw err;
      }
    }
  },
  Query: {
    login: async (_, { email, password }) => {
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
        {
          expiresIn: '1h'
        }
      );
      return { userId: user.id, token: token, tokenExpiration: 1 };
    }
  }
};
