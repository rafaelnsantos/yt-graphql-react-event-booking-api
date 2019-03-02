const Event = require('../../models/event');
const User = require('../../models/user');

const { userLoader } = require('./dataloaders');
const infoToProjection = require('../mongodb-projection');

exports.resolver = {
  Event: {
    creator: ({ creator }, _, ctx, info) =>
      userLoader(info).load(creator.toString())
  },
  Query: {
    events: async (_, args, ctx, info) => Event.find({}, infoToProjection(info))
  },
  Mutation: {
    createEvent: async (_, { eventInput }, { userId }) => {
      const { title, description, price, date } = eventInput;

      const event = new Event({
        title: title,
        description: description,
        price: +price,
        date: date,
        creator: userId
      });

      try {
        const createdEvent = await event.save();
        const creator = await User.findOne(
          { _id: userId },
          { createdEvents: 1 }
        );

        if (!creator) {
          throw new Error('User not found.');
        }
        creator.createdEvents.push(event);
        await creator.save();

        return createdEvent;
      } catch (err) {
        throw err;
      }
    },
    async updateEvent(_, { input }, context) {
      try {
        return Event.findOneAndUpdate(
          { _id: input._id, creator: context.userId },
          input.event,
          { new: true }
        );
      } catch (err) {
        throw err;
      }
    }
  }
};
