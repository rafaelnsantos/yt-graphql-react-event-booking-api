exports.resolver = {
  Event: {
    creator: ({ creator }, _, ctx, info) =>
      ctx.dataloaders.userLoader(info).load(creator.toString())
  },
  Query: {
    events: (_, args, ctx, info) => ctx.services.Event.get(ctx, info)
  },
  Mutation: {
    createEvent: async (_, { eventInput }, ctx) =>
      ctx.services.Event.create(eventInput, ctx),

    updateEvent: async (_, { input }, ctx, info) =>
      ctx.services.Event.update(input, ctx, info)
  }
};
