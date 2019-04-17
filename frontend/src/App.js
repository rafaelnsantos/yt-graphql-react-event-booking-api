import React from 'react';
import { HashRouter } from 'react-router-dom';
import Routes from './Routes';
import {
  AuthProvider,
  GraphQLProvider,
  NotificationProvider,
  ApolloProvider,
  RollbarProvider
} from './provider';
import { MainNavigation, Notification } from './components';
import './App.css';
import GAListener from './GAListener';
import { I18nextProvider } from 'react-i18next';

import i18n from './i18n/i18n';

const App = props => {
  return (
    <RollbarProvider>
      <I18nextProvider i18n={i18n}>
        <HashRouter>
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
        </HashRouter>
      </I18nextProvider>
    </RollbarProvider>
  );
};

export default App;
