import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import AuthProvider from './provider/auth-provider';
import MainNavigation from './components/Navigation/MainNavigation';
import './App.css';
const App = props => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainNavigation />
        <main className="main-content">
          <Routes />
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
