import React, { useContext } from 'react';
import { GraphQLContext, AuthContext, NotificationContext } from '../context';
import { withRouter } from 'react-router-dom';
const GraphQLProvider = ({ url, children, history }) => {
  const { token, logout } = useContext(AuthContext);
  const { sendError } = useContext(NotificationContext);

  const query = async (query, variables) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ query: query, variables: variables }),
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: 'Bearer ' + token })
        }
      });

      const { errors, data } = await res.json();

      if (errors) {
        throw new Error(errors[0].message);
      }
      return data;
    } catch (err) {
      console.log(err.message === 'Unauthenticated');
      if (err.message === 'Unauthenticated') {
        logout();
        sendError('Token expired, please do login again');
        history.push('/auth');
      }
      throw err;
    }
  };

  return (
    <GraphQLContext.Provider
      value={{
        query: query
      }}
    >
      {children}
    </GraphQLContext.Provider>
  );
};

export default withRouter(GraphQLProvider);
