import React from 'react';
import './Error.css';
const Error = ({ message }) => (
  <React.Fragment>
    {message && (
      <div className="error-msg" id="error">
        {message}
      </div>
    )}
  </React.Fragment>
);

export default Error;
