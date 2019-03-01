const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { userLoader, eventLoader } = require('./dataloaders');
const { dateToString } = require('../../helpers/date');

exports.resolver = {
  Booking: {
    event: ({ event }) => eventLoader.load(event),
    user: ({ user }) => userLoader.load(user),
    createdAt: ({ createdAt }) => dateToString(createdAt),
    updatedAt: ({ updatedAt }) => dateToString(updatedAt)
  },
  Query: {
    bookings: async (_, args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      try {
        const bookings = await Booking.find({ user: req.userId });
        return bookings;
      } catch (err) {
        throw err;
      }
    }
  },
  Mutation: {
    bookEvent: async (_, args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent
      });
      const result = await booking.save();
      return result;
    },
    cancelBooking: async (_, args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      try {
        const booking = await Booking.findById(args.bookingId).populate(
          'event'
        );
        const event = booking.event;
        await Booking.deleteOne({ _id: args.bookingId });
        return event;
      } catch (err) {
        throw err;
      }
    }
  }
};
