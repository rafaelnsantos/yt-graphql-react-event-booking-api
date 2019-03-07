import React from 'react';

const BookingItem = ({ booking, onDelete }) => (
  <li className="bookings__item">
    <div className="bookings__item-data">
      {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString()}
    </div>
    <div className="bookings__item-actions">
      <button className="btn" onClick={onDelete.bind(this, booking._id)}>
        Cancel
      </button>
    </div>
  </li>
);

export default BookingItem;
