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
import GAListener from './GAListener';

const App = props => {
  return (
    <BrowserRouter>
      <GAListener>
        <NotificationProvider>
          <AuthProvider>
            <ApolloProvider>
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
      </GAListener>
    </BrowserRouter>
  );
};

export default App;
