const { NEW_EVENT, UPDATED_EVENT } = require('./channels');

exports.resolver = {
  Subscription: {
    newEvent: {
      subscribe: (_, args, { pubsub }) => pubsub.asyncIterator(NEW_EVENT)
    },
    updatedEvent: {
      subscribe: (_, args, { pubsub }) => pubsub.asyncIterator(UPDATED_EVENT)
    }
  }
};
