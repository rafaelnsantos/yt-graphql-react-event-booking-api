import React from 'react';

import EventItem from './EventItem/EventItem';
import './EventList.css';
import Fragment from '../../Fragment';

const eventList = ({ events, isLoading, ...rest }) => {
  return (
    <Fragment isLoading={isLoading}>
      <ul className="event__list">
        {events.map(event => (
          <EventItem key={event._id} event={event} {...rest} />
        ))}
      </ul>
    </Fragment>
  );
};

export default eventList;
