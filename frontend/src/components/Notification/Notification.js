import React, { useContext } from 'react';
import './Notification.css';
import { NotificationContext } from '../../context';

const Notification = props => {
  const { notifications, warnings, errors } = useContext(NotificationContext);
  return (
    <div className="wrapper">
      {errors.map((message, index) => (
        <div key={index} className="notification error-msg">
          {message}
        </div>
      ))}
      {warnings.map((message, index) => (
        <div key={index} className="notification warning-msg">
          {message}
        </div>
      ))}
      {notifications.map((message, index) => (
        <div key={index} className="notification success-msg">
          {message}
        </div>
      ))}
    </div>
  );
};

export default Notification;
