import React from 'react';

export default React.createContext({
  sendNotification: message => {},
  notifications: []
});
