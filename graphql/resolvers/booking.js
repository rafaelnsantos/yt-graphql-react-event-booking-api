const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { userLoader, eventLoader } = require('./dataloaders');
const { infoToProjection } = require('graphql-mongodb-projection');

exports.resolver = {
  Booking: {
    event: ({ event }) => eventLoader.load(event.toString()),
    user: ({ user }) => userLoader.load(user.toString())
  },
  Query: {
    bookings: (_, args, { userId }, info) =>
      Booking.find({ user: userId }, infoToProjection(info))
  },
  Mutation: {
    bookEvent: async (_, { eventId }, { userId }) => {
      const fetchedEvent = await Event.findOne({ _id: eventId }, { _id: 1 });
      const booking = new Booking({
        user: userId,
        event: fetchedEvent
      });
      return booking.save();
    },
    cancelBooking: async (_, { bookingId }, { userId }, info) => {
      try {
        const booking = await Booking.findById(bookingId);
        const event = booking.event;
        await Booking.deleteOne({ _id: bookingId, user: userId });
        return Event.findOne({ _id: event }, infoToProjection(info));
      } catch (err) {
        throw err;
      }
    }
  }
};
