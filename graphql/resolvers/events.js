const Event = require('../../models/event');
const User = require('../../models/user');

const { userLoader } = require('./dataloaders');

exports.resolver = {
  Event: {
    creator: ({ creator }) => userLoader.load(creator)
  },
  Query: {
    events: () => Event.find({})
  },
  Mutation: {
    createEvent: async (_, args, req) => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: args.eventInput.date,
        creator: req.userId
      });

      try {
        const createdEvent = await event.save();
        const creator = await User.findById(req.userId);

        if (!creator) {
          throw new Error('User not found.');
        }
        creator.createdEvents.push(event);
        await creator.save();

        return createdEvent;
      } catch (err) {
        throw err;
      }
    }
  }
};
