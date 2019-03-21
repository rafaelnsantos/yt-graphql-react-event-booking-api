exports.resolver = {
  User: {
    createdEvents: ({ createdEvents }, _, { dataloaders: { eventLoader } }, info) =>
      eventLoader(info).loadMany(createdEvents)
  },
  Mutation: {
    createUser: async (_, { email, password }, { models: { User } }) =>
      User.createNew(email, password)
  },
  Query: {
    login: (_, { email, password }, { models: { User } }) => User.login(email, password)
  }
};
