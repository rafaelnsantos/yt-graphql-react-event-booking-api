import React from 'react';

import EventItem from './EventItem/EventItem';
import './EventList.css';
import Fragment from '../../Fragment';

const eventList = ({ events, isLoading, ...rest }) => {
  console.log(rest);
  return (
    <Fragment isLoading={isLoading}>
      <ul className="event__list">
        {events.map(event => (
          <EventItem event={event} {...rest} />
        ))}
      </ul>
    </Fragment>
  );
};

export default eventList;
