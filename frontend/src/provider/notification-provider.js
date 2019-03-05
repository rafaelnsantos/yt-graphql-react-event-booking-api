import React, { useState } from 'react';

import { NotificationContext } from '../context';

const _notifications = [];

const AlertProvider = props => {
  const [notifications, setNotifications] = useState([]);
  const newNotification = (message, seconds = 5) => {
    _notifications.unshift(message);
    setNotifications([..._notifications]);
    setTimeout(() => {
      _notifications.pop();
      setNotifications([..._notifications]);
    }, seconds * 1000);
  };

  return (
    <NotificationContext.Provider
      value={{
        sendNotification: newNotification,
        notifications: notifications
      }}
    >
      {props.children}
    </NotificationContext.Provider>
  );
};

export default AlertProvider;
