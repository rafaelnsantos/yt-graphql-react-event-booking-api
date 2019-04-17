import React from 'react';

export default React.createContext({
  logDebug: message => {},
  logInfo: message => {},
  logWarning: message => {},
  logError: message => {},
  logCritical: message => {}
});
