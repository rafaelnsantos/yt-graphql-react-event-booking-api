import React from 'react';
import './Error.css';
const Error = ({ message }) => (
  <React.Fragment>
    {message && <div class="error-msg">{message}</div>}
  </React.Fragment>
);

export default Error;
