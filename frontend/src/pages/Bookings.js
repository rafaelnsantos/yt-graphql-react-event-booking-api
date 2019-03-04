import React, { useState, useContext, useEffect } from 'react';

import { GraphQLContext } from '../context';
import {
  BookingList,
  BookingsChart,
  BookingsControls
} from '../components/Bookings';
import { Modal, Spinner } from '../components';
import { findInArrayById, removeFromArrayById } from '../helper/array-utils';

const BookingsPage = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [outputType, setOutputType] = useState('list');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { query } = useContext(GraphQLContext);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    const requestBody = {
      query: `
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
        `
    };

    try {
      const data = await query(requestBody);
      const bookings = data.bookings;
      setBookings(bookings);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectBookingHandler = bookingId => {
    setSelectedBooking(bookingId);
  };

  const deleteBookingHandler = async () => {
    setIsLoading(true);
    const requestBody = {
      query: `
          mutation CancelBooking($id: ID!) {
            cancelBooking(bookingId: $id) {
            _id
             title
            }
          }
        `,
      variables: {
        id: selectedBooking
      }
    };

    try {
      await query(requestBody);
      const updatedBookings = removeFromArrayById(bookings, selectedBooking);
      setBookings(updatedBookings);
    } catch (err) {
      console.log(err);
    } finally {
      setSelectedBooking(null);
      setIsLoading(false);
    }
  };

  const changeOutputTypeHandler = outputType => {
    if (outputType === 'list') {
      setOutputType('list');
    } else {
      setOutputType('chart');
    }
  };

  let content = <Spinner />;
  if (!isLoading) {
    content = (
      <React.Fragment>
        {selectedBooking && (
          <Modal
            title="Cancel Booking"
            onCancel={selectBookingHandler.bind(this, null)}
            onConfirm={deleteBookingHandler}
          >
            {findInArrayById(bookings, selectedBooking).event.title}
          </Modal>
        )}
        <BookingsControls
          activeOutputType={outputType}
          onChange={changeOutputTypeHandler}
        />
        <div>
          {outputType === 'list' ? (
            <BookingList bookings={bookings} onDelete={selectBookingHandler} />
          ) : (
            <BookingsChart bookings={bookings} />
          )}
        </div>
      </React.Fragment>
    );
  }
  return <React.Fragment>{content}</React.Fragment>;
};

export default BookingsPage;
