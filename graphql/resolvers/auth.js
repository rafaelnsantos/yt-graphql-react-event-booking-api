exports.resolver = {
  User: {
    createdEvents: ({ createdEvents }, _, ctx, info) =>
      ctx.dataloaders.eventLoader(info).loadMany(createdEvents)
  },
  Mutation: {
    createUser: async (_, { email, password }, ctx) =>
      ctx.models.User.createNew(email, password)
  },
  Query: {
    login: (_, { email, password }, ctx) => ctx.models.User.login(email, password)
  }
};
