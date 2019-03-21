const infoToProjection = require('../graphql/mongodb-projection');

module.exports = {
  get: ({ userId, models: { Booking } }, info) =>
    Booking.find({ user: userId }, infoToProjection(info)),

  bookEvent: async (eventId, { userId, models: { Booking, Event } }) => {
    const fetchedEvent = await Event.findOne({ _id: eventId }, { _id: 1 });
    return Booking.create({
      user: userId,
      event: fetchedEvent
    });
  },
  cancel: async (bookingId, { userId, models: { Booking, Event } }, info) => {
    try {
      const booking = await Booking.findOne({ _id: bookingId, user: userId });
      await Booking.deleteOne({ _id: bookingId, user: userId });
      return Event.findOne({ _id: booking.event }, infoToProjection(info));
    } catch (err) {
      throw err;
    }
  }
};
