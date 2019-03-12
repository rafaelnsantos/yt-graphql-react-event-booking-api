import React, { useState, useContext, useEffect } from 'react';

import { GraphQLContext, NotificationContext } from '../context';
import {
  BookingList,
  BookingsChart,
  BookingsControls
} from '../components/Bookings';
import { Modal } from '../components';
import { findInArrayById, removeFromArrayById } from '../helper/array-utils';

const BookingsPage = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [outputType, setOutputType] = useState('list');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState();

  const { query, mutate } = useContext(GraphQLContext);
  const { sendNotification, sendError } = useContext(NotificationContext);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    const bookingsQuery = `
      query {
        bookings {
          _id
          createdAt
          event {
            _id
            title
            date
            price
          }
        }
      }
    `;

    try {
      const { bookings } = await query({
        query: bookingsQuery,
        fetchPolicy: 'no-cache'
      });
      setBookings(bookings);
      setIsLoading(false);
    } catch (err) {
      sendError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const selectBookingHandler = bookingId => {
    setError();
    setSelectedBooking(findInArrayById(bookings, bookingId));
  };

  const deleteBookingHandler = async () => {
    setIsCanceling(true);
    const cancelBookingMutation = `
      mutation ($id: ID!) {
        event: cancelBooking(bookingId: $id) {
        _id
          title
        }
      }
    `;

    try {
      const { event } = await mutate({
        mutation: cancelBookingMutation,
        variables: {
          id: selectedBooking._id
        }
      });
      const updatedBookings = removeFromArrayById(
        bookings,
        selectedBooking._id
      );
      setBookings(updatedBookings);
      sendNotification(`Booking ${event.title} canceled`);
      setSelectedBooking(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCanceling(false);
    }
  };

  const changeOutputTypeHandler = outputType => {
    if (outputType === 'list') {
      setOutputType('list');
    } else {
      setOutputType('chart');
    }
  };
  return (
    <React.Fragment>
      {selectedBooking && (
        <Modal
          title="Cancel Booking"
          onCancel={selectBookingHandler.bind(this, null)}
          onConfirm={deleteBookingHandler}
          isLoading={isCanceling}
          error={error}
        >
          {selectedBooking.event.title}
        </Modal>
      )}
      <BookingsControls
        activeOutputType={outputType}
        onChange={changeOutputTypeHandler}
      />
      {outputType === 'list' ? (
        <BookingList
          isLoading={isLoading}
          bookings={bookings}
          onDelete={selectBookingHandler}
        />
      ) : (
        <BookingsChart bookings={bookings} />
      )}
    </React.Fragment>
  );
};

export default BookingsPage;
