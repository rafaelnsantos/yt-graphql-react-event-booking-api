import React from 'react';

import './BookingList.css';
import { Fragment } from '../..';
import BookingItem from './BookingItem/BookingItem';

const bookingList = ({ bookings, onDelete, isLoading }) => (
  <Fragment isLoading={isLoading}>
    <ul className="bookings__list">
      {bookings.map(booking => (
        <BookingItem key={booking._id} booking={booking} onDelete={onDelete} />
      ))}
    </ul>
  </Fragment>
);

export default bookingList;
