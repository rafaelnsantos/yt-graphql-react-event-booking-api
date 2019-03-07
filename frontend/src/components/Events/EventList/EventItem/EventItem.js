import React, { useContext } from 'react';

import './EventItem.css';

import { AuthContext } from '../../../../context';

const eventItem = ({ event, onEdit, onDetail }) => {
  const { userId } = useContext(AuthContext);
  return (
    <li className="events__list-item">
      <div>
        <h1>{event.title}</h1>
        <h2>
          ${event.price} - {new Date(event.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {userId === event.creator._id ? (
          <button className="btn" onClick={onEdit.bind(this, event._id)}>
            Edit
          </button>
        ) : (
          <button className="btn" onClick={onDetail.bind(this, event._id)}>
            View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default eventItem;
