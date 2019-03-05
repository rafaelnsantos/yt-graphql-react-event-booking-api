import React from 'react';

import EventItem from './EventItem/EventItem';
import './EventList.css';
import Fragment from '../../Fragment';

const eventList = ({ events, isLoading, onEdit, onViewDetail, authUserId }) => {
  return (
    <Fragment isLoading={isLoading}>
      <ul className="event__list">
        {events.map(event => (
          <EventItem
            key={event._id}
            eventId={event._id}
            title={event.title}
            price={event.price}
            date={event.date}
            userId={authUserId}
            creatorId={event.creator._id}
            onEdit={onEdit}
            onDetail={onViewDetail}
          />
        ))}
      </ul>
    </Fragment>
  );
};

export default eventList;
