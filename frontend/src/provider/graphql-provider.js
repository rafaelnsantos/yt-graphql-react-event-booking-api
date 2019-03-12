import React, { useContext } from 'react';
import { GraphQLContext, AuthContext, NotificationContext } from '../context';
import { withRouter } from 'react-router-dom';

import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';

const GraphQLProvider = ({ children, history, client }) => {
  const { logout } = useContext(AuthContext);
  const { sendError } = useContext(NotificationContext);

  const Error = err => {
    err.message = err.message.substring(err.message.indexOf(':') + 1);
    if (err.message === 'Unauthenticated') {
      logout();
      sendError('Token expired, please do login again');
      history.push('/auth');
    }
    throw err;
  };

  const query = async ({ query, variables, ...rest }) => {
    try {
      const { data } = await client.query({
        query: gql(query),
        variables,
        ...rest
      });
      return data;
    } catch (err) {
      Error(err);
    }
  };

  const mutate = async ({ mutation, variables, ...rest }) => {
    try {
      const { data } = await client.mutate({
        mutation: gql(mutation),
        variables,
        ...rest
      });
      return data;
    } catch (err) {
      Error(err);
    }
  };

  const subscribe = async ({ subscription, callback }) => {
    return client
      .subscribe({
        query: gql(subscription)
      })
      .subscribe(callback);
  };

  return (
    <GraphQLContext.Provider
      value={{
        query: query,
        mutate: mutate,
        subscribe: subscribe
      }}
    >
      {children}
    </GraphQLContext.Provider>
  );
};

export default withRouter(withApollo(GraphQLProvider));
