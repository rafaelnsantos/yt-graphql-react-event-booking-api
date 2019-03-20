const Event = require('../../models/event');
const User = require('../../models/user');

const { userLoader } = require('./dataloaders');
const infoToProjection = require('../mongodb-projection');
const { NEW_EVENT, UPDATED_EVENT } = require('../subscriptions/channels');

exports.resolver = {
  Event: {
    creator: ({ creator }, _, ctx, info) =>
      userLoader(info).load(creator.toString())
  },
  Query: {
    events: (_, args, ctx, info) => Event.find({}, infoToProjection(info))
  },
  Mutation: {
    createEvent: async (_, { eventInput }, { userId, pubsub }) => {
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

        pubsub.publish(NEW_EVENT, { newEvent: createdEvent });
        return createdEvent;
      } catch (err) {
        throw err;
      }
    },
    updateEvent: async (_, { input }, { userId, pubsub }, info) => {
      const event = await Event.findOneAndUpdate(
        { _id: input._id, creator: userId },
        input.event,
        {
          new: true,
          projection: infoToProjection(info)
        }
      );
      pubsub.publish(UPDATED_EVENT, { updatedEvent: event });
      return event;
    }
  }
};
