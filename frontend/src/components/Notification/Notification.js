import React, { useContext } from 'react';
import './Notification.css';
import { NotificationContext } from '../../context';

const Notification = props => {
  const { notifications } = useContext(NotificationContext);
  return (
    <div className="wrapper">
      {notifications.map((message, index) => (
        <div key={index} className="notification success-msg">
          {message}
        </div>
      ))}
    </div>
  );
};

export default Notification;
