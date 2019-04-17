import React from 'react';
import Rollbar from 'rollbar';
import { RollbarContext } from '../context';

const AuthProvider = props => {
  const rollbar = new Rollbar({
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: process.env.NODE_ENV
    },
    enabled: process.env.NODE_ENV === 'production'
  });

  const logDebug = debug => {
    rollbar.debug(debug);
  };

  const logInfo = info => {
    rollbar.info(info);
  };

  const logWarning = warning => {
    rollbar.warning(warning);
  };

  const logError = error => {
    rollbar.error(error);
  };

  const logCritical = critical => {
    rollbar.critical(critical);
  };

  return (
    <RollbarContext.Provider
      value={{
        logDebug,
        logInfo,
        logWarning,
        logError,
        logCritical
      }}
    >
      {props.children}
    </RollbarContext.Provider>
  );
};

export default AuthProvider;
