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
const App = props => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <GraphQLProvider url="http://localhost:8000/graphql">
            <MainNavigation />
            <main className="main-content">
              <Routes />
            </main>
            <Notification />
          </GraphQLProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

export default App;
