const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { userLoader, eventLoader } = require('./dataloaders');
const infoToProjection = require('../mongodb-projection');

exports.resolver = {
  Booking: {
    event: ({ event }, _, ctx, info) =>
      eventLoader(info).load(event.toString()),
    user: ({ user }, _, ctx, info) => userLoader(info).load(user.toString())
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
        const booking = await Booking.findOne({ _id: bookingId, user: userId });
        await Booking.deleteOne({ _id: bookingId, user: userId });
        return Event.findOne({ _id: booking.event }, infoToProjection(info));
      } catch (err) {
        throw err;
      }
    }
  }
};
