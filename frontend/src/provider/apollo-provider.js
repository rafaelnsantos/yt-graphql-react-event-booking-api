import React, { useContext } from 'react';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { AuthContext } from '../context';

const apolloProvider = ({ children }) => {
  const { token, recaptcha } = useContext(AuthContext);
  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL
  });
  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_SUBSCRIPTION,
    options: {
      reconnect: true
    }
  });
  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
  );

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      recaptcha
    }
  }));

  const cache = new InMemoryCache();
  const client = new ApolloClient({ link: authLink.concat(link), cache });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default apolloProvider;
