import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import {
  AuthProvider,
  GraphQLProvider,
  NotificationProvider,
  ApolloProvider
} from './provider';
import { MainNavigation, Notification } from './components';
import './App.css';
const App = props => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <ApolloProvider
            httpUri="https://yt-bookingapi.herokuapp.com/graphql"
            wsUri="wss://yt-bookingapi.herokuapp.com/graphql"
          >
            <GraphQLProvider>
              <MainNavigation />
              <main className="main-content">
                <Routes />
              </main>
              <Notification />
            </GraphQLProvider>
          </ApolloProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

export default App;
