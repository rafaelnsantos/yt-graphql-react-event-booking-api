const infoToProjection = require('../graphql/mongodb-projection');
const { NEW_EVENT, UPDATED_EVENT } = require('../graphql/subscriptions/channels');
module.exports = {
  create: async (event, { userId, models: { User, Event }, pubsub }, info) => {
    const { title, description, price, date } = event;

    try {
      const creator = await User.findOne({ _id: userId }, { createdEvents: 1 });

      if (!creator) {
        throw new Error('User not found.');
      }

      const createdEvent = await Event.create({
        title: title,
        description: description,
        price: +price,
        date: date,
        creator: userId
      });
      creator.createdEvents.push(createdEvent);
      await creator.save();

      pubsub.publish(NEW_EVENT, { newEvent: createdEvent });
      return createdEvent;
    } catch (err) {
      throw err;
    }
  },
  update: async (input, { userId, models: { Event }, pubsub }, info) => {
    const event = await Event.findOneAndUpdate(
      { _id: input._id, creator: userId },
      input.event,
      { new: true, projection: infoToProjection(info) }
    );
    pubsub.publish(UPDATED_EVENT, { updatedEvent: event });
    return event;
  },
  get: async ({ models: { Event } }, info) => Event.find({}, infoToProjection(info))
};
