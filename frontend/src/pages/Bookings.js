import React, { useState, useContext, useEffect } from 'react';

import Spinner from '../components/Spinner/Spinner';
import GraphQLContext from '../context/graphql-context';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart';
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls';

const BookingsPage = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [outputType, setOutputType] = useState('list');

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

  const deleteBookingHandler = async bookingId => {
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
        id: bookingId
      }
    };

    try {
      await query(requestBody);
      const updatedBookings = bookings.filter(
        booking => booking._id !== bookingId
      );
      setBookings(updatedBookings);
    } catch (err) {
      console.log(err);
    } finally {
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
        <BookingsControls
          activeOutputType={outputType}
          onChange={changeOutputTypeHandler}
        />
        <div>
          {outputType === 'list' ? (
            <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
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
