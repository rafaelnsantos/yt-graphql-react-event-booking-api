import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import {
  AuthProvider,
  GraphQLProvider,
  NotificationProvider
} from './provider';
import { MainNavigation, Notification } from './components';
import './App.css';

import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

const httpLink = new HttpLink({
  uri: 'http://localhost:8000/graphql'
});
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8000/graphql',
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

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});
const cache = new InMemoryCache();
const client = new ApolloClient({ link: authLink.concat(link), cache });

const App = props => {
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <NotificationProvider>
          <AuthProvider>
            <GraphQLProvider>
              <MainNavigation />
              <main className="main-content">
                <Routes />
              </main>
              <Notification />
            </GraphQLProvider>
          </AuthProvider>
        </NotificationProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
};

export default App;
