import React, { useState } from 'react';

import { NotificationContext } from '../context';

const _notifications = [];
const _warnings = [];
const _errors = [];

const queue = (queue, notification, seconds, setQueue) => {
  queue.unshift(notification);
  setQueue([...queue]);
  setTimeout(() => {
    queue.pop();
    setQueue([...queue]);
  }, seconds * 1000);
};

const AlertProvider = props => {
  const [notifications, setNotifications] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState([]);

  const sendNotification = (notification, seconds = 5) => {
    queue(_notifications, notification, seconds, setNotifications);
  };
  const sendWarning = (notification, seconds = 5) => {
    queue(_warnings, notification, seconds, setWarnings);
  };

  const sendError = (notification, seconds = 5) => {
    queue(_errors, notification, seconds, setErrors);
  };

  return (
    <NotificationContext.Provider
      value={{
        sendNotification: sendNotification,
        notifications: notifications,
        sendWarning: sendWarning,
        warnings: warnings,
        sendError: sendError,
        errors: errors
      }}
    >
      {props.children}
    </NotificationContext.Provider>
  );
};

export default AlertProvider;
