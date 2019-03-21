const infoToProjection = require('../mongodb-projection');

exports.resolver = {
  Booking: {
    event: ({ event }, _, { dataloaders: { eventLoader } }, info) =>
      eventLoader(info).load(event.toString()),
    user: ({ user }, _, { dataloaders: { userLoader } }, info) =>
      userLoader(info).load(user.toString())
  },
  Query: {
    bookings: (_, args, { userId, models: { Booking } }, info) =>
      Booking.find({ user: userId }, infoToProjection(info))
  },
  Mutation: {
    bookEvent: async (_, { eventId }, { userId, models }) => {
      const { Booking, Event } = models;
      const fetchedEvent = await Event.findOne({ _id: eventId }, { _id: 1 });
      const booking = new Booking({
        user: userId,
        event: fetchedEvent
      });
      return booking.save();
    },
    cancelBooking: async (_, { bookingId }, { userId, models }, info) => {
      const { Booking, Event } = models;
      try {
        const booking = await Booking.findOne({ _id: bookingId, user: userId });
        await Booking.deleteOne({ _id: bookingId, user: userId });
        return Event.findOne({ _id: booking.event }, infoToProjection(info));
      } catch (err) {
        throw err;
      }
    }
  }
};
