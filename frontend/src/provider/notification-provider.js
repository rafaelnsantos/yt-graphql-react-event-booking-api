import React, { useState } from 'react';

import { NotificationContext } from '../context';

const _notifications = [];
const _warnings = [];
const _errors = [];

const AlertProvider = props => {
  const [notifications, setNotifications] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState([]);

  const sendNotification = (notification, seconds = 5) => {
    _notifications.unshift(notification);
    setNotifications([..._notifications]);
    setTimeout(() => {
      _notifications.pop();
      setNotifications([..._notifications]);
    }, seconds * 1000);
  };
  const sendWarning = (notification, seconds = 5) => {
    _warnings.unshift(notification);
    setWarnings([..._warnings]);
    setTimeout(() => {
      _warnings.pop();
      setWarnings([..._warnings]);
    }, seconds * 1000);
  };

  const sendError = (notification, seconds = 5) => {
    _errors.unshift(notification);
    setErrors([..._errors]);
    setTimeout(() => {
      _errors.pop();
      setErrors([..._errors]);
    }, seconds * 1000);
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
